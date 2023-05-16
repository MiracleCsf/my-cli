#! /usr/bin/env node

import { Command } from 'commander'
import create from './create.js'
const program = new Command()

program.name('csf-cli').description('csf的脚手架').version('1.0.0')
program
  .command('create')
  .description('创建一个新项目')
  .action(() => {
    create()
  })

program.parse(process.argv)
