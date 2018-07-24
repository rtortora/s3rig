'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CF_INVALIDATE_WAIT_TIME_MS = 2000;

var DeployHelper = function () {
  function DeployHelper() {
    _classCallCheck(this, DeployHelper);
  }

  _createClass(DeployHelper, null, [{
    key: 'deploy',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(env) {
        var cmd, dist, _ref2, stdout, stderr, parsed, invalidationId, status, _ref3, _stdout, _stderr;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._runCommands(env, "Building", _project2.default.build);

              case 3:

                console.log('Syncing to S3...');
                cmd = 'cd ' + _project2.default.upload + ' && env AWS_ACCESS_KEY_ID="' + _project2.default.accessKey + '" AWS_SECRET_ACCESS_KEY="' + _project2.default.secretKey + '" aws s3 sync . s3://' + _project2.default.buckets[env] + ' --delete --cache-control max-age=31536000,public';

                console.log('> ' + cmd);
                _context.next = 8;
                return _execa2.default.shell(cmd, { stdio: [0, 1, 2] });

              case 8:
                if (!(_project2.default.cloudfront && _project2.default.cloudfront[env])) {
                  _context.next = 36;
                  break;
                }

                dist = _project2.default.cloudfront[env];

                console.log('Invalidating cache ' + dist + '...');
                _context.next = 13;
                return _execa2.default.shell('cd ' + _project2.default.upload + ' && env AWS_ACCESS_KEY_ID="' + _project2.default.accessKey + '" AWS_SECRET_ACCESS_KEY="' + _project2.default.secretKey + '" aws cloudfront create-invalidation --distribution-id ' + dist + ' --paths "/*"');

              case 13:
                _ref2 = _context.sent;
                stdout = _ref2.stdout;
                stderr = _ref2.stderr;

                if (stderr) {
                  console.error(stderr);
                }
                parsed = JSON.parse(stdout);
                invalidationId = parsed.Invalidation.Id;
                status = parsed.Invalidation.Status;

                if (!(status != "Completed")) {
                  _context.next = 36;
                  break;
                }

              case 21:
                if (!(status != "Completed")) {
                  _context.next = 35;
                  break;
                }

                console.log('  status ' + status);
                _context.next = 25;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    resolve();
                  }, CF_INVALIDATE_WAIT_TIME_MS);
                });

              case 25:
                _context.next = 27;
                return _execa2.default.shell('cd ' + _project2.default.upload + ' && env AWS_ACCESS_KEY_ID="' + _project2.default.accessKey + '" AWS_SECRET_ACCESS_KEY="' + _project2.default.secretKey + '" aws cloudfront get-invalidation --distribution-id ' + dist + ' --id ' + invalidationId);

              case 27:
                _ref3 = _context.sent;
                _stdout = _ref3.stdout;
                _stderr = _ref3.stderr;

                if (_stderr) {
                  console.error(_stderr);
                }
                parsed = JSON.parse(_stdout);
                status = parsed.Invalidation.Status;
                _context.next = 21;
                break;

              case 35:
                console.log('  status ' + status);

              case 36:
                _context.prev = 36;
                _context.next = 39;
                return this._runCommands(env, "Finally", _project2.default.finally);

              case 39:
                return _context.finish(36);

              case 40:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0,, 36, 40]]);
      }));

      function deploy(_x) {
        return _ref.apply(this, arguments);
      }

      return deploy;
    }()
  }, {
    key: '_runCommands',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(env, label, cmds) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, cmd;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(cmds && cmds.length > 0)) {
                  _context2.next = 32;
                  break;
                }

                console.log(label + '...');
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 5;
                _iterator = cmds[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 18;
                  break;
                }

                cmd = _step.value;

                if (!_lodash2.default.startsWith(cmd, "//")) {
                  _context2.next = 12;
                  break;
                }

                console.log('skipping: ' + cmd);
                return _context2.abrupt('continue', 15);

              case 12:
                console.log('> ' + cmd);
                _context2.next = 15;
                return _execa2.default.shell(cmd, {
                  env: { env: env, NODE_ENV: env },
                  stdio: [0, 1, 2]
                });

              case 15:
                _iteratorNormalCompletion = true;
                _context2.next = 7;
                break;

              case 18:
                _context2.next = 24;
                break;

              case 20:
                _context2.prev = 20;
                _context2.t0 = _context2['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 24:
                _context2.prev = 24;
                _context2.prev = 25;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 27:
                _context2.prev = 27;

                if (!_didIteratorError) {
                  _context2.next = 30;
                  break;
                }

                throw _iteratorError;

              case 30:
                return _context2.finish(27);

              case 31:
                return _context2.finish(24);

              case 32:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 20, 24, 32], [25,, 27, 31]]);
      }));

      function _runCommands(_x2, _x3, _x4) {
        return _ref4.apply(this, arguments);
      }

      return _runCommands;
    }()
  }]);

  return DeployHelper;
}();

exports.default = DeployHelper;
//# sourceMappingURL=deploy_helper.js.map