#!/usr/bin/env node --require babel-register --require babel-polyfill
'use strict';

var help = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function help() {
    return _ref.apply(this, arguments);
  };
}();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _deploy_helper = require('./deploy_helper');

var _deploy_helper2 = _interopRequireDefault(_deploy_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var argv, cmd, second;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          argv = (0, _minimist2.default)(process.argv.slice(2));

          if (!(argv.help || !argv._)) {
            _context2.next = 8;
            break;
          }

          _context2.next = 5;
          return help();

        case 5:
          process.exit(0);
          _context2.next = 26;
          break;

        case 8:
          _context2.next = 10;
          return _project2.default.load();

        case 10:
          cmd = argv._.shift();
          second = argv._.shift();

          if (!(cmd == "deploy")) {
            _context2.next = 17;
            break;
          }

          _context2.next = 15;
          return _deploy_helper2.default.deploy("production");

        case 15:
          _context2.next = 25;
          break;

        case 17:
          if (!(cmd == "stage")) {
            _context2.next = 22;
            break;
          }

          _context2.next = 20;
          return _deploy_helper2.default.deploy("staging");

        case 20:
          _context2.next = 25;
          break;

        case 22:
          _context2.next = 24;
          return help();

        case 24:
          process.exit(1);

        case 25:
          process.exit(0);

        case 26:
          _context2.next = 31;
          break;

        case 28:
          _context2.prev = 28;
          _context2.t0 = _context2['catch'](0);

          console.error(_context2.t0);

        case 31:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this, [[0, 28]]);
}))();
//# sourceMappingURL=s3rig.bin.js.map