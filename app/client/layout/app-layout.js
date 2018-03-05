/* global tx */
var getObjectFromAttributes = function (element) {
  var obj = {};
  $.each(element.attributes, function () {

    if (this.name.indexOf("route-data-") == 0) {
      var key = this.name.replace("route-data-", "");
      
      // remove '-' and make first character thereafter capital 
      while (key.indexOf('-') > -1) {
        let idx = key.indexOf('-');
        let upperCase = key.charAt(idx + 1).toUpperCase();

        key = key.substring(0, idx) + upperCase + key.substring(idx + 2, key.length);
      }

      obj[key] = this.value;
    }
  });
  return obj;
};

Template.AppLayout.onRendered(function () {
  
  // add keydown event listener to show open window with print preview
  document.addEventListener('keydown', function (e) {
    if (e.metaKey) {
      switch (e.keyCode) {
        // meta + p
        case 80:
          e.preventDefault();

          let documentType = Router.current().params.documentType;
          let documentId = Router.current().params._id;

          // only open window if documentType and documentId are set in route          
          if (documentType && documentId) {
            var url = Meteor.absoluteUrl('documents/' + documentType + '/print/' + documentId);
            let windowHandle = window.open(url, 'Print Screen', 'width=832,height=1093');
            
            // add event handler to close window in ESC key
            $(windowHandle).on('keydown', function (e) {
              switch (e.keyCode) {
                // ESC key code
                case 27:
                  windowHandle.close();
                  break;
              }
            });
          }

          break;
      }
    }
  });
});

Template.AppLayout.events({

  'click *[action="logout"]': function (e, tmpl) {
    if (Meteor.userId()) {
      AccountsTemplates.logout();
    }
    else {
      Meteor.loginWithPassword('roman.raedle@outlook.com', 'password');
    }
  },

  'click .profile-thumb': function (e, tmpl) {
    Router.go('user-profile');
  },

  'click .cc-button-flat[route]': function (e, tmpl) {
    var route = $(e.target).attr('route');
    var routeData = getObjectFromAttributes(e.target);
    Router.go(route, routeData);
  }
});

Template.ContentActions.helpers({

  isActiveOrUndefined: function () {
    if (typeof this.isVisible === 'function') {
      this.isVisible.call(this);
    }
    else if (typeof this.isVisible !== 'undefined') {
      return this.isVisible;
    }
    return true;
  }
});

// Return a selector
var undoneRedoConditions = function () {
  var undoneRedoConditions = { $exists: true, $ne: null };
  var lastAction = tx.Transactions.findOne({ user_id: Meteor.userId(), $or: [{ undone: null }, { undone: { $exists: false } }], expired: { $exists: false } }, { sort: { lastModified: -1 } });
  if (lastAction) {
    undoneRedoConditions['$gt'] = lastAction.lastModified;
  }
  return undoneRedoConditions;
}

Template.UndoRedoActions.helpers({
  
  // expired: {$exists: false} is checked for autopublish scenarios -- even though expired is not a published field
  
  hideUndoButton: function () {
    return (tx.Transactions.find({ user_id: Meteor.userId(), $or: [{ undone: null }, { undone: { $exists: false } }], expired: { $exists: false } }).count()) ? '' : 'hide-undo-button';
  },

  hideRedoButton: function () {
    return (tx.Transactions.find({ user_id: Meteor.userId(), undone: undoneRedoConditions(), expired: { $exists: false } }).count()) ? '' : 'hide-redo-button';
  },

  action: function (type) {
    var sel = { user_id: Meteor.userId(), expired: { $exists: false } }; // This is for autopublish scenarios
    var existsOrNot = (type === 'redo') ? { undone: undoneRedoConditions() } : { $or: [{ undone: null }, { undone: { $exists: false } }] };
    var sorter = {};
    sorter[(type === 'redo') ? 'undone' : 'lastModified'] = -1;
    var transaction = tx.Transactions.findOne(_.extend(sel, existsOrNot), { sort: sorter });
    return transaction && transaction.description;
  },

  undoRedoButtonclass: function () {
    return tx && _.isString(tx.undoRedoButtonClass) && tx.undoRedoButtonClass || '';
  }
});

Template.UndoRedoActions.events({

  'click .undo-action': function (e, tmpl) {
    tx.undo();
  },

  'click .redo-action': function (e, tmpl) {
    tx.redo();
  }
});

Template.ContentActions.events({

  'click .action': function (e, tmpl) {
    if (typeof this.action === 'function') {
      this.action.call(this);
    }
  }
});

Template.ModalDialog.helpers({
  
  modalDialogContext: function() {
    return Session.get('modalDialogContext');
  }
});

Template.ModalDialog.events({

  'click .modal-dialog-ok': function (e, tmpl) {
    App.okModal();
    tmpl.$('.modal-dialog').css({
      'opacity': 0,
      'pointer-events': 'none'
    });
  },

  'click .modal-dialog-cancel': function (e, tmpl) {
    tmpl.$('.modal-dialog').css({
      'opacity': 0,
      'pointer-events': 'none'
    });
  }
});