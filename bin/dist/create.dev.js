#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _downloadGitRepo = _interopRequireDefault(require("download-git-repo"));

var _ora = _interopRequireDefault(require("ora"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cwd = process.cwd();

// 复制目录
function copyFile(templateDir, probjectDir) {
  _fsExtra["default"].ensureDirSync(probjectDir);

  _fsExtra["default"].copySync(templateDir, probjectDir);
} // 注入变量


function injectVal(prjPath, prjName, reg) {
  var ignoreList = ['.git', 'gitmessage'];

  _fs["default"].readdirSync(prjPath).map(function (val) {
    if (ignoreList.includes(val)) {
      return;
    }

    prjPath.slice(-1) != '/' ? prjPath += '/' : '';

    if (!val.match(/\./)) {
      injectVal(prjPath + val, prjName, reg);
    } else if (!(prjPath + val).match(/\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)/)) {
      var data = _fs["default"].readFileSync(prjPath + val, 'utf-8');

      _fs["default"].writeFileSync(prjPath + val, data.replace(new RegExp(reg, 'g'), prjName));
    }
  });
}

var createTypeList = [{
  type: 'list',
  message: '选择从本地复制还是远程仓库:',
  name: 'createType',
  choices: ['local', 'remote']
}];
var projectTypeList = [{
  type: 'list',
  message: '请选择项目类型:',
  name: 'projectType',
  choices: ['vue', 'react']
}];
var projectInfoList = [{
  type: 'input',
  message: '请输入项目名称:',
  name: 'name'
}, {
  type: 'input',
  message: '请输入项目描述:',
  name: 'description'
}];

function create() {
  var projectInfo, _ref, createType, _ref2, projectType;

  return regeneratorRuntime.async(function create$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_inquirer["default"].prompt(projectInfoList));

        case 2:
          projectInfo = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(_inquirer["default"].prompt(createTypeList));

        case 5:
          _ref = _context.sent;
          createType = _ref.createType;

          if (!(createType == 'remote')) {
            _context.next = 15;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(_inquirer["default"].prompt(projectTypeList));

        case 10:
          _ref2 = _context.sent;
          projectType = _ref2.projectType;
          downloadTemplate(projectInfo, projectType);
          _context.next = 16;
          break;

        case 15:
          cloneLocalTemplate(projectInfo);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}

function cloneLocalTemplate(_ref3) {
  var name = _ref3.name,
      description = _ref3.description;
  // 下载项目模板
  var spinner = (0, _ora["default"])("\u6B63\u5728\u590D\u5236\u672C\u5730\u7684\u9879\u76EE\u6A21\u677F");
  spinner.start();
  var _ref4 = [_path["default"].join(cwd, "./projects/".concat(name)), _path["default"].join(cwd, "./my-vue-template")],
      dirPath = _ref4[0],
      templateDir = _ref4[1];
  copyFile(templateDir, dirPath);
  spinner.succeed("\u590D\u5236\u5B8C\u6210");
  var spinner2 = (0, _ora["default"])("\u6B63\u5728\u4FEE\u6539\u9879\u76EE\u914D\u7F6E");
  spinner2.start();
  injectVal(dirPath, name, '{{--name--}}');
  injectVal(dirPath, description, '{{--description--}}');
  spinner2.succeed("\u4FEE\u6539\u5B8C\u6210");
}

function downloadTemplate(_ref5, projectType) {
  var name = _ref5.name,
      description = _ref5.description;
  // 下载项目模板
  var spinner = (0, _ora["default"])("\u6B63\u5728\u4E0B\u8F7D\u9879\u76EE\u6A21\u677F");
  spinner.start();
  var templateUrl = {
    vue: 'https://github.com/PanJiaChen/vue-admin-template.git#master',
    react: 'https://github.com/kenberkeley/react-demo.git#master'
  };
  (0, _downloadGitRepo["default"])("direct:".concat(templateUrl[projectType]), "projects/".concat(name), {
    clone: true
  }, function (err) {
    if (err) {
      console.log(err);
      spinner.fail('下载项目失败，请重新试试');
      return;
    }

    spinner.succeed("\u4E0B\u8F7D\u5B8C\u6210"); // TODO 可以进入项目安装依赖啥的
  });
}

var _default = create;
exports["default"] = _default;