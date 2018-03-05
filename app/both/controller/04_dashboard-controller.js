/* global DashboardController */
var defaultRange = {
  fromDate: momentDay().subtract(3, 'days').toDate(),
  toDate: momentDay().add(14, 'days').toDate()
}

DashboardController = ApplicationController.extend({
  
  layoutTemplate: 'AppLayout',

  // Subscriptions or other things we want to "wait" on. More on waitOn in the
  // next section.
  waitOn: function () {
    // console.log('echo waitOn');
    let userId = Meteor.userId();
    let domain = Meteor.userDomain(userId);
    
    let range = this.state.get('dateRange');
    if (!range) {
      range = defaultRange;
    }

    if (domain) {
      return [
        Meteor.subscribe('rooms', domain),
        Meteor.subscribe('bookings', domain, range.fromDate, range.toDate)
      ];
    }
    return undefined;
  },

  getTimeline: function (range) {
    // console.log('range %o', range);

    let fromDate = momentDay(range.fromDate);
    let toDate = momentDay(range.toDate);

    // console.log('fromDate %o, toDate %o', fromDate, toDate);

    let days = toDate.diff(fromDate, 'days') + 1;
    let timeline = [];
    for (let i = 0; i < days; i++) {
      let date = fromDate.clone().toDate();
      timeline.push({
        date: date
      });
      fromDate.add(1, 'days');
    }

    // console.log('timeline %o', timeline);

    return timeline;
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.
  data: function () {
    // console.log('echo data');
    // let query = this.params.query;
    // // let fromDate = params.fromDate;
    // // let toDate = params.toDate;
    
    // console.log('query %o', query);
    
    let range = this.state.get('dateRange');
    if (!range) {
      range = defaultRange;
    }

    return {
      timeline: this.getTimeline(range),
      dateRange: range,
      rooms: Rooms.find({}, {
        sort: {
          order: 1
        }
      }),
      bookings: Bookings.find({}, {
        transform: function (booking) {
          return new ResortMate.Booking(booking);
        }
      })
    }
  },

  dashboard: function() {
    this.render('Dashboard');
  },
});

Router.route('/dashboard', {
  name: 'dashboard',
  controller: DashboardController,
  action: 'dashboard'
});
