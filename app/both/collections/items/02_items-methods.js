/* global Items */
Meteor.methods({
  
  /**
   * 
   */
  addItem: function(item) {
    check(item, Object);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Items.insert(item, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  updateItem: function(modifier, itemId) {
    check(modifier, Object);
    check(itemId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Items.update({ _id: itemId }, modifier, {
      tx: true,
      instant: true
    });
  },
  
  /**
   *
   */
  deleteItem: function (itemId) {
    check(itemId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Items.remove({ _id: itemId }, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  clearItems: function() {
    if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Items.remove({}, {
      tx: true,
      instant: true
    });
  }
});