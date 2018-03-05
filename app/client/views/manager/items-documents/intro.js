/* global moment */
var getTitleOptions = function () {
  return {
    keyName: '_id',
    valueName: 'title',
    convertToHtml: function (obj, value) {
      return Helpers.newlineToBr(value);
    },
    convertToObject: function (obj, value) {
      return Helpers.brToNewline(value);
    },
    data: function (value) {

      if (!value) {
        return [];
      }

      let titles = [
        { title: 'Herrn' },
        { title: 'Frau' },
        { title: 'Firma' }
      ];

      return _.filter(titles, (obj) => {
        return obj.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    }
  };
};

var getNameOptions = function () {
  return {
    keyName: '_id',
    valueName: 'name',
    optionTemplateName: 'CustomerOptionItem',
    convertToHtml: function (obj, value) {
      console.log('echo1 %o', value);
      return Helpers.newlineToBr(value);
    },
    convertToObject: function (obj, value) {
      console.log('echo2 %o', value);
      return Helpers.brToNewline(value);
    },
    data: function (value) {
        
      // let parentData = Template.parentData(0);
      // console.log('options data %o', parentData);
      // console.log('data value %o', value);
        
      if (!value) {
        return [];
      }

      return Customers.find({
        name: {
          $regex: value,
          $options: 'i'
        }
      }, {
          limit: 50
        });
    },
    onSelect: function (e, tmpl) {
      var parentData = Template.parentData(2);

      var itemsDocument = parentData.itemsDocument;

      if (itemsDocument.customer && itemsDocument.customer.originId != this._id) {
        tmpl.$('.customer-name').text('');
      }
      Meteor.call('setItemsDocumentCustomer', itemsDocument._id, this._id);
    },
    onInput: function (e, tmpl) {
      // console.log('on input %o', this);
      var searchName = tmpl.$(e.target).text();
      let userId = Meteor.userId();
      Meteor.subscribe('customers-by-name', Meteor.userDomain(userId), searchName);
    },
    onBlur: function (e, tmpl) {
      Meteor.setTimeout(() => {
      }, 250);
    }
  }
};

var getAddressOptions = function () {
  return {
    keyName: '_id',
    valueName: 'name',
    optionTemplateName: 'CustomerOptionItem',
    convertToHtml: function (obj, value) {
      return Helpers.newlineToBr(value);
    },
    convertToObject: function (obj, value) {
      return Helpers.brToNewline(value);
    },
    data: function (value) {

      if (!value) {
        return [];
      }

      return Customers.find({
        address: {
          $regex: value,
          $options: 'i'
        }
      }, {
          limit: 50
        });
    },
    onSelect: function (e, tmpl) {
      var parentData = Template.parentData(2);

      var itemsDocument = parentData.itemsDocument;

      if (itemsDocument.customer && itemsDocument.customer.originId != this._id) {
        tmpl.$('.customer-name').text('');
      }
      Meteor.call('setItemsDocumentCustomer', itemsDocument._id, this._id);
    },
    onInput: function (e, tmpl) {
      // console.log('on input %o', this);
      var searchName = tmpl.$(e.target).text();
      let userId = Meteor.userId();
      Meteor.subscribe('customers-by-name', Meteor.userDomain(userId), searchName);
    },
    onBlur: function (e, tmpl) {
      Meteor.setTimeout(() => {
      }, 250);
    }
  }
};

Template.Intro.helpers({

  getOriginalCustomer: function () {

    if (!this.data || !this.data.originId) {
      return undefined;
    }

    var customer = Customers.findOne({ _id: this.data.originId });
    return customer;
  },

  getConformTitle: function () {
    return {
      key: 'title',
      meteormethod: 'updateItemsDocumentCustomer',
      docId: this.docId,
      data: this.data,
      isEditable: this.isEditable,
      placeholder: 'Title...',
      convertToHtml: function (obj, value) {
        return Helpers.newlineToBr(value);
      },
      convertToObject: function (obj, value) {
        return Helpers.brToNewline(value);
      },
      options: getTitleOptions()
    };
  },

  getConformName: function () {
    return {
      key: 'name',
      meteormethod: 'updateItemsDocumentCustomer',
      docId: this.docId,
      data: this.data,
      isEditable: this.isEditable,
      placeholder: 'Name...',
      convertToHtml: function (obj, value) {
        return Helpers.newlineToBr(value);
      },
      convertToObject: function (obj, value) {
        return Helpers.brToNewline(value);
      },
      options: getNameOptions()
    };
  },

  getConformAddress: function () {
    return {
      key: 'address',
      meteormethod: 'updateItemsDocumentCustomer',
      docId: this.docId,
      data: this.data,
      isEditable: this.isEditable,
      placeholder: 'Address...',
      convertToHtml: function (obj, value) {
        return Helpers.newlineToBr(value);
      },
      convertToObject: function (obj, value) {
        return Helpers.brToNewline(value);
      },
      options: getAddressOptions()
    };
  },

  getConformItemsDocumentNumber: function () {
    return {
      key: 'number',
      meteormethod: 'updateItemsDocument',
      docId: this.docId,
      data: this.itemsDocument,
      isEditable: this.isEditable,
      placeholder: 'ItemsDocument Number...',
      convertToHtml: function (obj, value) {
        return '' + value;
      },
      convertToObject: function (obj, value) {
        return parseInt(value);
      }
    };
  },

  getConformDate: function () {
    return {
      key: 'date',
      meteormethod: 'updateItemsDocument',
      docId: this.docId,
      data: this.itemsDocument,
      isEditable: this.isEditable,
      placeholder: 'Date...',
      convertToHtml: function (obj, value) {
        return momentDay(value).format('DD.MM.YYYY');
      },
      convertToObject: function (obj, value) {
        return momentDay(value, 'DD.MM.YYYY').toDate();
      }
    };
  }
});

Template.Intro.events({

  'click .open-customer': function (e, tmpl) {
    let customerId = this.itemsDocument.customer.originId;
    Router.go('customer.edit', {
      _id: customerId
    });
  },

  'click .remove-customer': function (e, tmpl) {
    console.log('remove customer %o', this);

    var itemsDocumentId = this.itemsDocument._id;
    Meteor.call('unsetItemsDocumentCustomer', itemsDocumentId);
  },

  'click .save-customer': function (e, tmpl) {
    console.log(this);

    let parentData = Template.parentData(1);
    let itemsDocument = parentData.itemsDocument;

    let customer = this.data;

    Meteor.call('addCustomer', customer, function (err, res) {
      if (err) {
        console.error(err);
      }
      else {
        console.log(res);
        Meteor.call('setItemsDocumentCustomer', itemsDocument._id, res);
      }
    });
  }
});
