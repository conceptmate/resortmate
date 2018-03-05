/* global i18npf */
/* global i18nf */
/* global i18n */
/* global i18np */
i18np = function (prefix, key) {
  return i18n(prefix + '.' + key);
};

i18nf = function (key) {
  var stringFormat = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };

  var i18nTemplate = i18n(key);
  
  // remove i18n key and replace it with i18n template
  var args = Array.prototype.slice.call(arguments, 1);
  
  // insert i18n template as first argument
  args.unshift(i18nTemplate);
  
  // finally format template string with passed arguments and returned it
  return stringFormat.apply(this, args);
};

i18npf = function (prefix, key) {
  return i18nf(prefix + '.' + key);
};