/* global Concept */
var ns = Concept.Namespace.create('Concept.Paper');

class PageRenderer {

  constructor() {
    this.pages = [];
    this.elements = [];
    
    this.initializeElements();
  }
  
  initializeElements() {
    // empty
  }
  
  onRendered(onRenderedCallback) {
    this.onRenderedCallback = onRenderedCallback;
  }

  render(target) {
    
    // link render object to DOM element
    $(target).data('render-object', this);
    
    this.target = target;
    
    // empty pages
    this.pages.length = 0;
    
    // create first page
    var page = this.newPage();

    _.each(this.elements, (element) => {
      // console.log('element %o', element);
      element.render(this);
    });
    
    if (this.onRenderedCallback) {
      this.onRenderedCallback.call(this);
    }
  }

  addElement(element) {
    this.elements.push(element);
  }

  newPage() {
    let pageNumber = this.pages.length + 1;
    let pageOf = this.pages.length + 1;
    
    let page = new Concept.Paper.Page(pageNumber, pageOf);
    
    this.pages.forEach(function(otherPage) {
      console.log(pageOf);
      otherPage.setPageOf(pageOf);
    }, this);
    
    // add page to page renderer
    this.pages.push(page);
    
    // render page
    page.render(this.target);

    return page;
  }
  
  getPage() {
    return this.pages[this.pages.length - 1];
  }
}

ns.addClass('PageRenderer', PageRenderer);