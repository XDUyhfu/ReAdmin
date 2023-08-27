#! /usr/bin/env node

const { program } = require('commander');
const HelpOptions = require('./helpOption');
const Commands = require('./command')

HelpOptions();
Commands();

program.parse(process.argv);
