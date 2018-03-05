/* global AdminController */
/* global Router */
/* global BackupController */
BackupController = AdminController.extend({

  // layoutTemplate: 'DefaultLayout',
  // loadingTemplate: 'DefaultLoading',
  
  /**
   * 
   */
  waitOn: function () {
    return [
      // Meteor.subscribe('backups')
    ];
  },

  /**
   * 
   */
  data: function () {
    return {
      // backups: Backups.find()
    };
  },

  /**
   * 
   */
  list: function () {
    this.render('BackupList');

    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          this.createAction('backup.collection.list', function () {
            Router.go('admin.backup-collections');
          }),
          this.createAction('backup.create', function () {
            Meteor.call('exportAllCollections');
          })
        ]
      }
    });
  },
  
  /**
   * 
   */
  editCollection: function() {
    this.render('BackupCollectionEdit');
    this.renderActions('#backup-collection-form', 'admin.backup-collections');
  },
  
  /**
   * 
   */
  listCollection: function() {
    this.render('BackupCollectionList');

    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          this.createAction('backup.collection.add', function () {
            Router.go('admin.backup-collections.add')
          })
        ]
      }
    });
  }
});

Router.route('/admin/backups', {
  name: 'admin.backups',
  controller: BackupController,
  action: 'list'
});

Router.route('/admin/backup-collections', {
  name: 'admin.backup-collections',
  controller: BackupController,
  action: 'listCollection'
});

Router.route('/admin/backup-collections/add', {
  name: 'admin.backup-collections.add',
  controller: BackupController,
  action: 'editCollection'
});

