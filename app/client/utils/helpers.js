/* global Helpers */
Helpers = (function () {
  
  var serverDate = new ReactiveVar();

  this.getServerDate = function () {
    if (!serverDate.get()) {
      Meteor.call('getServerDate', function (err, date) {
        serverDate.set(date);
      });
    }

    return serverDate.get();
  },
  
  /**
   * Gets a user's friendly name.
   * 
   * @param {String} user The user object.
   */
  this.getFriendlyName = function (user) {
    if (user.username) {
      return user.username;
    }
    else if (typeof user.profile !== 'undefined' && user.profile.name) {
      return user.profile.name;
    }
    else if (typeof user.profile !== 'undefined' && user.profile.firstName && user.profile.lastName) {
      return user.profile.firstName + ' ' + user.profile.lastName;
    }
    else if (typeof user.profile !== 'undefined' && user.profile.firstName) {
      return user.profile.firstName;
    }
    else if (typeof user.profile !== 'undefined' && user.profile.lastName) {
      return user.profile.lastName;
    }
    else if (user.emails[0].address) {
      return user.emails[0].address;
    }
    throw new Error('no friendly name found');
  };

  this.maintainLinebreaks = function (value) {
    let fixedValue = Helpers.newlineToBr(value);

    if (fixedValue) {
      return new Spacebars.SafeString(fixedValue);
    }
    return null;
  };

  this.newlineToBr = function (value) {
    if (value) {
      return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    return null;
  };

  this.brToNewline = function (value) {
    if (value) {
      return value.replace(/(?:<br \/>|<br>|<br\/>)/g, '\r\n');
    }
    return null;
  };

  this.safeString = function (value) {
    if (value) {
      // a quirky workaround to decode html entities.
      return $('<div/>').html(value).text()
    }
    return null;
  };

  this.getOrderItemsColumns = function (editableColumns) {
    return [
      {
        key: "index",
        // label: "Index",
        convertToHtml: function (item, value) {
          // console.log(this);
          return this.index + 1;
        }
      },
      {
        key: "quantity",
        label: i18n('invoice.table.quantity'),
        isEditable: editableColumns
      },
      {
        key: "description",
        label: i18n('invoice.table.description'),
        placeholder: i18n('invoice.table.descriptionPlaceholder'),
        isEditable: editableColumns,
        convertToHtml: function (obj, value) {
          return Helpers.newlineToBr(value);
        },
        convertToObject: function (obj, value) {
          return Helpers.brToNewline(value);
        },
        options: {

          keyName: 'key',
          valueName: 'description',
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

            return Items.find({
              $or: [{
                key: {
                  $regex: value,
                  $options: 'i'
                }
              }, {
                  description: {
                    $regex: value,
                    $options: 'i'
                  }
                }]
            }, {
                limit: 50
              });
          },
          onSelect: function (e, tmpl, data) {
            // console.log(this);
            // console.log(data);

            data.data.description = this.description;
            data.data.price = this.price;
            data.data.vat = this.vat;

            Meteor.call('updateItemsDocumentItem2', data.docId, data.index, data.data);
          }
        }
      },
      {
        key: "vat",
        label: i18n('invoice.table.vat'),
        isEditable: editableColumns,
        suffix: '%',
        convertToObject: function (item, value) {
          return numeral().unformat(value);
        },
        convertToHtml: function (item, value) {
          return numeral(value).format('0');
        }
      },
      {
        key: "price",
        label: i18n('invoice.table.singlePrice'),
        isEditable: editableColumns,
        prefix: '&euro; ',
        convertToObject: function (item, value) {
          return numeral().unformat(value);
        },
        convertToHtml: function (item, value) {
          return numeral(value).format('0,0.00');
        }
      },
      {
        key: "totalPrice",
        label: i18n('invoice.table.price'),
        prefix: '&euro; ',
        convertToHtml: function (item, value) {
          let multiplied = item.quantity * item.price;
          return numeral(multiplied).format('0,0.00');
        }
      }
    ];
  };

  return this;

}).call({});

Template.registerHelper('Schemas', function () {
  return Schemas;
});

Template.registerHelper('Tables', function () {
  return Tables;
});

Template.registerHelper('currentUser', function () {
  return Meteor.user();
});

Template.registerHelper('currentUserId', function () {
  return Meteor.userId();
});

Template.registerHelper('currentDomain', function () {
  let userId = Meteor.userId();
  return Meteor.userDomain(userId);
});

Template.registerHelper('roles', function () {
  return Meteor.roles.find();
});

Template.registerHelper('isRouteActive', function (options) {
  var opts = options.hash;

  if (typeof opts !== 'object')
    throw new Error("isRouteActive options must be key value pairs such as {{isRouteActive routeNames='[my.route.name]'}}. You passed: " + JSON.stringify(opts));

  opts = opts || {};
  var routeNames = opts.routeNames ? opts.routeNames.split(',') : [];
  var documentType = opts.documentType ? opts.documentType : undefined;

  var router = Router.current();
  if (router) {
    var route = router.route;
    var name = route.getName();

    for (var i = 0; i < routeNames.length; i++) {
      if (name === routeNames[i]) {

        if (documentType) {
          if (router.params.documentType === documentType) {
            return "active";
          }
        }
        else {
          return "active";
        }
      }
    }
  }
  return "";
});

Template.registerHelper('friendlyName', function (user) {
  return Helpers.getFriendlyName(user);
});

Template.registerHelper('maintainLinebreaks', function (value) {
  return Helpers.maintainLinebreaks(value);
});

Template.registerHelper('defaultOmitFields', function() {
  return '_id,transaction_id,deleted,owner,group,createdAt';
});

/**
 * 
 */
Template.registerHelper('safeString', function (value) {
  return Helpers.safeString(value);
});

Template.registerHelper('i18np', function (prefix, key) {
  return i18np(prefix, key);
});

Template.registerHelper('i18nf', function (key) {
  return i18nf.apply(this, arguments);
});

Template.registerHelper('formatDate', function (date, format) {
  return momentDay(date).format(format);
});

Template.registerHelper('serverDate', function () {
  return Helpers.getServerDate();
});