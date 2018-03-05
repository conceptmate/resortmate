/* global ItemsDocument */
var ns = Concept.Namespace.create('ResortMate');

ItemsDocument = class ItemsDocument extends BaseObject {
  
  constructor(itemsDocument) {
    super(itemsDocument);
  }
  
  get originalCustomer() {
    return Customers.findOne({ _id: this.customer._id }, {
      transform: function(customer) {
        return new ResortMate.Customer(customer);
      }
    });
  }
}

ns.addClass('ItemsDocument', ItemsDocument);

