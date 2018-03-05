/* global Migrations */
Migrations.add({
  version: 1,
  name: 'Migrate items document booking to items document offer.',
  up: function () {

    ItemsDocuments.update({
      documentType: 'booking'
    }, {
        $set: {
          documentType: 'offer'
        }
      }, {
        multi: true
      });

    ItemsDocuments.update({
      documentType: 'invoice'
    }, {
        $rename: {
          'booking': 'offer'
        }
      }, {
        multi: true
      });
  },
  down: function () {

    ItemsDocuments.update({
      documentType: 'invoice'
    }, {
        $rename: {
          'offer': 'booking'
        }
      }, {
        multi: true
      });

    ItemsDocuments.update({
      documentType: 'offer'
    }, {
        $set: {
          documentType: 'booking'
        }
      }, {
        multi: true
      });
  }
});