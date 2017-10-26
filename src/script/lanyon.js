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

import dom from './minidom';

// setup listeners
var wrapper = document.getElementById('wrapper');
var sidebar = document.getElementById('sidebar');
var toggle = document.getElementById('sidebar-toggle');

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
