/* global Session */
/* global Router */
/**
 *
 */
Template.TextBlockList.helpers({

});

/**
 *
 */
Template.TextBlockList.events({

  /**
   *
   */
  'click .reactive-table tbody > tr': function(e, tmpl) {
    var textBlock = this;
    Router.go('text-block.edit', { _id: textBlock._id });
  }
});
