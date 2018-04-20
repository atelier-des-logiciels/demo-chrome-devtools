# demo-chrome-devtools

This app intends to show you how you can use chrome devtools to write efficient This app intends to show you how you can use the chrome developer tools to write efficient integration tests.

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

Run e2e tests :
```bash
$ npm run test:e2e
# or
$ node ./e2e
```

If you use `--delay` argument, [headless mode will be disabled](https://github.com/GoogleChrome/puppeteer#debugging-tips) and a full version of Chromium will be ran, this is a good way to show what's going on.
```bash
$ node e2e --delay 500
```

## Resources
- [Monitoring unused CSS](http://blog.cowchimp.com/monitoring-unused-css-by-unleashing-the-devtools-protocol/)

- [Puppeteer API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)
