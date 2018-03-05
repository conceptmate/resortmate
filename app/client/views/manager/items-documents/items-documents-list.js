/**
 *
 */
Template.ItemsDocumentList.helpers({

  title: function() {
    if (this.title) {
      return this.title;
    }
    
    let documentType = Router.current().params.documentType;
    return i18np(documentType + 's', 'list')
  },

  subscriptionName: function () {
    if (this.subscriptionName) {
      return this.subscriptionName;
    }
    return 'table-' + Router.current().params.documentType + 's';
  }
});

/**
 *
 */
Template.ItemsDocumentList.events({

  /**
   *
   */
  'click .reactive-table tbody > tr': function (e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let documentType = this.documentType;
    if (!documentType) {
      documentType = Router.current().params.documentType;
    }
    
    var itemsDocument = this;
    Router.go('items-document.edit', {
      documentType: documentType,
      _id: itemsDocument._id
    });
  }
});
