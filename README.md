# demo-chrome-devtools

This app intends to show you how you can use chrome devtools to write efficient integration tests.

------------------------

## Getting started

- Download and install `demo-chrome-devtools` :

```bash
$ git clone https://github.com/atelier-des-logiciels/demo-chrome-devtools.git
$ cd demo-chrome-devtools
$ npm run installDeps
```

### Run End-to-end tests :
```bash
$ npm run test:e2e
```

### Build the app :
```bash
$ npm run build
```

### Start app (port 3000) :
```bash
$ npm run start
```

### Run CI process:

It does following steps:
  - Build front and server in `dist` folder
  - Run end-to-end tests
  - Deploy app

```bash
$ npm run ci
```

### Development

Start server (for API):
```bash
cd server && npm run dev
```

Start front :
```bash
cd front && npm run dev
```

### More todos
You can re-generate `initialTodolist.json` with more todos.

**e.g.**
```bash
$ ./generate-todos.js 100 > server/data/todolist.json
```

## Render optimizations
There are 2 important render optimizations using `shouldComponentUpdate`
- in [TodoList component](https://github.com/atelier-des-logiciels/demo-chrome-devtools/blob/master/src/App/TodoApp/TodoList/index.js#L16)
- in [Todo component](https://github.com/atelier-des-logiciels/demo-chrome-devtools/blob/master/src/App/TodoApp/Todo/index.js#L30)

## End-to-end tests
e2e tests are done using 
- [puppeteer](https://github.com/GoogleChrome/puppeteer).
- [lighthouse](https://github.com/GoogleChrome/lighthouse)

![e2e testing gif](https://media.giphy.com/media/3j7fkYHql8af0Lm0sD/giphy.gif)

There are 4 steps for this moment:
  - functional tests (in `./front/e2e/tests/*`)
  - JS/CSS bundle coverage
  - check that there is no `console.warn` or `console.error`
  - Compare score returned by lighthouse audit with threshold (default: 20)

### e2e tests

#### Run e2e tests
```bash
$ cd front
$
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
$ npm run build:prod
$ node e2e --build=false
```

#### Set audit score threshold

By default, lighthouse score threshold is set to 20, it can be modified using `-s=<VALUE>` option
```bash
$ node e2e -s=50
```

#### disable features

It is possible to disable tests done with puppeteer using `-t=false` option
```bash
$ node e2e -t=false
```

It is possible to disable audit done with lighthouse using `-a=false` option
```bash
$ node e2e -a=false
```



For more informations, please run `node e2e --help`

## Resources
- [Monitoring unused CSS](http://blog.cowchimp.com/monitoring-unused-css-by-unleashing-the-devtools-protocol/)

- [Puppeteer API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)
