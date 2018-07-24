#!/usr/bin/env node --require babel-register --require babel-polyfill

import _ from 'lodash';
import minimist from 'minimist';

import Project from './project';
import DeployHelper from './deploy_helper';

async function help() {
}

(async function() {
  try {
    const argv = minimist(process.argv.slice(2));
    if (argv.help || !argv._) {
      await help();
      process.exit(0);
    }
    else {
      await Project.load();
      const cmd = argv._.shift();
      const second = argv._.shift();
      if (cmd == "deploy") {
        await DeployHelper.deploy("production");
      } else if (cmd == "stage") {
        await DeployHelper.deploy("staging");
      } else {
        await help();
        process.exit(1);
      }
      process.exit(0);
    }
  } catch (exception) {
    console.error(exception);
  }
})();