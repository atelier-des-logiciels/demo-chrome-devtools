#!/usr/bin/env node

/* eslint-env node */

const lorem = require('lorem-ipsum');
const _ = require('lodash');

const argv = require('yargs')
  .usage('Usage: $0 [number]')
  .describe('version', 'Print current version')
  .help('h')
  .alias('h', 'help')
  .argv;

const n = argv._[0] || 1;

const boolRand = () => Boolean(_.random(0, 1));

const createTodo = () => ({
  done: boolRand(),
  value: lorem(),
});

const todos = _.times(n, createTodo);

process.stdout.write(JSON.stringify(todos, null, 2));
