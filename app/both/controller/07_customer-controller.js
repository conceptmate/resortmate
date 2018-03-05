/* global CustomerController */
CustomerController = UserController.extend({

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    let customerId = this.params._id;
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);

    if (domain && customerId) {
      // TODO publishComposite('customer') -> with bookings and items-documents
      
      let subscriptions = [];
      subscriptions.push(Meteor.subscribe('customer', domain, customerId));
      
      if (Roles.userIsInRole(userId, ['accountant', 'manager', 'admin'], domain)) {
        subscriptions.push(Meteor.subscribe('customer-items-documents', domain, customerId));
      }
      else if (Roles.userIsInRole(userId, ['curator', 'manager', 'admin'], domain)) {
        subscriptions.push(Meteor.subscribe('customer-bookings', domain, customerId));
      }
      
      return subscriptions;
    }
    return undefined;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function () {
    let customerId = this.params._id;
    if (customerId) {
      return {
        customer: Customers.findOne({ _id: customerId }),
        bookings: Bookings.find({
          customerId: customerId
        }),
        offers: ItemsDocuments.find({
          documentType: 'offer',
          'customer.originId': customerId
        }),
        invoices: ItemsDocuments.find({
          documentType: 'invoice',
          'customer.originId': customerId
        })
      };
    }
    return undefined;
  },

  edit: function () {
    this.render('CustomerEdit');
    this.renderActions('#customer-form', 'customers');
  },

  list: function () {
    this.render('CustomerList');

    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: [
          this.createAction('customer.add', function () {
            Router.go('customer.add');
          })
        ]
      }
    });
  }
});

Router.route('/customers/', {
  name: 'customers',
  controller: CustomerController,
  action: 'list',
});

Router.route('/customers/add', {
  name: 'customer.add',
  controller: CustomerController,
  action: 'edit',
});

Router.route('/customers/edit/:_id', {
  name: 'customer.edit',
  controller: CustomerController,
  action: 'edit',
});