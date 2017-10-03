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
toggle.addEventListener('click', function () {
  dom.toggleClass(toggle, 'active');
  if (dom.hasClass(toggle, 'active')) {
    dom.addClass(sidebar, 'open');
    dom.addClass(wrapper, 'shift');
  } else {
    dom.removeClass(sidebar, 'open');
    dom.removeClass(wrapper, 'shift');
  }
});
