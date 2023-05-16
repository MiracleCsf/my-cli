"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyFile = copyFile;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function copyFile(templateDir, probjectDir) {
  _fsExtra["default"].ensureDirSync(probjectDir);

  _fsExtra["default"].copySync(templateDir, probjectDir);
}