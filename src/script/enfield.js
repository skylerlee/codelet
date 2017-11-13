/*
 *               _____      __    __
 *   ___  ____  / __(_)__  / /___/ /
 *  / _ \/ __ \/ /_/ / _ \/ / __  /
 * /  __/ / / / __/ /  __/ / /_/ /
 * \___/_/ /_/_/ /_/\___/_/\__,_/
 *
 * Designed, built, and released under MIT license by @skylerlee.
 * Learn more at https://github.com/skylerlee/codelet.
 */

import dom from './minidom';
import utils from './utils';

window.$utils = utils;

// setup listeners
var wrapper = document.getElementById('wrapper');
var sidebar = document.getElementById('sidebar');
var toggle = document.getElementById('sidebar-toggle');
var cursor = document.getElementById('page-cursor');

dom(toggle).on('click', function () {
  dom(toggle).toggleClass('active');
  if (dom(toggle).hasClass('active')) {
    dom(sidebar).addClass('open');
    dom(wrapper).addClass('shift');
  } else {
    dom(sidebar).removeClass('open');
    dom(wrapper).removeClass('shift');
  }
});

if (cursor) {
  var page = {
    min: Number(cursor.getAttribute('min')),
    max: Number(cursor.getAttribute('max')),
    gotoPage: function (num) {
      var path = location.pathname;
      var dest = path;
      if (/page\d+\/?$/.test(path)) { // page postfix
        dest = path.match(/^(.*\/)page\d+\/?$/)[1];
      }
      if (num > 1) {
        dest += 'page' + num + '/';
      }
      document.location = dest;
    }
  };

  dom(cursor).on('keypress', function (e) {
    if (e.charCode === 13) {
      var val = parseInt(cursor.value);
      if (val >= page.min && val <= page.max) {
        page.gotoPage(val);
      } else {
        dom(cursor).addClass('invalid');
      }
    }
  });
}
