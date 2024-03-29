import _ from 'lodash';
import Execa from 'execa';
import Project from './project';

const CF_INVALIDATE_WAIT_TIME_MS = 2000;

class DeployHelper {
  static async deploy(env) {
    try {
      await this._runCommands(env, "Building", Project.build);

      let syncTarget = `s3://${Project.buckets[env]}`;
      if (Project.prefix) {
        if (!syncTarget.endsWith("/")) {
          syncTarget += "/";
        }
        syncTarget += Project.prefix;
      }
      console.log(`Syncing to ${syncTarget}`);
      const cmd = `cd ${Project.upload} && env AWS_ACCESS_KEY_ID="${Project.accessKey}" AWS_SECRET_ACCESS_KEY="${Project.secretKey}" aws s3 sync . ${syncTarget} --delete --cache-control max-age=31536000,public`;
      console.log(`> ${cmd}`);
      await Execa.shell(cmd, { stdio: [0, 1, 2] });

      if (Project.cloudfront && Project.cloudfront[env]) {
        const dist = Project.cloudfront[env];
        console.log(`Invalidating cache ${dist}...`);
        let { stdout, stderr } = await Execa.shell(`cd ${Project.upload} && env AWS_ACCESS_KEY_ID="${Project.accessKey}" AWS_SECRET_ACCESS_KEY="${Project.secretKey}" aws cloudfront create-invalidation --distribution-id ${dist} --paths \"/*\"`);
        if (stderr) { console.error(stderr); }
        let parsed = JSON.parse(stdout);
        const invalidationId = parsed.Invalidation.Id;
        let status = parsed.Invalidation.Status;
        if (status != "Completed") {
          while (status != "Completed") {
            console.log(`  status ${status}`);
            await new Promise((resolve)=>{
              setTimeout(()=>{ resolve(); }, CF_INVALIDATE_WAIT_TIME_MS);
            });
            let { stdout, stderr } = await Execa.shell(`cd ${Project.upload} && env AWS_ACCESS_KEY_ID="${Project.accessKey}" AWS_SECRET_ACCESS_KEY="${Project.secretKey}" aws cloudfront get-invalidation --distribution-id ${dist} --id ${invalidationId}`);
            if (stderr) { console.error(stderr); }
            parsed = JSON.parse(stdout);
            status = parsed.Invalidation.Status;
          }
          console.log(`  status ${status}`);
        }
      }

      if (Project.urls && Project.urls[env]) {
        console.log(`Prewarming cache on ${Project.urls[env]}...`);
        await Execa.shell(`mkdir -p tmp/prewarmcache && wget -nd -r -P tmp/prewarmcache -A jpeg,jpg,bmp,gif,png ${Project.urls[env]} && rm -rf tmp/prewarmcache`, { stdio: [0, 1, 2] });
      }

    } finally {
      await this._runCommands(env, "Finally", Project.finally);
    }
  }

  static async _runCommands(env, label, cmds) {
    if (cmds && cmds.length > 0) {
      console.log(`${label}...`);
      for (let cmd of cmds) {
        if (_.startsWith(cmd, "//")) {
          console.log(`skipping: ${cmd}`);
          continue;
        }
        console.log(`> ${cmd}`);
        await Execa.shell(cmd, {
          env: { env, NODE_ENV: env },
          stdio: [0, 1, 2],
        });
      }
    }
  }
}

export default DeployHelper;
