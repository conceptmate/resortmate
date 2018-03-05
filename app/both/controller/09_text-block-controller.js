/* global TextBlocks */
/* global Meteor */
/* global UserController */
/* global TextBlockController */
TextBlockController = UserController.extend({

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function() {
    let textBlockId = this.params._id;
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);
    
    if (domain && textBlockId) {
      return [
        Meteor.subscribe('text-block', domain, textBlockId)
      ];
    }
    return undefined;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function() {
    let textBlockId = this.params._id;
    
    if (textBlockId) {
      return {
        textBlock: TextBlocks.findOne({ _id: textBlockId })
      };
    }
    return undefined;
  },

  edit: function() {
    this.render('TextBlockEdit');
    this.renderActions('#text-block-form', 'text-blocks');
  },

  list: function() {
    this.render('TextBlockList');
    
    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          this.createAction('textBlock.add', function() {
              Router.go('text-block.add');
          })
        ]
      }
    });
  }
});

Router.route('/text-blocks', {
  name: 'text-blocks',
  controller: TextBlockController,
  action: 'list',
});

Router.route('/text-blocks/add', {
  name: 'text-block.add',
  controller: TextBlockController,
  action: 'edit',
});

Router.route('/text-blocks/edit/:_id', {
  name: 'text-block.edit',
  controller: TextBlockController,
  action: 'edit',
});