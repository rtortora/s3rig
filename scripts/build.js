import _ from 'lodash';
import minimist from 'minimist';
import execa from 'execa';
import FS from 'async-file';

(async()=>{
  try {
    let bumpedTo;
    const argv = minimist(process.argv.slice(2));
    if(_.isUndefined(argv.sync) || argv.sync) {
      await execa.shell(`git checkout master && git pull`);
    }
    if(_.isUndefined(argv.bump) || argv.bump) {
      const content = JSON.parse(await FS.readFile("package.json"));
      const version = _.map(content.version.split("."), (x)=>parseInt(x));
      let nextVersion;
      if (argv.major) {
        nextVersion = [version[0] + 1, version[1], version[2]];
      } else if (argv.patch) {
        nextVersion = [version[0], version[1], version[2] + 1];
      } else {
        nextVersion = [version[0], version[1] + 1, 0];
      }
      bumpedTo = nextVersion.join('.');
      console.log(`Bumping from ${content.version} to ${bumpedTo}`);
      content.version = bumpedTo;
      await FS.writeFile("package.json", JSON.stringify(content, null, 2) + "\n");
    }
    if(_.isUndefined(argv.build) || argv.build) {
      await execa.shell(`node_modules/.bin/babel --source-maps -d dist/ src/`, { stdio: [ 0, 1, 2 ] });
    }
    if(_.isUndefined(argv.sync) || argv.sync) {
      try {
        await execa.shell(`git add --all && git commit -m 'bump'`);
      } catch(exception) { /* do nothing */ }
      await execa.shell(`git pull && git push && git checkout stable && git merge master && git push`, { stdio: [ 0, 1, 2 ] });
      if(bumpedTo && (_.isUndefined(argv.tag) || argv.tag)) {
        await execa.shell(`git tag -a ${bumpedTo} -m '${bumpedTo}' && git push origin ${bumpedTo}`, { stdio: [ 0, 1, 2 ] });
      }
      await execa.shell(`git checkout master`, { stdio: [ 0, 1, 2 ] });
    }
    if (bumpedTo) {
      console.log(`Built version ${bumpedTo}`);
    }
    process.exit(0);
  } catch (exception) {
    console.error(exception);
    process.exit(1);
  }
})();