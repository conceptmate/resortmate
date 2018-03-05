/**
 *
 */
Template.ItemList.helpers({

});

/**
 *
 */
Template.ItemList.events({

  /**
   *
   */
  'click .reactive-table tbody > tr': function(e, tmpl) {
    var item = this;
    Router.go('item.edit', { _id: item._id });
  }
});
