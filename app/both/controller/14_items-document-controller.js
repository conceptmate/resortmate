/* global UserController */
/* global ItemsDocumentController */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

ItemsDocumentController = UserController.extend({

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    let itemsDocumentId = this.params._id;
    let documentType = this.params.documentType;
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);
    
    if (domain && itemsDocumentId) {
      return [
        Meteor.subscribe('items', domain, itemsDocumentId),
        Meteor.subscribe('text-blocks', domain, itemsDocumentId),
        Meteor.subscribe('items-document', domain, documentType, itemsDocumentId)
      ];
    }
    return undefined;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function () {
    let itemsDocumentId = this.params._id;
    let documentType = this.params.documentType;
    if (itemsDocumentId && documentType) {
      var itemsDocument = ItemsDocuments.findOne({
        $and: [
          { _id: itemsDocumentId },
          { documentType: documentType }
        ]}, {
        transform: function (itemsDocument) {
          return new ResortMate.ItemsDocument(itemsDocument);
        }
      });

      return {
        itemsDocument: itemsDocument
      }
    }
    return undefined;
  },

  edit: function () {
    this.render('ItemsDocumentEdit');
    
    var that = this;
    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          {
            isVisible: function() {
              // only display action if it is an invoice or a offer which has an
              // accompanion invoice
              let documentType = Router.current().params.documentType;
              let itemsDocument = this.data().itemsDocument;
              
              if (itemsDocument) {
                return documentType === 'invoice' || itemsDocument.invoice;
              }
              return false;
            },
            name: function() {
              let itemsDocument = this.data().itemsDocument;
              
              if (itemsDocument) {
                switch (itemsDocument.documentType) {
                  case 'offer':
                    return (itemsDocument.invoice) ? i18n('invoice.open') : i18n('invoice.create');
                  case 'invoice':
                    return i18n('offer.open');
                }
              }
              
              return null;
            },
            action: function() {
              let itemsDocument = this.data().itemsDocument;
    
              if (itemsDocument.invoice) {
                Router.go('items-document.edit', {
                  documentType: 'invoice',
                  _id: itemsDocument.invoice
                });
              }
              else if (itemsDocument.offer) {
                Router.go('items-document.edit', {
                  documentType: 'offer',
                  _id: itemsDocument.offer
                });
              }
              else {
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
              }
            },
            data: function() {
              return that.data();
            }
          },
          // {
          //   name: function() {
          //     return i18n('download');
          //   },
          //   action: function() {
          //     let documentType = Router.current().params.documentType;
          //     Router.go('download.pdf', {
          //       documentType: documentType,
          //       _id: that.data().itemsDocument._id
          //     });
          //   },
          //   data: function() {
          //     return that.data();
          //   }
          // },
          {
            name: function() {
              return i18n('openPrintPreview');
            },
            action: function() {
              let documentType = Router.current().params.documentType;
              let documentId = that.data().itemsDocument._id;
              // Router.go('items-document.print', {
              //   documentType: documentType,
              //   _id: documentId
              // });
              
              // transfer login token is necessary in production environment, otherwise no user is logged in
              // on newly opened window hence print data cannot be read from server.
              var loginToken = window.localStorage['Meteor.loginToken'];
              var url = Meteor.absoluteUrl('documents/' + documentType + '/print/' + documentId + '?loginToken=' + loginToken);
              window.open(url, 'Print Screen', 'width=832,height=1093');
              
              // Meteor.setTimeout(() => {
              //   window.print();
              // }, 2000);
            },
            data: function() {
              return that.data();
            }
          },
          {
            name: function() {
              return i18n('back');
            },
            action: function() {
              let documentType = Router.current().params.documentType;
              Router.go('items-documents', {
                documentType: documentType
              });
            },
            data: function() {
              return that.data();
            }
          }
        ]
      }
    });
  },

  list: function () {
    this.render('ItemsDocumentList');
    
    var that = this;
    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          {
            name: function() {
              let documentType = Router.current().params.documentType;
              return i18np(documentType, 'add');
            },
            action: function() {
              let documentType = Router.current().params.documentType;
              
              let itemsDocument = {
                customer: {},
                documentType: documentType
              };
              
              Meteor.call('addItemsDocument', itemsDocument, function (err, itemsDocumentId) {
                if (err) {
                  console.error(err);
                }
                else {
                  console.log(itemsDocumentId);
                  
                  Router.go('items-document.edit', {
                    documentType: documentType,
                    _id: itemsDocumentId
                  });
                }
              });
            },
            data: function() {
              return that.data();
            }
          }
        ]
      }
    });
  }
});

Router.route('/documents/:documentType/', {
  name: 'items-documents',
  controller: ItemsDocumentController,
  action: 'list'
});

Router.route('/documents/:documentType/edit/:_id', {
  name: 'items-document.edit',
  controller: ItemsDocumentController,
  action: 'edit'
});