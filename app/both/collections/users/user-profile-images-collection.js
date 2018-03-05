/* global process */
/* global gm */
/* global FS */
/* global ProfilePictures */

// FS.debug = true;

var store = new FS.Store.GridFS("images", {
  transformWrite: function (fileObj, readStream, writeStream) {
    
    // GraphicsMagick does not exist on Windows
    if (process.platform === 'win32') {
      return readStream.pipe(writeStream);
    }
    
    if (gm.isAvailable) {
      return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
    }
    else {
      return readStream.pipe(writeStream);
    }
  }
});

var thumbsStore = new FS.Store.GridFS("thumbs", {
  transformWrite: function (fileObj, readStream, writeStream) {
    
    // GraphicsMagick does not exist on Windows
    if (process.platform === 'win32') {
      return readStream.pipe(writeStream);
    }
    
    var size;
    if (gm.isAvailable) {
      size = {
        width: 100,
        height: 100
      };
      return gm(readStream, fileObj.name()).autoOrient().resize(size.width + "^>", size.height + "^>").gravity("Center").extent(size.width, size.height).stream().pipe(writeStream);
    }
    else {
      return readStream.pipe(writeStream);
    }
  }
});

ProfilePictures = new FS.Collection("profile-pictures", {
  stores: [store, thumbsStore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('profile-pictures');
}

if (Meteor.isServer) {
  Meteor.publish('profile-pictures', function () {
    return ProfilePictures.find({});
  });

  ProfilePictures.allow({
    insert: function (userId, doc) {
      return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
      return true;
    },
    remove: function(userId, doc) {
      return true;
    },
    download: function (userId) {
      return true;
    }
  });
}