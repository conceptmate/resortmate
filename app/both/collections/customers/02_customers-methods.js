/* global check */
Meteor.methods({

  /**
   * 
   */
  addCustomer: function (customer) {
    check(customer, Object);
    
    if (!Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Customers.insert(customer, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  updateCustomer: function(modifier, customerId) {
    check(modifier, Object);
    check(customerId, String);
    
    if (!Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Customers.update({ _id: customerId }, modifier, {
      tx: true,
      instant: true
    });
  },
  
  /**
   *
   */
  deleteCustomer: function (customerId) {
    check(customerId, String);
    
    if (!Roles.userIsInRole(this.userId, ['curator', 'accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Customers.remove({ _id: customerId }, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  clearCustomers: function() {
    if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Customers.remove({}, {
      tx: true,
      instant: true
    });
  }
});