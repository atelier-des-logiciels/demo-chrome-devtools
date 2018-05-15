/* eslint-disable no-console */

const clc = require("cli-color");
const path = require("path");
const { promisify } = require("util");
const pti = require("puppeteer-to-istanbul");
const webpack = promisify(require("webpack"));
const rimraf = promisify(require("rimraf"));
const puppeteer = require("puppeteer");
const chromeLauncher = require("chrome-launcher");
const lighthouse = require("lighthouse");

const { getCoverageReport, getAuditResults } = require("./utils");
const log = require("./log");

const serve = require("../../server/src/server");

/* ************************************************************************* */

const build = async config => {
  if (config.BUILD) {
    const stats = await webpack(config.WEBPACK_CONFIG);
    const info = stats.toJson();
    if (info.errors.length) {
      throw info.errors[0];
    }
    return stats;
  }
};

const clean = config => {
  if (config.BUILD) {
    return rimraf(config.DIST_FOLDER);
  }
};

const startServer = config =>
  serve({
    staticPath: path.join(config.DIST_FOLDER),
    port: config.PORT,
    dataPath: __dirname
  });

const startBrowser = config => puppeteer.launch(config.PUPPETEER_OPTIONS);

const launchChromeAndRunLighthouse = async (url, flags, config = null) => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless'],
  })
  flags.port = chrome.port;
  const results = await lighthouse(url, flags, config);
  await chrome.kill();
  return results;
}

const execTests = async ({ tests, config, browser, page }) => {
  const consoleMessages = [];
  page.on("console", msg => {
    if (msg.type() === "error") {
      consoleMessages.push({ type: "error", text: msg.text() });
    } else if (msg.type() === "warning") {
      consoleMessages.push({ type: "warning", text: msg.text() });
    }
  });

  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ]);
  await page.goto(`${config.HOST}:${config.PORT}`);
  for (const test of tests) {
    const runningTest = test.run({ config, browser, page });
    try {
      await log.withIndent()(test.file, runningTest);
    } catch (e) {
      console.error(clc.red(e));
      process.exitCode = 1;
    }
  }
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage()
  ]);
  pti.write(jsCoverage);
  return { jsCoverage, cssCoverage, consoleMessages };
};

const checkConsoleUsage = ({ consoleMessages }) => {
  consoleMessages.length && process.stdout.write("\n");
  consoleMessages.forEach(({ type, text }) => {
    const color = type === "error" ? "red" : "yellow";
    const paint = clc[color];
    console.log(`${paint.bold(type)}: ${paint(text)}`);
  });
  consoleMessages.length && process.stdout.write("\n");
  if (consoleMessages.length) {
    throw new Error(
      'There is one or more "console.error" and/or "console.warn"'
    );
  }
};

/* ************************************************************************* */

const runTests = async (config) => {
  const tests = require("./tests");
  const browser = await log("start browser", startBrowser(config));
  const page = await log("open a new page", browser.newPage());
  console.log("=> run tests...");
  const testReport = await execTests({ tests, config, browser, page });
  const { jsCoverage, cssCoverage } = testReport;

  await log("close page", page.close());
  await log("close browser", browser.close());

  process.stdout.write("\n=> JS and CSS bundles coverage report\n");
  getCoverageReport([...jsCoverage, ...cssCoverage]).forEach(x =>
    console.log(clc.italic.yellow(x))
  );

  checkConsoleUsage(testReport);
};

const runAudit = async (config) => {
  console.log("=> run audit ...");

  // available options - https://github.com/GoogleChrome/lighthouse/#cli-options
  const lhFlags = {};
  const lhConfig = {
    extends: 'lighthouse:default',
    // https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/default-config.js
    settings: { onlyCategories: ["performance", "pwa", "accessibility", "best-practices", "seo"] }
  };
  const lhResults = await launchChromeAndRunLighthouse(
    config.getUrl(),
    lhFlags,
    lhConfig
  );

  getAuditResults(lhResults).forEach(
    (r, i)  => 
      console.log(`${i != 0 ? '  ' : ''}${clc.italic.yellow(r)}`) 
  );

  if (lhResults.score < config.SCORE) {
    throw new Error(
      `Actual score is ${Math.floor(lhResults.score)}. Minimum score is ${config.SCORE}`
    );
  }
  return lhResults;
};

/* ************************************************************************* */

(async () => {
  const config = require("./configuration");

  if (config.BUILD) {
    await log("build", build(config));
  }

  const server = await log("start server", startServer(config));

  try {
    config.RUN_TESTS && await runTests(config);
    config.RUN_AUDIT && await runAudit(config);
  } finally {
    await log("stop server", server.close());
    server.close();

    if (config.BUILD) {
      await log("clean", clean(config));
    }
  }
})();
