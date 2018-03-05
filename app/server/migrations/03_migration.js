/* global Migrations */
var newRoles = [
  { name: 'accountant', description: 'Accountant' },
  { name: 'curator', description: 'Curator' }
]

Migrations.add({
  version: 3,
  name: 'Add accountant and curator roles.',
  up: function () {
    _.each(newRoles, function (role) {
      Meteor.roles.insert(role);
    });
  },
  down: function () {
    _.each(newRoles, function (role) {
      Meteor.roles.remove({
        name: role.name
      });
    });
  }
});