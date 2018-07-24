import _ from 'lodash';
import FS from 'async-file';
import Path from 'path';

const CONFIG_FILENAME = `s3rig.config.js`;

export default class Project {
  static async load(basePath = process.cwd()) {
    let path = basePath;
    while (!(await FS.exists(Path.join(path, CONFIG_FILENAME))) && path != "/") {
      path = Path.dirname(path);
    }
    const configPath = Path.join(path, CONFIG_FILENAME);
    this.rootPath = path;
    this.configPath = configPath;
    const config = require(configPath);
    _.each(config, (value, key)=>{
      this[key] = value;
    });
  }
}