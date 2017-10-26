/*
 * Utility functions
 */

function loadCSS(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

function appendCSS(text) {
  var style = document.createElement('style');
  style.innerHTML = text;
  document.head.appendChild(style);
}

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

function _getTimezone(date) {
  var str = '';
  var offset = date.getTimezoneOffset();
  if (offset <= 0) {
    str += '+';
  } else {
    str += '-';
  }
  offset = Math.abs(offset);
  var h = '' + Math.floor(offset / 60);
  var m = '' + (offset % 60);
  str = str + _getPad(h, 2) + h;
  str = str + _getPad(m, 2) + m;
  return str;
}

function formatDate(str) {
  var datetime = new Date();
  var ctx = {
    Y: '' + datetime.getFullYear(),
    M: '' + (datetime.getMonth() + 1),
    D: '' + datetime.getDate(),
    h: '' + datetime.getHours(),
    m: '' + datetime.getMinutes(),
    s: '' + datetime.getSeconds(),
    z: '' + _getTimezone(datetime)
  };
  return str.replace(/%(\d*)([YMDhmsz])/g, function (mat, digit, key) {
    var value = ctx[key];
    if (digit !== '') {
      var width = parseInt(digit);
      if (width < value.length) {
        return value.substr(value.length - width, width);
      } else {
        return _getPad(value, width) + value;
      }
    }
    return value;
  });
}

export default {
  loadCSS: loadCSS,
  appendCSS: appendCSS,
  formatDate: formatDate
};
