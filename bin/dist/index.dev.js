#! /usr/bin/env node
"use strict";

var _commander = require("commander");

var _create = _interopRequireDefault(require("./create.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var program = new _commander.Command();
program.name('csf-cli').description('csf的脚手架').version('1.0.0');
program.command('create').description('创建一个新项目').action(function () {
  (0, _create["default"])();
});
program.parse(process.argv);