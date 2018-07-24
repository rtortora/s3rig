# s3rig

Easy S3+CloudFront deployments.

## Installation

Install AWS CLI if needed:

    pip install awscli

Then add the library:

    yarn add --dev git+ssh://git@github.com/rtortora/s3rig#stable

Create a file called s3rig.config.js that looks like so:

```js
module.exports = {
  accessKey: "<access key>",
  secretKey: "<secret key>",
  build: [
    "cp -f config.$env.js config.js",
    "rm -rf out/*",
    "node_modules/.bin/next build && node_modules/.bin/next export",
  ],
  finally: [
    "cp -f config.development.js config.js",
  ],
  upload: "out",
  buckets: {
    production: "<bucket name>",
    staging: "<bucket name>",
  },
  cloudfront: {
    production: "<distribution id>",
    staging: "<distribution id>",
  },
};
```

And lastly modify your package.json with the following scripts:

```js
{
  "scripts": {
    "stage": "node_modules/.bin/s3rig stage",
    "deploy": "node_modules/.bin/s3rig deploy"
  }
}
```
