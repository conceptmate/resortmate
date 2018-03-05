/* global Rooms */
Meteor.methods({
  
  /**
   * 
   */
  addRoom: function(room) {
    check(room, Object);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Rooms.insert(room, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  updateRoom: function(modifier, roomId) {
    check(modifier, Object);
    check(roomId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Rooms.update({ _id: roomId }, modifier, {
      tx: true,
      instant: true
    });
  },
  
  /**
   *
   */
  deleteRoom: function (roomId) {
    check(roomId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Rooms.remove({ _id: roomId }, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  clearRooms: function() {
    if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Rooms.remove({}, {
      tx: true,
      instant: true
    });
  }
});