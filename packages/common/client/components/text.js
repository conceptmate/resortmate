var updateValueInDatabase = function() {
        
  let method = this.method;
  let docId = this.docId;
  let data = this.data;
  let modifier = this.modifier;
  let value = this.value;
  
  Meteor.call(method, docId, data, modifier, value);
};

var getValue = function (obj, key, convertToHtml) {
  let value = getObjectValue(obj, key);
  
  if (typeof convertToHtml === 'function') {
    value = convertToHtml.call(this, obj, value);
  }

  return value;
};

var updateValue = function (tmpl, obj, key, convertToHtml) {
  let value = getValue(obj, key, convertToHtml);
  let $textfield = tmpl.$('[concept-component="text"]');

  if (!value) {
    $textfield.empty();
  }
  else {
    $textfield.html(value);
  }
};

var setValue = function (tmpl, obj, key, convertToObject) {
  let $textfield = tmpl.$('[concept-component="text"]');
  let value = $textfield.html();
  
  if (typeof convertToObject === 'function') {
    value = convertToObject.call(this, obj, value);
  }
  
  setObjectValue(obj, key, value);
  return value;
};

var getObjectValue = function (obj, key) {
  // console.log('key: %o', key);
  
  if (!key) {
    return undefined;
  }
  
  var keys = key.split('.');
  var value = obj;

  try {
    keys.forEach(function (subKey) {
      value = value[subKey];
    }, this);
  }
  catch (err) {
    return undefined;
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

Template._Concept_Component_Text.onCreated(function() {
  let tmpl = this;
  let obj = this.data.data;
  let key = this.data.key;
  let value = getObjectValue(obj, key);
  tmpl.value = new ReactiveVar(value);
});

Template._Concept_Component_Text.onDestroyed(function() {
  let tmpl = this;
  delete tmpl.value;
});

Template._Concept_Component_Text.onRendered(function () {
  let tmpl = this;
  let obj = this.data.data;
  let key = this.data.key;
  let convertToHtml = this.data.convertToHtml;
  updateValue.call(this.data, tmpl, obj, key, convertToHtml);
});

Template._Concept_Component_Text.helpers({
  
  getValue: function () {
    let obj = this.data;
    let key = this.key;
    let convertToHtml = this.convertToHtml;
      
    return getValue(obj, key, convertToHtml);
  },

  updateValue: function () {
    // console.log('updateValue');
    let tmpl = Template.instance();
    if (tmpl.view.isRendered) {
      let obj = this.data;
      let key = this.key;
      let convertToHtml = this.convertToHtml;
      updateValue.call(this, tmpl, obj, key, convertToHtml);
    }
  },

  hasOptions: function () {
    // console.log('hasOptions %o', this);
    
    // ignore when template is not rendered
    let tmpl = Template.instance();
    let value = tmpl.value.get();
    
    if (!tmpl.view.isRendered) {
      return false;
    }
    
    let isFocus = tmpl.$('[concept-component="text"][contenteditable="true"]').is(':focus');
    // console.log('isFocus %o', isFocus);
    if (!isFocus) {
      return false;
    }

    let options = this.options;

    if (!options) {
      return false;
    }
    
    let data = options.data;
    if (typeof data === 'function') {
      data = data.call(this, value);
    }

    if (!data) {
      return false;
    }
    if (typeof data.count === 'function') {
      return !!data.count();
    }
    return !!data.length;
  },

  getOptionsData: function () {
    // console.log('getOptionsData=%o', this);

    let options = this.options;
    if (options && options.data) {
    
      let tmpl = Template.instance();
      let value = tmpl.value.get();

      if (typeof options.data === 'function') {
        return options.data.call(this, value);
      }
      return options.data;
    }
    return undefined;
  },
  
  getOptionValue: function (option, key) {
    let value = option[key];
    return Helpers.newlineToBr(value);
  },
  
  hasOptionTemplate: function(parentData) {
    // console.log('parentData %o', parentData);
    let hasTemplate = (typeof parentData.options.optionTemplateName !== 'undefined');
    // console.log('%s hasTemplate %s', parentData.key, hasTemplate);
    return hasTemplate;
  }
});

Template._Concept_Component_Text.events({

  'input [concept-component="text"][contenteditable="true"]': function (e, tmpl) {
    // console.log('onInput %o', this);
    
    let options = this.options;
    if (options) {
      if (options.onInput && typeof options.onInput === 'function') {
        options.onInput.call(this, e, tmpl);
      }
    }
    
    let value = tmpl.$(e.target).html();
    let obj = this.data;
    
    let convertToObject = this.convertToObject;
    if (typeof convertToObject === 'function') {
      value = convertToObject.call(this, obj, value);
    }

    tmpl.value.set(value);
  },

  'blur [concept-component="text"][contenteditable="true"]': function (e, tmpl) {
    console.log('blur %o', this);
    let obj = this.data;
    let key = this.key;
    let convertToObject = this.convertToObject;
    let value = setValue.call(this, tmpl, obj, key, convertToObject);
    // console.log(this);
    
    let update = () => {
      tmpl.value.set(undefined);
    
      if (this.meteormethod) {
        // use this.docId if set, otherwise use _id property from data if exists
        let docId = this.docId ? this.docId : this.data._id;
        
        if (this.modifierPrefix) {
          key = this.modifierPrefix + '.' + key;
        }
  
        updateValueInDatabase.call({
          method: this.meteormethod,
          docId: docId,
          data: obj,
          modifier: key,
          value: value
        });
      }
    };
    
    let options = this.options;
    if (options) {
      if (options.onBlur && typeof options.onBlur === 'function') {
        options.onBlur.call(this, e, tmpl);
      }
      
      // reset options menu -> this timeout is necessary if options exist
      tmpl.blurTimeout = Meteor.setTimeout(update, 250);
    }
    else {
      update();
    }
  },
  
  'click .select-option': function (e, tmpl) {// reset options menu
  
    if (tmpl.blurTimeout) {
      Meteor.clearTimeout(tmpl.blurTimeout);
      delete tmpl.blurTimeout;
    }
  
    // immediately reset options menu
    tmpl.value.set(undefined);
    
    let parentData = Template.parentData(0);

    // console.log('parentData %o', parentData);
    
    let value = tmpl.$(e.target).html();
    let obj = parentData.data;
    let key = parentData.key;
    
    let convertToObject = parentData.convertToObject;
    if (typeof convertToObject === 'function') {
      value = convertToObject.call(parentData, obj, value);
    }
    
    // use this.docId if set, otherwise use _id property from data if exists
    let docId = parentData.docId ? parentData.docId : parentData.data._id;
    if (parentData.meteormethod) {
      
      if (parentData.modifierPrefix) {
        key = parentData.modifierPrefix + '.' + key;
      }
    
      updateValueInDatabase.call({
        method: parentData.meteormethod,
        docId: docId,
        data: obj,
        modifier: key,
        value: value
      });
    }

    let options = parentData.options;
    if (options) {
      if (options.onSelect && typeof options.onSelect === 'function') {
        options.onSelect.call(this, e, tmpl, parentData);
      }
    }
  }
});
