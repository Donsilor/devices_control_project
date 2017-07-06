#! /usr/bin/env node

let program = require('commander');
let path = require('path');

let config = require('../package.json');
let add = require('./add');

program.allowUnknownOption();
program.version(config.version);
program.command("add <appName>")
    .action(function (appName) {
        let appPath = path.join(__dirname, `../src/${appName}`);
        let appProxy = path.join(__dirname, `../src/__global_iot_proxy/${appName}`);
        add(appPath, appProxy, appName);
    });
program.parse(process.argv);
