/* global Iron */
var getColumnByDate = function (fromDate, arrivalDate) {
  // // console.log('arr date=%o', arrivalDate);
  // let mFromDate = momentDay(fromDate);
  // let mArrivalDate = momentDay(arrivalDate);

  // let col = mArrivalDate.diff(mFromDate, 'days');

  // console.log('date=%o, fromDate=%o, col=%o', arrivalDate, fromDate, col);
  
  // if (col < 0) {
  //   return col;
  // }
  // else if (col === 0) {
  //   return col;
  // }

  // return col;
  
  let mFromDate = momentDay(fromDate);
  let mArrivalDate = momentDay(arrivalDate);
  let days = mArrivalDate.diff(mFromDate, 'days', true);
  // console.log('fromDate %o', fromDate);
  // console.log('arrivalDate %o', arrivalDate);
  // console.log('days %o', days);

  return days + 1;
};

var getDays = function (arrivalDate, departureDate) {
  let arrDate = momentDay(arrivalDate);
  let depDate = momentDay(departureDate);
  return depDate.diff(arrDate, 'days');
};

/**
 * Change block, update in database collection.
 */
var changeBlock = function (e, tmpl) {
  let roomId = $(e.row).attr('room-id');
  let date = $(e.column).attr('date');
  let arrivalDate = momentDay(date, 'MM/DD/YYYY').toDate();
  let departureDate = momentDay(date, 'MM/DD/YYYY').add(this.days, 'days').toDate();

  // console.log('date %o', arrivalDate);
  
  // return;
  
  let modifier = {
    $set: {
      roomId: roomId,
      arrivalDate: arrivalDate,
      departureDate: departureDate
    }
  };

  // console.log('arrivalDate %o', arrivalDate);
  // console.log('update %o', modifier);

  // e.allow();

  Meteor.call('updateBooking', modifier, this._id, function (err, res) {
    if (err) {
      console.error(err);
    }
    else {
      e.allow();
    }
  });
};

AutoForm.hooks({
  'booking-overview-search-form': {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      // console.log(insertDoc);

      var controller = Iron.controller();

      insertDoc.fromDate = momentDay(insertDoc.fromDate).toDate();
      insertDoc.toDate = momentDay(insertDoc.toDate).toDate();
  
      // reactively return the value of postId
      controller.state.set('dateRange', insertDoc);

      return false;
    }
  }
});

Template.BookingsOverview.helpers({

  dateRange: function () {
    var controller = Iron.controller();
    let dateRange = controller.state.get('dateRange');

    if (!dateRange) {
      dateRange = this.dateRange;
    }
    // console.log('dateRange %o', dateRange);

    return dateRange;
  }
});

Template.BookingTimetable.onRendered(function () {
  let tmpl = this;

  var $gridy = this.$('.gridy').gridy({
    blockWidth: 100,
    blockHeight: 80
  });
  var gridy = $gridy.data('gridy');

  // recalculate gridy  
  this.autorun(() => {
    // console.log('autorun gridy.update()');
    let controller = Iron.controller();
    let dateRange = controller.state.get('dateRange');
    gridy.update();

    let $columns = this.$('.gridy .columns');
    let $contentViewport = this.$('.gridy .content-viewport');
    let $grid = this.$('.gridy .grid');
    let $gridlines = this.$('.gridy .gridlines');

    $contentViewport.css({
      height: $grid.height() + $columns.height()
    });
    $gridlines.css({
      top: -$grid.height(),
      height: $grid.height(),
      width: $grid.width()
    })
  });

  var data = this.data;

  // console.log('data %o', data);
  // console.log('$gridy %o', $gridy);
  // console.log('gridy %o', gridy);

  var bookings = data.bookings;
  bookings.observe({
    // added: function (document) {
    //   console.log('on added %o', document);
    // },
    changed: function (newDocument, oldDocument) {

      // console.log(newDocument);

      var $block = gridy.$grid.find('li[booking-id="' + newDocument._id + '"]:not(.ghost)');

      let $row = gridy.$rows.find('li[room-id="' + newDocument.roomId + '"]');
      let row = $row.data('row');
      let col = getColumnByDate(tmpl.data.dateRange.fromDate, newDocument.arrivalDate);
      let colSpan = getDays(newDocument.arrivalDate, newDocument.departureDate);

      // console.log('block %o', $block.data().row);
      $block.data({
        row: row,
        col: col,
        colSpan: colSpan
      });

      gridy.updateBlock($block.get(0), true);
    }
  });
});

Template.BookingTimetable.events({

  'change .gridy .block': function (e, tmpl) {
    // console.log('event %o', e);
        
    if (e.newData.col !== e.oldData.col) {
      let context = {
        title: i18nf('booking.movedDate.title'),
        message: i18nf('booking.movedDate.message')
      };

      App.showModal(context, () => {
        changeBlock.call(this, e, tmpl);
      });
    }
    else {
      changeBlock.call(this, e, tmpl);
    }
  }
});

Template.BookingBlock.onRendered(function() {
  
  let gridy = $('.gridy').data('gridy');
  
  let data = this.data;
  let block = this.$('li[booking-id="' + data._id + '"]');
  
  // console.log('data=%o, block=%o', data, block);

  if (gridy) {
    gridy.updateBlock(block.get(0), true);
  }
});


Template.BookingBlock.helpers({

  row: function (roomId) {
    let parentData = Template.parentData(1);

    let idx;
    _.each(parentData.rooms.fetch(), function (room, index) {
      if (roomId === room._id) {
        idx = index;
        return false;
      }
    });

    return idx + 1;
  },

  col: function (arrivalDate) {
    let parentData = Template.parentData(1);
    return getColumnByDate(parentData.dateRange.fromDate, this.arrivalDate);
  }
});

Template.BookingBlock.events({

  'click .open-customer': function (e, tmpl) {
    e.preventDefault();

    Router.go('customer.edit', {
      _id: this._id
    });
  },

  'click .open-booking': function (e, tmpl) {
    e.preventDefault();

    Router.go('booking.edit', {
      _id: this._id
    });
  },

  'click .delete-booking': function (e, tmpl) {
    e.preventDefault();
    
    let context = {
      title: i18nf('booking.delete.title'),
      message: i18nf('booking.delete.message')
    };

    App.showModal(context, () => {
      Meteor.call('deleteBooking', this._id);
    });
  }
});