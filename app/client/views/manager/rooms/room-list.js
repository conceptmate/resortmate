/**
 *
 */
Template.RoomList.helpers({

});

/**
 *
 */
Template.RoomList.events({

  /**
   *
   */
  'click .reactive-table tbody > tr': function(e, tmpl) {
    var room = this;
    Router.go('room.edit', { _id: room._id });
  }
});
