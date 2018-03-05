Template.UserProfile.helpers({
  
  userProfile: function() {
    var user = Meteor.user();
    return user.profile;
  },
  
  schema: function() {
    return Schemas.UserProfile;
  }
});