/* global Template */
/* global AutoForm */
Template.TextBlockEdit.helpers({

  /**
   *
   */
  insertOrUpdate: function () {
    if (this.textBlock && this.textBlock._id) {
      return "method-update";
    }
    return "method";
  },
  
  /*
   *
   */
  insertOrUpdateMethod: function () {
    if (this.textBlock && this.textBlock._id) {
      return "updateTextBlock";
    }
    return "addTextBlock";
  }
});

Template.TextBlockEdit.events({

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("text-block-form")) {
      Router.go('text-blocks');
    }
  },
});
