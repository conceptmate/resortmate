if (Meteor.isServer) {

  if (Meteor.roles.find({}).count() === 0) {

    let roles = [
      { name: 'admin', description: 'Administrator' },
      { name: 'manager', description: 'Manager' }
    ];

    _.each(roles, function (role) {
      Meteor.roles.insert(role);
    });
  }
  
  // in server/publish.js
  Meteor.publish(null, function () {
    if (Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      return Meteor.roles.find({});
    }
    this.ready();
  });
}