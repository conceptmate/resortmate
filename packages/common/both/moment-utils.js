/* global momentDay */
momentDay = function() {
  return moment.utc.apply(this, arguments).startOf('day');
}