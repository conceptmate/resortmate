// /* global Forms */
// Meteor.methods({
  
//   /**
//    *
//    */
//   deleteForm: function (id) {
//     Forms.remove({ _id: id });
//   },
  
//   clearForms: function() {
//     if (Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
//       Forms.remove({});
//     }
//   }
// });