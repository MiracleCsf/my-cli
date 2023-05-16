#!/usr/bin/env node

import downloadGitLab from 'download-git-repo'
import ora from 'ora'
import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs'

const cwd = process.cwd()

import fse from 'fs-extra'

// 复制目录
function copyFile(templateDir, probjectDir) {
  fse.ensureDirSync(probjectDir)
  fse.copySync(templateDir, probjectDir)
}

// 注入变量
function injectVal(prjPath, prjName, reg) {
  const ignoreList = ['.git', 'gitmessage']
  fs.readdirSync(prjPath).map((val) => {
    if (ignoreList.includes(val)) {
      return
    }
    prjPath.slice(-1) != '/' ? (prjPath += '/') : ''
    if (!val.match(/\./)) {
      injectVal(prjPath + val, prjName, reg)
    } else if (
      !(prjPath + val).match(/\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)/)
    ) {
      const data = fs.readFileSync(prjPath + val, 'utf-8')
      fs.writeFileSync(
        prjPath + val,
        data.replace(new RegExp(reg, 'g'), prjName)
      )
    }
  })
}

const createTypeList = [
  {
    type: 'list',
    message: '选择从本地复制还是远程仓库:',
    name: 'createType',
    choices: ['local', 'remote'],
  },
]
const projectTypeList = [
  {
    type: 'list',
    message: '请选择项目类型:',
    name: 'projectType',
    choices: ['vue', 'react'],
  },
]
const projectInfoList = [
  {
    type: 'input',
    message: '请输入项目名称:',
    name: 'name',
  },
  {
    type: 'input',
    message: '请输入项目描述:',
    name: 'description',
  },
]

async function create() {
  // 输入创建项目信息并获取信息
  const projectInfo = await inquirer.prompt(projectInfoList)
  const { createType } = await inquirer.prompt(createTypeList)

  if (createType == 'remote') {
    const { projectType } = await inquirer.prompt(projectTypeList)
    downloadTemplate(projectInfo, projectType)
  } else {
    cloneLocalTemplate(projectInfo)
  }
}

function cloneLocalTemplate({ name, description }) {
  // 下载项目模板
  const spinner = ora(`正在复制本地的项目模板`)
  spinner.start()
  let [dirPath, templateDir] = [
    path.join(cwd, `./projects/${name}`),
    path.join(cwd, `./my-vue-template`),
  ]
  copyFile(templateDir, dirPath)
  spinner.succeed(`复制完成`)

  const spinner2 = ora(`正在修改项目配置`)
  spinner2.start()
  injectVal(dirPath, name, '{{--name--}}')
  injectVal(dirPath, description, '{{--description--}}')
  spinner2.succeed(`修改完成`)
}

function downloadTemplate({ name, description }, projectType) {
  // 下载项目模板
  const spinner = ora(`正在下载项目模板`)
  spinner.start()
  const templateUrl = {
    vue: 'https://github.com/PanJiaChen/vue-admin-template.git#master',
    react: 'https://github.com/kenberkeley/react-demo.git#master',
  }
  downloadGitLab(
    `direct:${templateUrl[projectType]}`,
    `projects/${name}`,
    { clone: true },
    function (err) {
      if (err) {
        console.log(err)
        spinner.fail('下载项目失败，请重新试试')
        return
      }
      spinner.succeed(`下载完成`)
      // TODO 可以进入项目安装依赖啥的
    }
  )
}

export default create
