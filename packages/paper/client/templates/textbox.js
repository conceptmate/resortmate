/* global Spacebars */
/* global Template */

var newlineToBr = function (value) {
  if (value) {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
  return null;
}

var brToNewline = function (value) {
  if (value) {
    return value.replace(/(?:<br \/>|<br>|<br\/>)/g, '\r\n');
  }
  return null;
}

var getObjectValue = function (obj, key) {
  var keys = key.split('.');
  var value = obj;
  
  try {
    keys.forEach(function (subKey) {
      value = value[subKey];
    }, this);
  }
  catch (err) {
    // console.error(err);
    // ignore
  }
  
  return value;
}

var setObjectValue = function (obj, key, value) {

  var keys = key.split('.');
  keys.forEach(function (subKey, index) {

    if (index === keys.length - 1) {
      obj[subKey] = value;
    }
    else {
      obj = obj[subKey];
    }
  }, this);
};

Template.TextBox.onRendered(function () {

  var data = this.data.data;
  var key = this.data.key;
  
  if (!data || !key) {
    return;
  }
  
  var value = getObjectValue(data, key);
  value = newlineToBr(value);
  
  this.$('[contenteditable]').html(value);
});

Template.TextBox.helpers({

  getValue: function (data, key) {
    var value = getObjectValue(data, key);
    return newlineToBr(value);
  },

  updateValue: function (data, key) {
    var value = getObjectValue(data, key);
    value = newlineToBr(value);

    if (Template.instance().view.isRendered) {
      Template.instance().$('[contenteditable]').html(value);
    }
  }
});

Template.TextBox.events({

  'focus [contenteditable="true"]': function (e, tmpl) {
    console.log('focus %o', this);
    
    e.preventDefault();
    e.stopImmediatePropagation();

    if (this.onFocus && typeof this.onFocus === 'function') {
      this.onFocus.call(this.data, e, tmpl);
    }
  },

  'blur [contenteditable="true"]': function (e, tmpl) {
    console.log('blur %o', this);
    
    e.preventDefault();
    e.stopImmediatePropagation();

    if (this.onBlur && typeof this.onBlur === 'function') {
      this.onBlur.call(this.data, e, tmpl);
    }
  },

  'input [contenteditable="true"]': function (e, tmpl) {
    var $target = tmpl.$(e.target);

    console.log(e);

    var value = $target.html();//.trim()
    //  .replace(/<br(\s*)\/*>/ig, '\r\n') // replace single line-breaks
    //  .replace(/<[p|div]\s/ig, '\r\n$0'); // add a line break before all div and p tags
    //.replace(/(<([^>]+)>)/ig, "");   // remove any remaining tags;

    console.log('value before %s', value);

    value = brToNewline(value);
    // value = value.substring(0, value.length - 1);
    
    console.log('value %s', value);

    setObjectValue(this.data, this.key, value);

    console.log('input %o', this);
  }
});