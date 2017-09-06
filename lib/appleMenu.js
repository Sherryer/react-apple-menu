'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppleMenu = function (_Component) {
    _inherits(AppleMenu, _Component);

    function AppleMenu() {
        var _ref;

        _classCallCheck(this, AppleMenu);

        for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
            props[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = AppleMenu.__proto__ || Object.getPrototypeOf(AppleMenu)).call.apply(_ref, [this].concat(props)));

        if (_this.props.left || _this.props.right) {
            _this.getDistance = _this.getDistanceRow.bind(_this);
        } else {
            _this.getDistance = _this.getDistanceColumn.bind(_this);
        }
        _this.mouseEnter = _this.mouseEnter.bind(_this);
        _this.easeOut = _this.easeOut.bind(_this);
        _this.mouseMove = _this.mouseMove.bind(_this);
        _this.mouseOut = _this.mouseOut.bind(_this);
        _this.filterImg = _this.filterImg.bind(_this);
        _this.inOut = true;
        _this.mouseMoveBegin = false;
        _this.Changes = [];
        _this.size = Math.abs(_this.props.size) || 64;
        _this.zoom = Math.abs(Number(_this.props.zoom)) || 0.5;
        _this.iMax = Math.floor(_this.size * 3.125);
        _this.maxSize = _this.size * _this.zoom + _this.size;
        return _this;
    }

    _createClass(AppleMenu, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.size = Math.abs(nextProps.size) || 64;
            this.zoom = Math.abs(Number(nextProps.zoom)) || 0.5;
            this.iMax = Math.floor(this.size * 3.125);
            this.maxSize = this.size * this.zoom + this.size;
        }
    }, {
        key: 'mouseEnter',
        value: function mouseEnter(ev) {
            var _this2 = this;

            this.mouseMoveBegin = false;
            this.inOut = true;
            var oEvent = ev || event;
            var target = this.refs.target;
            var aImg = target.getElementsByTagName('img');

            var _loop = function _loop(i) {
                var d = _this2.getDistance(aImg[i], target, oEvent);
                d = Math.min(d, _this2.iMax);
                var changeNum = (_this2.iMax - d) / _this2.iMax * _this2.size * _this2.zoom;
                _this2.Changes[i] = changeNum;

                var t = 0;
                var during = 10;
                var step = function step() {
                    var value = _this2.easeOut(t, _this2.size, changeNum, during);
                    if (value - _this2.size > _this2.Changes[i]) {
                        _this2.mouseMoveBegin = true;
                        return;
                    }
                    aImg[i].style.width = value + "px";
                    aImg[i].style.height = value + "px";
                    t++;
                    if (t <= during && _this2.inOut && !_this2.mouseMoveBegin) {
                        requestAnimationFrame(step);
                    }
                };
                step();
            };

            for (var i = 0; i < aImg.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'mouseMove',
        value: function mouseMove(ev) {
            var oEvent = ev || event;
            var target = this.refs.target;
            var aImg = target.getElementsByTagName('img');
            var d = 0;

            for (var i = 0; i < aImg.length; i++) {
                d = this.getDistance(aImg[i], target, oEvent);
                d = Math.min(d, this.iMax);
                this.Changes[i] = (this.iMax - d) / this.iMax * this.size * this.zoom;
                if (this.mouseMoveBegin) {
                    aImg[i].style.width = this.Changes[i] + this.size + 'px';
                    aImg[i].style.height = this.Changes[i] + this.size + 'px';
                }
            }
        }
    }, {
        key: 'mouseOut',
        value: function mouseOut() {
            var _this3 = this;

            this.inOut = false;
            this.mouseMoveBegin = false;
            var target = this.refs.target;
            var aImg = target.getElementsByTagName('img');

            var _loop2 = function _loop2(i) {
                var t = 0;
                var during = 15;
                var step = function step() {
                    var value = _this3.easeOut(t, aImg[i].offsetWidth, _this3.size - aImg[i].offsetWidth, during);
                    aImg[i].style.width = value + "px";
                    aImg[i].style.height = value + "px";
                    t++;
                    if (t <= during && !_this3.inOut) {
                        requestAnimationFrame(step);
                    } else {}
                };
                step();
            };

            for (var i = 0; i < aImg.length; i++) {
                _loop2(i);
            }
        }
    }, {
        key: 'getDistanceColumn',
        value: function getDistanceColumn(img, target, oEvent) {
            return Math.abs(img.offsetLeft + target.offsetLeft - oEvent.clientX + img.offsetWidth / 2);
        }
    }, {
        key: 'getDistanceRow',
        value: function getDistanceRow(img, target, oEvent) {
            return Math.abs(img.offsetTop + target.offsetTop - oEvent.clientY + img.offsetHeight / 2);
        }
    }, {
        key: 'easeOut',
        value: function easeOut(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        }
    }, {
        key: 'filterImg',
        value: function filterImg(body, img) {
            var src = [];
            var imgs = _react2.default.Children.map(this.props.children, function (child, index) {
                if (child.type == "img") {
                    return _react2.default.createElement('img', _extends({ style: img }, child.props));
                }
            });
            return imgs;
        }
    }, {
        key: 'render',
        value: function render() {
            var position = "bottom";
            var order = "flex-end";
            var flexDirection = "row";
            var width = "100%";
            var height = void 0;
            var justifyContent = "center";
            if (this.props.top) {
                position = "top";
                order = "flex-start";
                flexDirection = "row";
                var _width = "100%";
            } else if (this.props.left) {
                position = "left";
                order = "flex-start";
                flexDirection = "column";
                width = this.maxSize + 10 + "px";
                height = "100%";
            } else if (this.props.right) {
                position = "right";
                order = "flex-end";
                flexDirection = "column";
                width = this.maxSize + 10 + "px";
                height = "100%";
            }

            if (this.props.stretch) {
                justifyContent = "space-around";
            }

            var body = {
                position: "absolute",
                display: "flex",
                justifyContent: justifyContent,
                width: width,
                flexDirection: flexDirection,
                height: height
            };

            body[position] = 0;

            var img = {
                width: this.size + "px",
                height: this.size + "px",
                alignSelf: order
            };

            return _react2.default.createElement(
                'div',
                { ref: 'target', onMouseEnter: this.mouseEnter, onMouseMove: this.mouseMove, onMouseLeave: this.mouseOut, style: body },
                this.filterImg(body, img)
            );
        }
    }]);

    return AppleMenu;
}(_react.Component);

AppleMenu.defaultProps = {
    size: 64,
    zoom: 0.5
};

exports.default = AppleMenu;