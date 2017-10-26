/*
 * minimal dom utils
 * Designed, built, and released under MIT license by @skylerlee.
 * Learn more at https://github.com/skylerlee/codelet.
 */

/*
 * constructor
 */

function dom(el) {
  this.el = el;
}

dom.fn = dom.prototype;

/*
 * Event utils
 * For browsers except ie<=8
 */

var handlerMap = {};
var uidCount = 1000;

function getUID(el) {
  if (!el._uid_) {
    el._uid_ = uidCount++;
  }
  return el._uid_;
}

function _addHandler(uid, event, fn) {
  if (!handlerMap[uid]) {
    handlerMap[uid] = [];
  }
  handlerMap[uid].push({
    event: event,
    fn: fn
  });
}

function _removeHandler(uid, event, fn) {
  var handlers = handlerMap[uid];
  if (handlers) {
    var result = [];
    handlers.forEach(function (handler) {
      if (handler.event === event) {
        if (fn === undefined) {
          result.push(handler);
        } else if (handler.fn === fn) {
          result.push(handler);
        }
      }
    });
    // remove handlers
    result.forEach(function (handler) {
      var i = handlers.indexOf(handler);
      handlers.splice(i, 1);
    });
    return result;
  }
}

function on(event, fn) {
  this.el.addEventListener(event, fn);
  var uid = getUID(this.el);
  _addHandler(uid, event, fn);
}

function off(event, fn) {
  var handlers = _removeHandler(this.el._uid_, event, fn);
  if (handlers) {
    handlers.forEach(function (handler) {
      this.el.removeEventListener(handler.event, handler.fn);
    });
  }
}

dom.fn.on = on;
dom.fn.off = off;

/*
 * ClassName utils
 * For browsers without classList support.
 */

function _trim(str) {
  return str.replace(/^[\s]+|[\s]+$/g, '');
}

function _getClass(el) {
  return ' ' + _trim(el.className || '') + ' ';
}

function _setClass(el, className) {
  el.className = _trim(className);
}

function hasClass(clz) {
  return _getClass(this.el).indexOf(' ' + clz + ' ') > -1;
}

function addClass(clz) {
  if (!this.hasClass(clz)) {
    _setClass(this.el, _getClass(this.el) + clz);
  }
}

function removeClass(clz) {
  if (this.hasClass(clz)) {
    _setClass(this.el, _getClass(this.el).replace(' ' + clz + ' ', ' '));
  }
}

function toggleClass(clz) {
  this.hasClass(clz) ? this.removeClass(clz) : this.addClass(clz);
}

dom.fn.hasClass = hasClass;
dom.fn.addClass = addClass;
dom.fn.removeClass = removeClass;
dom.fn.toggleClass = toggleClass;

export default dom;
