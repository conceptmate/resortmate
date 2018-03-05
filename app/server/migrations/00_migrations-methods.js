Meteor.methods({

  migrateToLatest: function () {
    if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    return Migrations.migrateTo('latest');
  },

  migrateTo: function (version) {
    // check(version, Number);

    if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    return Migrations.migrateTo(version);
  },

  unlockMigrations: function () {
    if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return Migrations._collection.update({
      _id: 'control'
    }, {
        $set: {
          locked: false
        }
      });
  }
});