/* global ItemsDocuments */
/* global ItemsDocumentPrintController */
/* global Router */
/* global Customers */
/* global RouteController */
/* global wkhtmltopdf */
/* global Npm */
ItemsDocumentPrintController = RouteController.extend({
  
  layoutTemplate: 'PrintLayout',

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    var itemsDocumentId = this.params._id;
    var documentType = this.params.documentType;
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);
    
    if (domain && itemsDocumentId) {
      return [
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

    if (this.ready()) {
      
      var itemsDocumentId = this.params._id;
      if (itemsDocumentId) {

        var itemsDocument = ItemsDocuments.findOne({ _id: itemsDocumentId }, {
          transform: function(itemsDocument) {
            return new ResortMate.ItemsDocument(itemsDocument);
          }
        });
        
        return {
          itemsDocument: itemsDocument
        }
      }
    }
    return null;
  },

  onBeforeAction: function() {

    // in case of window.open, the user will not be logged in on the newly open window
    // therefore the loginToken is transferred via url query to login with token
    if (!Meteor.userId()) {
      let loginToken = this.params.query.loginToken;

      if (loginToken) {
        Meteor.loginWithToken(loginToken);
      }
    } 

    this.next();
  },

  print: function () {
    
    console.log('print items document');
    
    var query = this.params.query;
    if (query.lang) {
      App.setLanguage(query.lang);
    }
    
    this.render('ItemsDocumentPrint');
  }
});


Router.route('/documents/:documentType/print/:_id', {
  name: 'items-document.print',
  controller: ItemsDocumentPrintController,
  action: 'print'
});

Router.route('/documents/:documentType/download/:_id', function () {

  let params = this.params;
  let documentType = params.documentType;
  let id = params._id;
  let options = params.query;

  let url = 'documents/' + documentType + '/print/' + id;
  if (options && options.language) {
    url += '?lang=' + options.language;
  }

  let absoluteUrl = Meteor.absoluteUrl(url);
  let outputStream = this.response;

  PrintHelper.generatePdf(absoluteUrl, outputStream);
}, {
    name: 'download.pdf',
    where: 'server'
  });
