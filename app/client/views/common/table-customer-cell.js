Template.TableCustomerCell.helpers({
  
  /**
   * Subscribes to receive customer and returns the corresponding customer
   * object.
   */
  customer: function(customerId) {
    let userId= Meteor.userId();
    Meteor.subscribe('customer', Meteor.userDomain(userId), customerId);
    return Customers.findOne({ _id: customerId });
  }
});