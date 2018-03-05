Meteor.userDomain = function (userId) {
  let user = Meteor.users.findOne({ _id: userId });
  return (user && user.domain) ? user.domain : undefined;
};