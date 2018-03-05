/* global Rooms */
/* global RoomController */
RoomController = UserController.extend({

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    let roomId = this.params._id;
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);
    
    if (domain && roomId) {
      return [
        Meteor.subscribe('room', domain, roomId)
      ];
    }
    return undefined;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function () {
    let roomId = this.params._id;
    
    if (roomId) {
      return {
        room: Rooms.findOne({ _id: roomId })
      };
    }
    return undefined;
  },

  edit: function () {
    this.render('RoomEdit');
    this.renderActions('#room-form', 'rooms');
  },

  list: function () {
    this.render('RoomList');

    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          this.createAction('room.add', function() {
              Router.go('room.add');
          })
        ]
      }
    });
  }
});

Router.route('/rooms', {
  name: 'rooms',
  controller: RoomController,
  action: 'list',
});

Router.route('/rooms/add', {
  name: 'room.add',
  controller: RoomController,
  action: 'edit',
});

Router.route('/room/edit/:_id', {
  name: 'room.edit',
  controller: RoomController,
  action: 'edit',
});