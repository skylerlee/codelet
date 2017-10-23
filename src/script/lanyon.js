/*
 *  ___
 * /\_ \
 * \//\ \      __      ___   __  __    ___     ___     __ __
 *   \ \ \   /'__`\  /' _ `\/\ \/\ \  / __`\ /' _ `\  _\ \\ \__
 *    \_\ \_/\ \_\.\_/\ \/\ \ \ \_\ \/\ \_\ \/\ \/\ \/\__  _  _\
 *    /\____\ \__/.\_\ \_\ \_\/`____ \ \____/\ \_\ \_\/\__  _  _\
 *    \/____/\/__/\/_/\/_/\/_/`/___/> \/___/  \/_/\/_/\/_/\_\\_\/
 *                               /\___/                  \/_//_/
 *                               \/__/
 *
 * Designed, built, and released under MIT license by @skylerlee.
 * Learn more at https://github.com/skylerlee/codelet.
 */

import * as dom from './minidom';

// setup listeners
var wrapper = document.getElementById('wrapper');
var sidebar = document.getElementById('sidebar');
var toggle = document.getElementById('sidebar-toggle');

dom.on(toggle, 'click', function () {
  dom.toggleClass(toggle, 'active');
  if (dom.hasClass(toggle, 'active')) {
    dom.addClass(sidebar, 'open');
    dom.addClass(wrapper, 'shift');
  } else {
    dom.removeClass(sidebar, 'open');
    dom.removeClass(wrapper, 'shift');
  }
});

window.loadCSS = function (url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
};

window.appendStyle = function (text) {
  var style = document.createElement('style');
  style.innerHTML = text;
  document.head.appendChild(style);
};

function _getPad(str, width) {
  width = width >> 0;
  var len = width - str.length;
  var pad = '';
  if (len < 1) {
    return pad;
  }
  while (len--) {
    pad = pad + '0';
  }
  return pad;
}

window.Date.format = function (str) {
  var datetime = new Date();
  var ctx = {
    Y: '' + datetime.getFullYear(),
    M: '' + (datetime.getMonth() + 1),
    D: '' + datetime.getDate(),
    h: '' + datetime.getHours(),
    m: '' + datetime.getMinutes(),
    s: '' + datetime.getSeconds()
  };
  return str.replace(/%(\d*)([YMDhms])/g, function (mat, digit, key) {
    var value = ctx[key];
    if (digit !== '') {
      var width = parseInt(digit);
      if (width < value.length) {
        return value.substr(0, width);
      } else {
        return _getPad(value, width) + value;
      }
    }
    return value;
  });
};
