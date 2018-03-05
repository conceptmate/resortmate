/* global Concept */
/* global Booking */
var ns = Concept.Namespace.create('ResortMate');

Booking = class Booking extends BaseObject {
  
  constructor(booking) {
    super(booking);
  }
  
  get customer() {
    return Customers.findOne({ _id: this.customerId }, {
      transform: function(customer) {
        return new ResortMate.Customer(customer);
      }
    })
  }
}

ns.addClass('Booking', Booking);