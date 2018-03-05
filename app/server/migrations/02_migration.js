/* global Migrations */
Migrations.add({
  version: 2,
  name: 'Add vatType property to items and items documents.',
  up: function () {

    Items.update({}, {
      $set: {
        vatType: 'gross'
      }
    }, {
        multi: true
      });

    let itemsDocuments = ItemsDocuments.find({
      'items': { $exists: true }
    });

    itemsDocuments.forEach(function (itemsDocument) {
      let id = itemsDocument._id;

      itemsDocument.items.forEach(function (item) {
        item.vatType = 'gross';
      });

      ItemsDocuments.update({ _id: id }, {
        $set: {
          items: itemsDocument.items
        }
      });
    });
  },
  down: function () {

    Items.update({}, {
      $unset: {
        vatType: 1
      }
    }, {
        multi: true
      });

    let itemsDocuments = ItemsDocuments.find({
      'items': { $exists: true }
    });

    itemsDocuments.forEach(function (itemsDocument) {
      let id = itemsDocument._id;

      itemsDocument.items.forEach(function (item) {
        delete item.vatType;
      });

      ItemsDocuments.update({ _id: id }, {
        $set: {
          items: itemsDocument.items
        }
      });
    });
  }
});