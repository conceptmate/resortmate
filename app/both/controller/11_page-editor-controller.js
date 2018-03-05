/* global PageController */
PageController = UserController.extend({

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    return null;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function () {
    return {
      
    }
  },

  edit: function () {
    this.render('PageEdit');
  },
});

Router.route('/pages/:documentType/edit/:_id', {
  name: 'page.edit',
  controller: PageController,
  action: 'edit'
});
