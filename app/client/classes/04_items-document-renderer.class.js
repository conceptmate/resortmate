/* global ItemsDocumentRenderer */
/* global Concept */
var ns = Concept.Namespace.create('ResortMate');

ItemsDocumentRenderer = class ItemsDocumentRenderer extends Concept.Paper.PageRenderer {

  constructor(itemsDocument) {
    super();
    
    this.itemsDocument = itemsDocument;
    
    this.setDocumentType(itemsDocument.documentType);
    this.setCustomer(itemsDocument.customer);
    this.setOrderItems(itemsDocument.items);
    this.setPrefix(itemsDocument.prefix);
    this.setSuffix(itemsDocument.suffix);
  }
  
  initializeElements() {
    this.introElement = new Concept.Paper.Elements.CustomTemplate(Template.Intro);
    this.addElement(this.introElement);
    
    this.itemsDocumentTitle = new Concept.Paper.Elements.TextBox(null, {
      classes: ['items-document-title']
    });
    this.addElement(this.itemsDocumentTitle);
    
    this.prefixTextBox = new Concept.Paper.Elements.TextBox();
    this.addElement(this.prefixTextBox);
    
    this.table = new Concept.Paper.Elements.Table();
    this.addElement(this.table);
    
    this.sumTextBox = new Concept.Paper.Elements.CustomTemplate(Template.OrderSum);
    this.addElement(this.sumTextBox);
    
    this.vatTextBox = new Concept.Paper.Elements.TextBox();
    this.addElement(this.vatTextBox);
    
    this.suffixTextBox = new Concept.Paper.Elements.TextBox();
    this.addElement(this.suffixTextBox);
  }
  
  setDocumentType(documentType) {
    this.itemsDocumentTitle.setText(i18np(documentType, 'title'));
  }

  setCustomer(customer) {
    this.introElement.dataContext = {
      itemsDocument: this.itemsDocument,
      data: customer
    }
  }
  
  setPrefix(prefix) {
    this.prefixTextBox.setText(prefix);
  }
  
  setSuffix(suffix) {
    this.suffixTextBox.setText(suffix);
  }

  setOrderItems(orderItems) {
    this.table.columns = this.getOrderItemsColumns();
    this.table.items = orderItems;
    
    if (!orderItems) {
      return;
    }
    
    let totalValue = AccountingUtils.getTotalGrossValue(orderItems)
    this.sumTextBox.setData({
      prefix: '&euro; ',
      totalSum: numeral(totalValue).format('0,0.00')
    });
    
    let message = AccountingUtils.getVatTotalsMessage(orderItems);
    this.vatTextBox.setText(message);
  }
  
  getOrderItemsColumns() {
    return Helpers.getOrderItemsColumns(false);
  }
}

ns.addClass('ItemsDocumentRenderer', ItemsDocumentRenderer);