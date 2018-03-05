if (Meteor.isServer) {

  Meteor.methods({

    getCounters: function () {
      if (!Roles.userIsInRole(this.userId, ['manager', 'admin'], Meteor.userDomain(this.userId))) {
        throw new Meteor.Error(401, 'Permission denied');
      }

      let documentTypes = ['offer', 'invoice'];

      let counters = [];
      _.each(documentTypes, (documentType) => {
        let value = incrementCounter('countCollection', Meteor.userDomain(this.userId) + '.' + documentType, 0);
        counters.push({
          name: documentType,
          value: value
        });
      });
      return counters;
    },

    setCounters: function (counters) {
      if (!Roles.userIsInRole(this.userId, ['manager', 'admin'], Meteor.userDomain(this.userId))) {
        throw new Meteor.Error(401, 'Permission denied');
      }

      console.log('counters ', counters);
      _.each(counters, (counter) => {
        setCounter('countCollection', Meteor.userDomain(this.userId) + '.' + counter.name, counter.value);
      });
    },

    getCounterValue: function (documentType) {
      if (!Roles.userIsInRole(this.userId, ['manager', 'admin'], Meteor.userDomain(this.userId))) {
        throw new Meteor.Error(401, 'Permission denied');
      }

      return incrementCounter('countCollection', Meteor.userDomain(this.userId) + '.' + documentType, 0);
    },

    setCounterValue: function (documentType, value) {
      if (!Roles.userIsInRole(this.userId, ['manager', 'admin'], Meteor.userDomain(this.userId))) {
        throw new Meteor.Error(401, 'Permission denied');
      }
      
      setCounter('countCollection', Meteor.userDomain(this.userId) + '.' + documentType, value);
    },
  });
}