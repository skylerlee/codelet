/*
 * minimal dom utils
 * Designed, built, and released under MIT license by @skylerlee.
 * Learn more at https://github.com/skylerlee/codelet.
 */

var handlerMap = {};
var uidCount = 1000;

function getUID(el) {
  if (!el._uid_) {
    el._uid_ = uidCount++;
  }
  return el._uid_;
}

function addHandler(uid, event, fn) {
  if (!handlerMap[uid]) {
    handlerMap[uid] = [];
  }
  handlerMap[uid].push({
    event: event,
    fn: fn
  });
}

function on(el, event, fn) {
  el.addEventListener(event, fn);
  var uid = getUID(el);
  addHandler(uid, event, fn);
}

function _trim(str) {
  return str.replace(/^[\s]+|[\s]+$/g, '');
}

function _getClass(el) {
  return ' ' + _trim(el.className || '') + ' ';
}

function _setClass(el, className) {
  el.className = _trim(className);
}

function hasClass(el, clz) {
  return _getClass(el).indexOf(' ' + clz + ' ') > -1;
}

function addClass(el, clz) {
  if (!hasClass(el, clz)) {
    _setClass(el, _getClass(el) + clz);
  }
}

function removeClass(el, clz) {
  if (hasClass(el, clz)) {
    _setClass(el, _getClass(el).replace(' ' + clz + ' ', ' '));
  }
}

function toggleClass(el, clz) {
  hasClass(el, clz) ? removeClass(el, clz) : addClass(el, clz);
}

export {
  hasClass,
  addClass,
  removeClass,
  toggleClass
}
