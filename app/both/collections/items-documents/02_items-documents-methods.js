/* global setCounter */
/* global incrementCounter */
/* global Meteor */
/* global check */
Meteor.methods({

  /**
   * 
   */
  addItemsDocument: function (itemsDocument) {
    check(itemsDocument, Object);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    // create document number, works differently on server    
    let documentNumber = 0;
    if (Meteor.isServer) {
      documentNumber = incrementCounter('countCollection', Meteor.userDomain(this.userId) + '.' + itemsDocument.documentType);
    }
    itemsDocument.number = documentNumber;
    
    return ItemsDocuments.insert(itemsDocument, {
      tx: true,
      instant: true
    });
  },

  updateItemsDocument: function (documentId, obj, modifier, value) {
    // console.log('documentId=%o, modifier=%o, value=%o', documentId, modifier, value);
    // check(documentId, String);
    // check(obj, Object);
    // check(modifier, Object);
    // check(obj, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    let $set = {};
    $set[modifier] = value;

    console.log('$set %o', $set);
    console.log('typeof %o', typeof value);

    return ItemsDocuments.update({ _id: documentId }, {
      $set: $set
    }, {
      tx: true,
      instant: true
    });
  },
  
  /**
   *
   */
  deleteItemsDocument: function (itemsDocumentId) {
    check(itemsDocumentId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    return ItemsDocuments.remove({ _id: itemsDocumentId }, {
      tx: true,
      instant: true
    });
  },

  /**
   * 
   */
  clearItemsDocuments: function () {
    if (!Roles.userIsInRole(this.userId, ['accountant', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return ItemsDocuments.remove({}, {
      tx: true,
      instant: true
    });
  },

  /**
   * 
   */
  setItemsDocumentCustomer: function (documentId, customerId) {
    check(documentId, String);
    check(customerId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    var customer = Customers.findOne({ _id: customerId });
    
    // set customer._id to customer.originId, so it will be stored in mongo db,
    // otherwise _id property will be removed by mongodb
    customer.originId = customer._id;
    delete customer._id;

    return ItemsDocuments.update({ _id: documentId }, {
      $set: {
        customer: customer
      }
    }, {
      tx: true,
      instant: true
    });
  },

  /**
   * 
   */
  updateItemsDocumentCustomer: function (documentId, obj, modifier, value) {
    // console.log('documentId=%o, modifier=%o, value=%o', documentId, modifier, value);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    let $set = {};
    $set['customer.' + modifier] = value;

    return ItemsDocuments.update({ _id: documentId }, {
      $set: $set
    }, {
      tx: true,
      instant: true
    });
  },

  /**
   * 
   */
  unsetItemsDocumentCustomer: function (documentId) {
    check(documentId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    return ItemsDocuments.update({ _id: documentId }, {
      $unset: {
        customer: 1
      }
    }, {
      tx: true,
      instant: true
    });
  },

  /**
   * 
   */
  addItemsDocumentItem: function (documentId, item) {
    check(documentId, String);
    check(item, Object);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    return ItemsDocuments.update({ _id: documentId }, {
      $push: {
        items: item
      }
    }, {
      tx: true,
      instant: true
    });
  },

  updateItemsDocumentItem: function (documentId, obj, modifier, value) {

    // console.log(arguments);
    // console.log(obj);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    let $set = {};
    $set[modifier] = value;

    // console.log('set update document item %o', $set);

    return ItemsDocuments.update({ _id: documentId }, {
      $set: $set
    }, {
      tx: true,
      instant: true
    });
  },

  updateItemsDocumentItem2: function (documentId, index, item) {
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    let $set = {};
    $set['items.' + index] = item;

    // console.log('set update document item %o', $set);

    return ItemsDocuments.update({ _id: documentId }, {
      $set: $set
    }, {
      tx: true,
      instant: true
    });
  },

  deleteItemsDocumentItem: function (documentId, index) {
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    var $unset = {};
    $unset['items.' + index] = 1

    tx.start('delete items document item');
    ItemsDocuments.update({ _id: documentId }, {
      $unset: $unset
    });

    ItemsDocuments.update({ _id: documentId }, {
      $pull: { items: null }
    });
    tx.commit();
  },
  
  /**
   * 
   */
  createInvoiceFromOffer: function (group, offerId) {
    check(group, String);
    check(offerId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }

    var offer = ItemsDocuments.findOne({
      $and: [
        { _id: offerId },
        { group: group },
        { documentType: 'offer' }
      ]
    });
    
    let invoice = offer;
    invoice.documentType = 'invoice';
    invoice.offer = offerId;
    delete invoice._id;
    
    if (Meteor.isServer) {
      invoice.number = incrementCounter('countCollection', Meteor.userDomain(this.userId) + '.invoice');
    }
    
    let invoiceId = ItemsDocuments.insert(invoice);
    
    ItemsDocuments.update({
      $and: [
        {_id: offerId },
        { group: group },
        { documentType: 'offer' }
      ]
    }, {
      $set: {
        invoice: invoiceId
      }
    });
    
    return invoiceId;
  }
});