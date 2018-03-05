/* global AdminController */
AdminController = UserController.extend({
  
  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    let otherUserId = this.params._id;
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);
    
    if (domain && otherUserId) {
      return [
        Meteor.subscribe('user', domain, otherUserId)
      ];
    }
    return undefined;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function () {
    let otherUserId = this.params._id;
    
    if (otherUserId) {
      return {
        user: Meteor.users.findOne({ _id: otherUserId })
      };
    }
    return undefined;
  },

  list: function () {
    this.render('UserList');

    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          this.createAction('admin.user.add', function () {
            Router.go('admin.user.add');
          })
        ]
      }
    });
  },

  userAdd: function () {
    this.render('AdminUserAdd');
    this.renderActions('#admin-user-add-form', 'admin.users');
  },

  userEdit: function () {
    this.render('UserEdit');
    this.renderActions('#user-form', 'admin.users');
  },

  editCounters: function () {
    this.render('CountersEdit');
    this.renderActions('#counters-form', 'items');
  }
});

Router.route("/admin/users", {
  name: 'admin.users',
  controller: AdminController,
  action: 'list'
});

Router.route("/admin/users/add", {
  name: 'admin.user.add',
  controller: AdminController,
  action: 'userAdd'
});

Router.route("/admin/users/edit/:_id", {
  name: 'admin.user.edit',
  controller: AdminController,
  action: 'userEdit'
});

Router.route("/admin/counters/edit", {
  name: 'admin.counters.edit',
  controller: AdminController,
  action: 'editCounters'
});