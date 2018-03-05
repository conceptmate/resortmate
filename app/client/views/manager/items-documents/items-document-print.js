/* global ResortMate */
/* global Spacebars */
/* global i18n */
/* global _ */
/* global $ */
/* global Template */
/* global Blaze */

Template.ItemsDocumentPrint.onRendered(function () {
  
  console.log('data %o', this.data);
  
  var itemsDocument = this.data.itemsDocument;
  
  if (!itemsDocument) {
    return;
  }
  
  var $itemsDocument = this.$('.items-document');

  var itemsDocumentRenderer = new ResortMate.ItemsDocumentRenderer(itemsDocument);
  
  itemsDocumentRenderer.onRendered(function() {
    console.log('rendered');
    
    Meteor.setTimeout(() => {
      window.print();
    }, 1000);
  });
  itemsDocumentRenderer.render($itemsDocument.get(0));
});

Template.PageTableItem.events({

  'click .delete-item': function (e, tmpl) {
    // console.log(this);
    Meteor.call('deleteItemsDocumentItem', this.docId, this.index);
  }
});

Template.PageTableCell.helpers({

  getData: function () {
    var newObject = _.extend({
      meteormethod: 'updateItemsDocumentItem',
      docId: this.docId,
      data: this.item,
      index: this.index,
      modifierPrefix: 'items.' + this.index,
    }, this.column);

    // console.log('newObject %o', newObject);
    
    return newObject;
  }
});
