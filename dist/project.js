'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _asyncFile = require('async-file');

var _asyncFile2 = _interopRequireDefault(_asyncFile);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONFIG_FILENAME = 's3rig.config.js';

var Project = function () {
  function Project() {
    _classCallCheck(this, Project);
  }

  _createClass(Project, null, [{
    key: 'load',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var basePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();
        var path, configPath, config;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                path = basePath;

              case 1:
                _context.next = 3;
                return _asyncFile2.default.exists(_path2.default.join(path, CONFIG_FILENAME));

              case 3:
                _context.t0 = !_context.sent;

                if (!_context.t0) {
                  _context.next = 6;
                  break;
                }

                _context.t0 = path != "/";

              case 6:
                if (!_context.t0) {
                  _context.next = 10;
                  break;
                }

                path = _path2.default.dirname(path);
                _context.next = 1;
                break;

              case 10:
                configPath = _path2.default.join(path, CONFIG_FILENAME);

                this.rootPath = path;
                this.configPath = configPath;
                config = require(configPath);

                _lodash2.default.each(config, function (value, key) {
                  _this[key] = value;
                });

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function load() {
        return _ref.apply(this, arguments);
      }

      return load;
    }()
  }]);

  return Project;
}();

exports.default = Project;
//# sourceMappingURL=project.js.map