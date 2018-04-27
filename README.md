# demo-chrome-devtools

This app intends to show you how you can use chrome devtools to write efficient integration tests.

------------------------

## Getting started

- Download and install `demo-chrome-devtools` :

```bash
$ git clone https://github.com/atelier-des-logiciels/demo-chrome-devtools.git
$ cd demo-chrome-devtools
$ npm install
```

- Run tests :
```bash
$ npm run test:all
```

- Build the app :
```bash
$ npm run build
```

- Start server (port 3000) :
```bash
$ npm run start
```

### Development
To use `webpack-dev-server` :
```bash
npm run dev
```

### Render optimizations
There are 2 importants render optimization using `shouldComponentUpdate`
- in [TodoList component](https://github.com/atelier-des-logiciels/demo-chrome-devtools/blob/master/src/App/TodoApp/TodoList/index.js#L16)
- in [Todo component](https://github.com/atelier-des-logiciels/demo-chrome-devtools/blob/master/src/App/TodoApp/Todo/index.js#L30)

## End-to-end tests
e2e tests are done using [puppeteer](https://github.com/GoogleChrome/puppeteer).

There are 3 steps for this moment:
  - functional tests (in `./e2e/tests/*`)
  - JS/CSS bundle coverage
  - check that there is no `console.warn` or `console.error`

#### Run e2e tests
```bash
$ npm run test:e2e
# or
$ node ./e2e
```

#### Use --delay
If you use `--delay` option, [headless mode will be disabled](https://github.com/GoogleChrome/puppeteer#debugging-tips) and a full version of Chromium will be ran, this is a good way to show what's going on.
```bash
$ node e2e --delay 500
```

#### Speed-up tests
**Note**: You can speed-up e2e tests by running `npm run build` before and using `--build=false` option
```bash
$ npm run build
$ node e2e --build=false
```

For more informations, please run `node e2e --help`

## Resources
- [Monitoring unused CSS](http://blog.cowchimp.com/monitoring-unused-css-by-unleashing-the-devtools-protocol/)

- [Puppeteer API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)
