/* global ReactiveTable */
/* global ItemsDocuments */
/* global Mongo */
/* global i18n */
/* global SimpleSchema */
/* global Schemas */
ItemsDocuments = new Mongo.Collection('items-documents');

if (Meteor.isServer) {
  ItemsDocuments.allow({
    insert: function (userId, doc) {
      // the user must be logged in, and the document must be owned by the user
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['accountant', 'manager', 'admin'], domain);
    },
    update: function (userId, doc, fields, modifier) {
      // can only change your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['accountant', 'manager', 'admin'], domain);
    },
    remove: function (userId, doc) {
      // can only remove your own documents
      // return doc.owner === userId;
      let domain = Meteor.userDomain(userId);
      return Roles.userIsInRole(userId, ['accountant', 'manager', 'admin'], domain);
    }
  });
  
  ReactiveTable.publish('table-offers', function() {
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      return ItemsDocuments;
    }
    return null;
  }, function() {
    return {
      group: Meteor.userDomain(this.userId),
      documentType: 'offer'
    };
  });
  
  ReactiveTable.publish('table-invoices', function() {
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      return ItemsDocuments;
    }
    return null;
  }, function() {
    return {
      group: Meteor.userDomain(this.userId),
      documentType: 'invoice'
    };
  });
  
  ReactiveTable.publish('table-open-offers', function() {
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      return ItemsDocuments;
    }
    return null;
  }, function() {
    return {
      group: Meteor.userDomain(this.userId),
      documentType: 'offer',
      invoice: { $exists: false }
    };
  });
  
  ReactiveTable.publish('table-open-invoices', function() {
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      return ItemsDocuments;
    }
    return null;
  }, function() {
    return {
      group: Meteor.userDomain(this.userId),
      documentType: 'invoice',
      offer: { $exists: false }
    };
  });
  
  Meteor.publishComposite('items-document', function(domain, documentType, itemsDocumentId) {
    check(domain, String);
    check(documentType, String);
    check(itemsDocumentId, String);
    
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], domain)) {
      return {
        find: function() {
          return ItemsDocuments.find({
            $and: [
              { group: domain },
              { documentType: documentType },
              { _id: itemsDocumentId }
            ]}, {
            limit: 1
          });
        },
        children: [
          {
            find: function(document) {
              
              if (document.customer && document.customer.originId) {
                return Customers.find({
                    $and: [
                      { group: domain },
                      { _id: document.customer.originId }
                    ]
                  }, {
                  limit: 1
                });
              }
              // else {
              //   throw new Meteor.Error(700, 'document does not have customer');
              // }
            }
          }
        ]
      }
    }
    else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });
  
  Meteor.publish('customer-items-documents', function(domain, customerId) {
    check(domain, String);
    check(customerId, String);
    
    if (Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], domain)) {
      return ItemsDocuments.find({
        group: domain,
        'customer.originId': customerId
      });
    }
    else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });
}
