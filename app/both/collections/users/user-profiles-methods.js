if (Meteor.isServer) {
  Meteor.methods({

    /**
     * Update user profile, e.g., modifier send from user form
     * in user-profile.html.
     */
    updateUserProfile: function (modifier) {

      console.log('update user profile', modifier);

      var $set = modifier['$set'];
      var $unset = modifier['$unset'];
		
      // prefix $set with profile
      for (var p in $set) {
        $set['profile.' + p] = $set[p];
        delete $set[p];
      }
		
      // prefix $unset with profile
      for (var p in $unset) {
        $unset['profile.' + p] = $unset[p];
        delete $unset[p];
      }

      Meteor.users.update({ _id: this.userId }, modifier);
    }
  });
}