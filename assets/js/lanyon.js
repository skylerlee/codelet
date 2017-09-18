/*
 *  ___
 * /\_ \
 * \//\ \      __      ___   __  __    ___     ___
 *   \ \ \   /'__`\  /' _ `\/\ \/\ \  / __`\ /' _ `\
 *    \_\ \_/\ \_\.\_/\ \/\ \ \ \_\ \/\ \_\ \/\ \/\ \
 *    /\____\ \__/.\_\ \_\ \_\/`____ \ \____/\ \_\ \_\
 *    \/____/\/__/\/_/\/_/\/_/`/___/> \/___/  \/_/\/_/
 *                               /\___/
 *                               \/__/
 *
 * Designed, built, and released under MIT license by @skylerlee.
 * Learn more at https://github.com/skylerlee/codelet.
 */

(function(exports) {
  // mini css utils
  var $css = {};

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

  $css.hasClass = hasClass;
  $css.addClass = addClass;
  $css.removeClass = removeClass;
  $css.toggleClass = toggleClass;

  exports.$css = $css;
})(window);

(function() {
  // setup listeners
  var sidebar = document.getElementById('sidebar');
  var toggle = document.getElementById('sidebar-toggle');
  toggle.addEventListener('click', function () {
    $css.toggleClass(toggle, 'active');
    if ($css.hasClass(toggle, 'active')) {
      $css.addClass(sidebar, 'open');
    } else {
      $css.removeClass(sidebar, 'open');
    }
  });
})();
