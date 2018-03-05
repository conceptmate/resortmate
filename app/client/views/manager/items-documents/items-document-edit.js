var getPrefixOptions = function () {
  return {
    keyName: '_id',
    valueName: 'text',
    data: function (value) {

      if (!value) {
        return [];
      }

      return TextBlocks.find({
        $and: [
          { type: 'prefix' },
          {
            $or: [{
              key: {
                $regex: value,
                $options: 'i'
              }
            }, {
                text: {
                  $regex: value,
                  $options: 'i'
                }
              }]
          }
        ]
      }, {
          limit: 50
        });
    }
  };
};

var getSuffixOptions = function () {
  return {
    keyName: '_id',
    valueName: 'text',
    data: function (value) {

      if (!value) {
        return [];
      }

      return TextBlocks.find({
        $and: [
          { type: 'suffix' },
          {
            $or: [{
              key: {
                $regex: value,
                $options: 'i'
              }
            }, {
                text: {
                  $regex: value,
                  $options: 'i'
                }
              }]
          }

        ]
      }, {
          limit: 50
        });
    }
  };
};

/**
 *
 */
Template.ItemsDocumentEdit.helpers({
  
  columns: function () {
    return Helpers.getOrderItemsColumns(true);
  },

  options: function () {
    return {
      classes: ['items-document-title']
    };
  },

  getSum: function () {

    var itemsDocument = this.itemsDocument;

    if (!itemsDocument || !itemsDocument.items) {
      return;
    }

    let totalValue = AccountingUtils.getTotalGrossValue(itemsDocument.items)
    return {
      prefix: '&euro; ',
      totalSum: numeral(totalValue).format('0,0.00')
    };
  },

  getSumMessage: function () {
    // console.log(this.itemsDocument);
    
    var itemsDocument = this.itemsDocument;

    if (!itemsDocument || !itemsDocument.items) {
      return;
    }
    
    return AccountingUtils.getVatTotalsMessage(itemsDocument.items);
  },

  getConformPrefix: function () {
    return {
      key: 'prefix',
      meteormethod: 'updateItemsDocument',
      docId: this.docId,
      data: this.itemsDocument,
      isEditable: true,
      placeholder: 'Prefix...',
      convertToHtml: function (obj, value) {
        return Helpers.newlineToBr(value);
      },
      convertToObject: function (obj, value) {
        return Helpers.brToNewline(value);
      },
      options: getPrefixOptions()
    };
  },

  getConformSuffix: function () {
    return {
      key: 'suffix',
      meteormethod: 'updateItemsDocument',
      docId: this.docId,
      data: this.itemsDocument,
      isEditable: true,
      placeholder: 'Suffix...',
      convertToHtml: function (obj, value) {
        return Helpers.newlineToBr(value);
      },
      convertToObject: function (obj, value) {
        return Helpers.brToNewline(value);
      },
      options: getSuffixOptions()
    };
  },
});

/**
 *
 */
Template.ItemsDocumentEdit.events({
  
  'click .create-invoice': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let itemsDocument = this.itemsDocument;
    
    let userId = Meteor.userId();
    Meteor.call('createInvoiceFromOffer', Meteor.userDomain(userId), itemsDocument._id, function(err, res) {
      if (err) {
        console.log(err);
      }
      else {
        // route to new invoice when completed
        Router.go('items-document.edit', {
          documentType: 'invoice',
          _id: res
        });
      }
    });
  },

  'click .print-items-document': function (e, tmpl) {
    let documentType = Router.current().params.documentType;
    Router.go('items-document.print', {
      documentType: documentType,
      _id: this.itemsDocument._id
    });
  },

  'click .download-items-document': function (e, tmpl) {
    let documentType = Router.current().params.documentType;
    Router.go('download.pdf', {
      documentType: documentType,
      _id: this.itemsDocument._id
    });
  },

  'click .list-items-documents': function (e, tmpl) {
    let documentType = Router.current().params.documentType;
    Router.go('items-documents', {
      documentType: documentType
    });
  },

  'click .add-item': function (e, tmpl) {
    console.log(this);

    var item = {
      key: "",
      quantity: 1,
      description: "",
      vat: 0,
      price: 0,
      vatType: 'gross'
    };
    
    // this.itemsDocument.items.push(item);
    
    Meteor.call('addItemsDocumentItem', this.itemsDocument._id, item, function (err, res) {
      if (err) {
        console.error(err);
      }
      else {
        var $firstEditable = tmpl.$('.page-table-item').last().find('[contenteditable="true"]').first();
        console.log($firstEditable);
        $firstEditable.focus();

        Meteor.setTimeout(() => {
          $firstEditable.selectText();
        }, 200);
      }
    });
  }
});
