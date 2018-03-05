Template.AdminUserAdd.events({

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("admin-user-add-form")) {
      Router.go('admin.users');
    }
  }
});