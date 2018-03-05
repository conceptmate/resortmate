/* global ItemController */
ItemController = UserController.extend({

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    let itemId = this.params._id;
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);
    
    if (domain && itemId) {
      return [
        Meteor.subscribe('item', domain, itemId)
      ];
    }
    return undefined;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function () {
    if (this.params._id) {
      return {
        item: Items.findOne({ _id: this.params._id })
      };
    }
    return undefined;
  },

  edit: function () {
    this.render('ItemEdit');
    this.renderActions('#item-form', 'items');
  },

  list: function () {
    this.render('ItemList');
    
    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          this.createAction('item.add', function() {
              Router.go('item.add');
          })
        ]
      }
    });
  }
});

Router.route('/items', {
  name: 'items',
  controller: ItemController,
  action: 'list',
});

Router.route('/items/add', {
  name: 'item.add',
  controller: ItemController,
  action: 'edit',
});

Router.route('/items/edit/:_id', {
  name: 'item.edit',
  controller: ItemController,
  action: 'edit',
});