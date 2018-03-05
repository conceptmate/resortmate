/* global AutoForm */
/**
 *
 */
Template.BackupCollectionEdit.helpers({

  /**
   *
   */
  insertOrUpdate: function () {
    if (this.booking && this.booking._id) {
      return "method-update";
    }
    return "method";
  },
  
  /*
   *
   */
  insertOrUpdateMethod: function () {
    if (this.booking && this.booking._id) {
      return "updateBackupCollection0";
    }
    return "addBackupCollection0";
  }
});

/**
 *
 */
Template.BackupCollectionEdit.events({

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("backup-collection-form")) {
      Router.go('admin.backup-collections');
    }
  },
});
