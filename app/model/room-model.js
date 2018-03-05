// Rooms = new Mongo.Collection("rooms");
// Rooms.attachSchema(RoomSchema);

// Rooms.allow({
//   insert: function (userId, doc) {
//     // the user must be logged in, and the document must be owned by the user
//     // return (Roles.userIsInRole(Meteor.user()));
//     return true;
//   },
//   update: function (userId, doc, fields, modifier) {
//     // can only change your own documents
//     // return doc.owner === userId;
//     return true;
//   },
//   remove: function (userId, doc) {
//     // can only remove your own documents
//     // return doc.owner === userId;
//     return true;
//   }
// });

// /**
//  *
//  */
// deleteRoom = function(id) {
//   Rooms.remove({ _id: id });
// };

// if (Meteor.isServer) {
//   Meteor.publish("rooms", function() {
//     return Rooms.find({});
//   });

//   // Meteor.publish("room", function(id) {
//   //   console.log("Meteor.publish.room.id: " + id);
//   //
//   //   var rooms = Rooms.findOne({ _id: id });
//   //
//   //   console.log(rooms);
//   //
//   //   return rooms;
//   // });
// }
