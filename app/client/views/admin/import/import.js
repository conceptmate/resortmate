/**
 *
 */
var addOutput = function (text) {
  var $importOutput = $('#importOutput');

  var oldText = $importOutput.val();
  if (oldText.length > 0) {
    oldText += "\r\n";
  }

  $importOutput.val(oldText + text);
};

/**
 *
 */
var getValue = function (item, fieldName, func) {
  var field = $(item).find("field[name=" + fieldName + "]");

  if (field) {
    var text = field.text();

    if (!text || !func) {
      return text;
    }

    try {
      return func(text);
    }
    catch (error) {
      console.log(error);
    }
  }
  return null;
};

/**
 *
 */
var parseArticleDescriptions = function (result) {

  var articleDescriptions = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      articleDescriptions.push({
        id: getValue(row, "ID", parseInt),
        description: getValue(row, "DESCRIPTION"),
        systemLocaleKey: getValue(row, "SYSTEM_LOCALE_KEY"),
        articleId: getValue(row, "ARTICLE_ID", parseInt)
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return articleDescriptions;
};

/**
 *
 */
var parseArticles = function (result) {

  var articles = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      articles.push({
        id: getValue(row, "ID", parseInt),
        articleNumber: getValue(row, "ARTICLE_NUMBER"),
        unitId: getValue(row, "UNIT_ID", parseInt),
        price: getValue(row, "PRICE", parseFloat),
        purchaseTax: getValue(row, "PURCHASE_TAX", parseFloat),
        bundleCapacity: getValue(row, "BUNDLE_CAPACITY", parseInt),
        bundleUnitId: getValue(row, "BUNDLE_UNIT_ID", parseInt)
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return articles;
};

/**
 *
 */
var parseBusinessPartners = function (result) {

  var businessPartners = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      businessPartners.push({
        id: getValue(row, "ID", parseInt),
        customerNumber: getValue(row, "CUSTOMER_NUMBER"),
        companyTitle: getValue(row, "COMPANY_TITLE"),
        companyName: getValue(row, "COMPANY_NAME"),
        companyBranch: getValue(row, "COMPANY_BRANCH"),
        forAttentionOf: getValue(row, "FOR_ATTENTION_OF", parseInt),
        personId: getValue(row, "PERSON_ID", parseInt),
        addressId: getValue(row, "ADDRESS_ID", parseInt),
        bankingId: getValue(row, "BANKING_ID", parseInt)
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return businessPartners;
};

/**
 *
 */
var parsePersons = function (result) {

  var persons = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      persons.push({
        id: getValue(row, "ID", parseInt),
        titleId: getValue(row, "TITLE_ID", parseInt),
        academicTitleId: getValue(row, "ACADEMIC_TITLE_ID"),
        firstname: getValue(row, "FIRSTNAME"),
        lastname: getValue(row, "LASTNAME"),
        phone: getValue(row, "PHONE"),
        fax: getValue(row, "FAX"),
        email: getValue(row, "EMAIL"),
        addressId: getValue(row, "ADDRESS_ID", parseInt)
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return persons;
};

/*
 *
 */
var parseBankings = function (result) {

  var bankings = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      bankings.push({
        id: getValue(row, "ID", parseInt),
        bankEstablishment: getValue(row, "BANK_ESTABLISHMENT"),
        accountNumber: getValue(row, "ACCOUNT_NUMBER"),
        bankIdentificationNumber: getValue(row, "BANK_IDENTIFICATION_NUMBER")
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return bankings;
};

/**
 *
 */
var parseAddresses = function (result) {

  var addresses = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      addresses.push({
        id: getValue(row, "ID", parseInt),
        street: getValue(row, "STREET"),
        zipCode: getValue(row, "ZIP_CODE"),
        city: getValue(row, "CITY"),
        countryKey: getValue(row, "COUNTRY_KEY"),
        countyKey: getValue(row, "COUNTY_KEY")
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return addresses;
};

/**
 *
 */
var parseDeliveryOrders = function (result) {

  var deliveryOrders = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      deliveryOrders.push({
        id: getValue(row, "ID", parseInt),
        businessPartnerId: getValue(row, "BUSINESS_PARTNER_ID", parseInt),
        deliveryOrderNumber: getValue(row, "DELIVERY_ORDER_NUMBER"),
        deliveryOrderDate: getValue(row, "DELIVERY_ORDER_DATE"),
        characterisationType: getValue(row, "CHARACTERISATION_TYPE"),
        prefixFreeText: getValue(row, "PREFIX_FREE_TEXT"),
        suffixFreeText: getValue(row, "SUFFIX_FREE_TEXT"),
        preparedBill: getValue(row, "PREPARED_BILL", parseInt),
        billId: getValue(row, "BILL_ID", parseInt)
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return deliveryOrders;
};

/**
 *
 */
var parseReduplicatedArticles = function (result) {

  var reduplicatedArticles = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      reduplicatedArticles.push({
        id: getValue(row, "ID", parseInt),
        deliveryOrderId: getValue(row, "DELIVERY_ORDER_ID", parseInt),
        orderPosition: getValue(row, "ORDER_POSITION", parseInt),
        articleNumber: getValue(row, "ARTICLE_NUMBER"),
        quantity: getValue(row, "QUANTITY", parseInt),
        unit: getValue(row, "UNIT"),
        price: getValue(row, "PRICE", parseFloat),
        purchaseTax: getValue(row, "PURCHASE_TAX", parseFloat),
        description: getValue(row, "DESCRIPTION")
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return reduplicatedArticles;
}

/**
 *
 */
var parseBills = function (result) {

  var bills = [];

  var $rows = result.find("row");
  $rows.each(function (i, row) {
    // console.log(row);

    try {
      bills.push({
        id: getValue(row, "ID", parseInt),
        businessPartnerId: getValue(row, "BUSINESS_PARTNER_ID", parseInt),
        billNumber: getValue(row, "BILL_NUMBER"),
        billDate: getValue(row, "BILL_DATE"),
        characterisationType: getValue(row, "CHARACTERISATION_TYPE"),
        prefixFreeText: getValue(row, "PREFIX_FREE_TEXT"),
        suffixFreeText: getValue(row, "SUFFIX_FREE_TEXT")
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  return bills;
}

/**
 *
 */
var parseFiles = function (files, i, callback, result) {

  if (!result) {
    result = [];
  }

  var reader = new FileReader();

  reader.onload = function () {
    var source = reader.result;

    var xmlDocument = $.parseXML(reader.result);

    var $resultset = $(xmlDocument).find("table_data");

    var tableName = $resultset.attr("name");

    var type = null;
    var data = null;

    if (tableName.indexOf("article_description") > -1) {
      type = "articleDescriptions";
      data = parseArticleDescriptions($resultset);
    }
    else if (tableName.indexOf("reduplicated_article") > -1) {
      type = "reduplicatedArticles";
      data = parseReduplicatedArticles($resultset);
    }
    else if (tableName.indexOf("article") > -1) {
      type = "articles";
      data = parseArticles($resultset);
    }
    else if (tableName.indexOf("business_partner") > -1) {
      type = "businessPartners";
      data = parseBusinessPartners($resultset);
    }
    else if (tableName.indexOf("person") > -1) {
      type = "persons";
      data = parsePersons($resultset);
    }
    else if (tableName.indexOf("banking") > -1) {
      type = "bankings";
      data = parseBankings($resultset);
    }
    else if (tableName.indexOf("address") > -1) {
      type = "addresses";
      data = parseAddresses($resultset);
    }
    else if (tableName.indexOf("delivery_order") > -1) {
      type = "deliveryOrders";
      data = parseDeliveryOrders($resultset);
    }
    else if (tableName.indexOf("bill") > -1) {
      type = "bills";
      data = parseBills($resultset);
    }
    else {
      type = 'unknown';
      data = [];
    }
    addOutput("Parsed " + type + " with " + data.length + " entries.");

    result[type] = data;

    if (i < files.length - 1) {
      parseFiles(files, ++i, callback, result);
    }
    else {
      callback(null, result);
    }
  };

  reader.onerror = function () {
    console.error(reader.error);

    if (i < files.length - 1) {
      parseFiles(files, ++i, callback, result);
    }
    else {
      callback(reader.error, null);
    }
  };

  reader.readAsText(files[i]);
};

/**
 *
 */
var importData = function (result, callback) {

  var businessPartners = result.businessPartners;
  var persons = result.persons;
  var addresses = result.addresses;

  console.log(result);

  var customersMap = {};
  var offersMap = {};
  _.each(businessPartners, function (businessPartner) {
    let person = _.findWhere(persons, { id: businessPartner.personId });
    let address = _.findWhere(addresses, { id: businessPartner.addressId });

    var customer = addCustomer(businessPartner, person, address);
    if (customer) {
      customersMap[businessPartner.id] = customer;
    }
  });

  _.each(result.deliveryOrders, function (deliveryOrder) {

    let customer = customersMap[deliveryOrder.businessPartnerId];
    
    if (!customer) {
      console.error('could not find customer for %o', deliveryOrder.businessPartnerId);
      return;
    }
    
    let copyCustomer = _.extend({}, customer);
    copyCustomer.originId = copyCustomer._id;
    delete copyCustomer._id
    
    var dateOffer = momentDay(deliveryOrder.deliveryOrderDate, 'YYYY-MM-DD').toDate();
    let suffixOffer = deliveryOrder.suffixFreeText + '\r\n\r\nWir bedanken uns für Ihre Buchung und freuen uns schon jetzt auf Ihren Aufenthalt.\r\n\r\n' +
        '<b>Ihre Pension Dorfstuben</b>';

    let offer = {
      documentType: 'offer',
      customer: copyCustomer,
      number: parseInt(deliveryOrder.deliveryOrderNumber),
      date: dateOffer,
      prefix: deliveryOrder.prefixFreeText,
      suffix: suffixOffer,
      items: []
    }
    
    // console.log('offer %o', offer);
    // return;

    let offerItems = _.filter(result.reduplicatedArticles, function (article) {
      return article.deliveryOrderId === deliveryOrder.id;
    });
    
    if (!offerItems.length) {
      console.warn('offer item id %o', deliveryOrder.id);
    }

    offerItems = _.sortBy(offerItems, function (item) {
      return item.orderPosition;
    });

    _.each(offerItems, function (item) {
      offer.items.push({
        key: item.key,
        quantity: item.quantity,
        description: item.unit + ' ' + item.description,
        vat: item.purchaseTax,
        price: item.price,
        vatType: item.vatType
      });
    });

    offer._id = ItemsDocuments.insert(offer);
    offersMap[deliveryOrder.id] = offer;
    
    // console.log('bills %o', result.bills);
    let bill = _.findWhere(result.bills, { id: deliveryOrder.billId });
    
    if (!bill) {
      console.warn('could not find bill %o', deliveryOrder.billId);
      return;
    }
    
    let invoice = _.extend({}, offer);
    delete invoice._id;
    
    var date = momentDay(bill.billDate, 'YYYY-MM-DD').toDate();
    var payDate = momentDay(bill.billDate, 'YYYY-MM-DD').add(14, 'days');
    
    let suffix = bill.suffixFreeText + '\r\n\r\nZahlbar netto bis zum ' + payDate.format('DD.MM.YYYY') + '.\r\n\r\n' +
        'Wir danken für Ihren Aufenthalt in unserem Haus und würden uns freuen wenn Sie uns bald wieder beehren.\r\n\r\n' +
        '<b>Ihre Pension Dorfstuben</b>';
    
    invoice.documentType = 'invoice';
    invoice.number = parseInt(bill.billNumber);
    invoice.date = date,
    invoice.prefix = bill.prefixFreeText;
    invoice.suffix = suffix;
    invoice.offer = offer._id;
    
    invoice._id = ItemsDocuments.insert(invoice);
    
    ItemsDocuments.update({ _id: offer._id }, {
      $set: {
        invoice: invoice._id
      }
    });
  });
  
  // _.each(result.bills, function(bill) {
  //   console.log('bill %o', bill);
  
  //   var customer = customerMap[bill.businessPartnerId];
  // var copyCustomer = _.extend({}, customer);
  // copyCustomer.originId = copyCustomer._id;
  // delete copyCustomer._id
    
  //   var invoice = {
  //     documentType: 'invoice',
  //     customer: copyCustomer,
  //     number: bill.billNumber,
  //     date: momentDay(bill.billDate, 'YYYY-MM-DD').toDate(),
  //     prefix: bill.prefixFreeText,
  //     suffix: bill.suffixFreeText,
  //     items: []
  //   }
  // });

  console.log("done");
};

/**
 *
 */
var addCustomer = function (bp, person, address) {
  
  // console.log(result);

  let title;
  switch (person.titleId) {
    case 2001:
      title = 'Herrn';
      break;
    case 2002:
      title = 'Frau'
      break;
  }
  let name = (person.firstname + " " + person.lastname).trim();
  let addr = (address.street + "\r\n" + address.zipCode + " " + address.city).trim();

  if (!name || !name.length) {
    name = bp.companyName;
  }
  else if (bp.companyName) {
    // console.error(bp.companyName);
    title = bp.companyTitle;
    addr = name + "\r\n" + addr;
    name = bp.companyName;
  }

  // console.log("title=%o", title);
  // console.log("name=%o", name);
  // console.log("address=%o", addr);
  // console.log("bp=%o", bp);
  
  if (!name || !addr) {
    return null;
  }

  // add customer and return customer object
  var customer = {
    owner: Meteor.userId(),
    title: title,
    name: name,
    address: addr,
    phone: person.phone,
    fax: person.fax,
    email: person.email
  };
  customer._id = Customers.insert(customer);

  return customer;
};

/**
 *
 */
Template.Import.events({

  'click .do-import': function (e, tmpl) {
    console.log('echo');

    var files = $('#importFiles').get(0).files;

    parseFiles(files, 0, function (err, result) {
      if (err) console.error(err);
      else importData(result, addCustomer);
    });
  },
});
