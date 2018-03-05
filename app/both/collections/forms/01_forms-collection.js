// /* global Forms */
// Forms = new Mongo.Collection('forms');

// if (Meteor.isServer) {
  
//   Forms.allow({
//     insert: function (userId, doc) {
//       // the user must be logged in, and the document must be owned by the user
//       // return doc.owner === userId;
//       let domain = Meteor.userDomain(userId);
//       return Roles.userIsInRole(userId, ['manager', 'admin'], domain);
//     },
//     update: function (userId, doc, fields, modifier) {
//       // can only change your own documents
//       // return doc.owner === userId;
//       let domain = Meteor.userDomain(userId);
//       return Roles.userIsInRole(userId, ['manager', 'admin'], domain);
//     },
//     remove: function (userId, doc) {
//       // can only remove your own documents
//       // return doc.owner === userId;
//       let domain = Meteor.userDomain(userId);      
//       return Roles.userIsInRole(userId, ['manager', 'admin'], domain);
//     }
//   });

//   ReactiveTable.publish('table-forms', function () {
//     if (Roles.userIsInRole(this.userId, ['manager', 'admin'], Meteor.userDomain(this.userId))) {
//       return Forms;
//     }
//     return null;
//   }, function () {
//     return {
//       group: Meteor.userDomain(this.userId)
//     };
//   });

//   Meteor.publish('form', function (domain, formId) {
//     check(domain, String);
//     check(formId, String);
    
//     if (Roles.userIsInRole(this.userId, ['manager', 'admin'], domain)) {
//       return Forms.find({
//         $and: [
//           { domain: domain },
//           { _id: formId }
//         ]
//       });
//     }
//     else {
//       // user not authorized. do not publish secrets
//       this.stop();
//       return;
//     }
//   });
// }
