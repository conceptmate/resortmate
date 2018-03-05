/* global Tracker */
/* global ProfilePictures */
/* global Meteor */
/* global Template */
var DEFAULT_CSS = {
  width: '50px',
  height: '50px'
};

var colorPalette = [
  '#661e1e', '#66261e', '#662d1e', '#66351e', '#663c1e', '#66441e', '#664b1e', '#66531e',
  '#665a1e', '#66621e', '#62661e', '#5a661e', '#53661e', '#4b661e', '#44661e', '#3c661e',
  '#35661e', '#2d661e', '#26661e', '#1e661e', '#1e6625', '#1e662d', '#1e6634', '#1e663c',
  '#1e6643', '#1e664b', '#1e6652', '#1e665a', '#1e6661', '#1e6266', '#1e5b66', '#1e5366',
  '#1e4c66', '#1e4466', '#1e3d66', '#1e3566', '#1e2e66', '#1e2666', '#1e1f66', '#251e66',
  '#2c1e66', '#341e66', '#3b1e66', '#431e66', '#4a1e66', '#521e66', '#591e66', '#611e66',
  '#661e63', '#661e5b', '#661e54', '#661e4c', '#661e45', '#661e3d', '#661e36', '#661e2e',
  '#661e27', '#661e1f', '#66251e', '#662c1e', '#66341e', '#663b1e', '#66431e', '#664a1e',
  '#66521e', '#66591e', '#66611e', '#63661e', '#5c661e', '#54661e', '#4d661e', '#45661e',
  '#3e661e', '#36661e'
];

var getUserInitial = function (user) {
  if (!user) {
    return undefined;
  }

  var profile;
  if (user.username) {
    return user.username.charAt(0).toUpperCase();
  }
  else if (user.profile && user.profile.firstName && user.profile.lastName) {
    profile = user.profile;
    return profile.firstName.charAt(0).toUpperCase() + profile.lastName.charAt(0).toUpperCase();
  }
  else if (user.profile && user.profile.name) {
    profile = user.profile;
    var names = profile.name.split(' ');
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }
  else if (user.profile && user.profile.lastName) {
    return profile.lastName.charAt(0).toUpperCase();
  }
  else if (user.profile && user.profile.firstName) {
    return profile.firstName.charAt(0).toUpperCase();
  }
  else if (user.emails && user.emails.length > 0 && user.emails[0].address) {
    return user.emails[0].address.charAt(0).toUpperCase();
  }
  else {
    return undefined;
  }
};

/**
 * Gets a user color.
 */
var getUserColor = function (user) {
  var _id = user._id;
  var index = _id.charCodeAt(0) - 48;
  return colorPalette[index];
};

Template.ProfileThumb.onRendered(function () {
  // var $thumb = this.$('.profile-thumb');
  // var $image = $thumb.find('img');
    
  // // create dummy image to receive image style
  // if (!$image.length) {
  //   $image = $('<img />');
  // }
});

Template.ProfileThumb.helpers({

  user: function () {
    var userId = this['user-id'];
    return Meteor.users.findOne({
      _id: userId
    });
  },

  userInitials: function (user) {
    if (!user) {
      return undefined;
    }

    try {
      var html = getUserInitial(user);
      return {
        html: html,
        backgroundColor: getUserColor(user)
      };
    }
    catch (err) {
      console.error('%o. Returning default user thumb', err);
      throw err;
    }
  },

  userImage: function (user) {
    var picture;

    if (!user) {
      return undefined;
    }

    try {
      if (typeof user.profile !== 'undefined' && typeof user.profile.picture !== 'undefined') {
        picture = user.profile.picture;
        if (picture.indexOf('/') > -1) {
          return picture;
        }
        else {
          if (typeof ProfilePictures !== 'undefined' && ProfilePictures.findOne(user.profile.picture)) {
            picture = ProfilePictures.findOne(picture);
            return picture.url({
              store: 'thumbs'
            });
          }
        }
      }
    }
    catch (err) {
      console.error('%o. No user image found', err);
      return undefined;
    }
  },
  
  image: function() {
    return this['image'];
  }
});

Template.SelectedIndicator.helpers({
  
  /**
   * Returns the selected attribute
   */
  isSelected: function () {
    var isSelected = this['is-selected'];
    return isSelected === 'true' ? true : false;
  }
});