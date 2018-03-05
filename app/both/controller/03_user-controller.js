UserController = ApplicationController.extend({
  
  editProfile: function() {
    this.render('UserProfile');
    this.renderActions('#user-profile-form', 'dashboard');
  }
});

Router.route('/user/profile', {
  name: 'user-profile',
  controller: UserController,
  action: 'editProfile'
});