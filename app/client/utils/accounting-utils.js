/* global AccountingUtils */
AccountingUtils = (function() {
  
  this.defaultVat = 'gross';
  
  this.getVatTotalsMessage = function(items) {
    let vatTotals = this.getVatTotals(items);
    
    let message = '';    
    for (let vat in vatTotals) {
      let vatTotal = vatTotals[vat];
      let vatSum = vatTotal.totalGross - vatTotal.totalNet;
      
      let vatSumFormat = numeral(vatSum).format('0,0.00');
      let totalGrossSumFormat = numeral(vatTotal.totalGross).format('0,0.00');
      let totalNetSumFormat = numeral(vatTotal.totalNet).format('0,0.00');
      message += i18nf('items_document.vatSubSum', vat, vatSumFormat, totalGrossSumFormat, totalNetSumFormat) + '<br />';
    }
    return message;
  }
  
  this.getVatTotals = function(items) {
    let vatTotals = {};
    items.forEach((item) => {
      let vat = item.vat;
      let vatTotalNet = this.getNetValue(item);
      let vatTotalGross = this.getGrossValue(item);
      
      if (vatTotals[vat]) {
        let totals = vatTotals[vat];
        totals.totalGross += vatTotalGross;
        totals.totalNet += vatTotalNet
      }
      else {
        vatTotals[vat] = {
          totalGross: vatTotalGross,
          totalNet: vatTotalNet
        }
      }
    });
    return vatTotals;
  }
  
  this.getTotalNetValue = function(items) {
    let totalValue = 0;
    items.forEach((item) => {
      totalValue += this.getNetValue(item);
    });
    return totalValue;
  };
  
  this.getTotalGrossValue = function(items) {
    let totalValue = 0;
    items.forEach((item) => {
      totalValue += this.getGrossValue(item);
    });
    return totalValue;
  };
  
  this.getNetValue = function(item) {
    let value = item.price * item.quantity;
    if (item.vatType === 'gross') {
      return AccountingUtils.getNetFromGrossValue(value, item.vat);
    }
    return value;
  }
  
  this.getGrossValue = function(item) {
    let value = item.price * item.quantity;
    if (item.vatType === 'net') {
      return AccountingUtils.getGrossFromNetValue(value, item.vat);
    }
    return value;
  }
  
  this.getNetFromGrossValue = function(grossValue, vat) {
    return grossValue / ((vat / 100) + 1);
  };
  
  this.getGrossFromNetValue = function(netValue, vat) {
    return netValue * ((vat / 100) + 1);
  };
  
  return this;
}).call({});