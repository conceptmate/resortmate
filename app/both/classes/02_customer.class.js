/* global Concept */
/* global Customer */
var ns = Concept.Namespace.create('ResortMate');

Customer = class Customer extends BaseObject {
  
  constructor(customer) {
    super(customer);
  }
}

ns.addClass('Customer', Customer);