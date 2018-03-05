/* global ReactiveVar */
AutoForm.addInputType("object-select", {
  template: "afObjectSelect",
  valueOut: function () {
    let data = this.data();
    return data.objectId || null;
  },
  contextAdjust: function (context) {
    // remove custom attributes, otherwise AutoForm
    // will throw an exception
    context.config = context.atts.config;
    delete context.atts.config;

    return context;
  }
});

Template.afObjectSelect.onCreated(function () {
  this.value = new ReactiveVar(this.data.value);
  this.options = new ReactiveVar();
});

Template.afObjectSelect.onRendered(function () {
  
  // set selected object id
  this.autorun(() => {

    let objectId = this.value.get();
    let $element = this.$('*[data-schema-key="' + this.data.name + '"]');

    if (objectId) {
      $element.data('objectId', objectId);
    }
    else {
      $element.removeData('objectId');
    }
  });
});

Template.afObjectSelect.helpers({
  
  /**
   * 
   */
  templateName: function () {
    return this.config.template;
  },
  
  /**
   * 
   */
  optionTemplateName: function () {
    let parentData = Template.parentData(1);
    let optionTemplate = parentData.config.optionTemplate;

    if (!optionTemplate) {
      optionTemplate = 'afObjectSelectOptionTemplate'
    }

    return optionTemplate;
  },
  
  /**
   * 
   */
  templateData: function () {
    if (this.config) {
      let config = this.config;
      let tmpl = Template.instance();
      let value = tmpl.value.get();

      if (typeof config.data === 'function') {
        return config.data.call(this, value);
      }
      return config.data;
    }

    return undefined;
  },
  
  /**
   * 
   */
  hasValue: function () {
    let tmpl = Template.instance();
    return !!tmpl.value.get();
  },
  
  /**
   * 
   */
  hasOptions: function () {
    let tmpl = Template.instance();
    let options = tmpl.options.get();
    
    // no options yet
    if (!options) {
      return false;
    }

    let count = 1;
    
    // arrays have a length property
    if (typeof options.length !== 'undefined') {
      count = options.length;
    }
    // mongo cursors have a count function
    else if (typeof options.count !== 'undefined') {
      count = options.count();
    }

    console.log('count %o', count);
    
    // TODO add count for object literal
    
    return !!options && count > 0;
  },
  
  /**
   * 
   */
  options: function () {
    let tmpl = Template.instance();
    return tmpl.options.get();
  }
});

Template.afObjectSelect.events({

  'click .clear-object': function (e, tmpl) {
    // console.log('clear object %o', this);
    tmpl.value.set(undefined);
    tmpl.data.value = undefined;
    // tmpl.$('.object-select').data('objectId', undefined);
  },

  'input .search-input': function (e, tmpl) {
    let $target = tmpl.$(e.target);
    let value = $target.val();

    let data = tmpl.data;
    let config = data.config;

    if (typeof config.options === 'function') {
      let options = config.options.call(tmpl.data, value);
      if (options) {
        tmpl.options.set(undefined);
        tmpl.options.set(options);
      }
    }
  },

  'blur .search-input': function (e, tmpl) {
    // set timeout, otherwise select-option event will
    // not have enough time to be triggered
    Meteor.setTimeout(() => {
      tmpl.options.set(undefined);
    }, 250);
  },

  'keydown .search-input': function (e, tmpl) {
    console.log('code=%o', e.keyCode);
    switch (e.keyCode) {
      // ESC key
      case 27:
        tmpl.options.set(undefined);
        break;
      // Arrow ENTER
      case 13:
        break;
      // Arrow LEFT
      case 37:
        break;
      // Arrow UP
      case 38:
        break;
      // Arrow RIGHT
      case 39:
        break;
      // Arrow DOWN
      case 40:
        break;
    }
  },

  'click .select-option': function (e, tmpl) {
    tmpl.options.set(undefined);
    tmpl.value.set(this._id);
    tmpl.data.value = this._id;
  }
});
