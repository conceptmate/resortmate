/* global Concept */
var ns = Concept.Namespace.create('Concept.Paper');

class Page {

  constructor(pageNumber, pageOf, pageSize = 'A4') {
    this.pageNumber = pageNumber;
    this.pageOf = new ReactiveVar(pageOf);
    this.pageSize = pageSize;
  }
  
  setPageOf(pageOf) {
    this.pageOf.set(pageOf);
  }

  render(target) {
    
    var view = Blaze.renderWithData(Template.Page, () => {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        pageInfo: 'Seite ' + this.pageNumber + ' von ' + this.pageOf.get()
      }
    }, target);
    
    this.$page = $(view.firstNode());
    this.$pageContent = this.$page.find('.page-content');
    this.contentHeight = this.$pageContent.height();
    
    // link page object with DOM element
    this.$page.data('page', this);
  }

  renderElement(template, data, parentNode) {

    var $target;
    if (parentNode) {
      $target = $(parentNode);
    }
    else {
      $target = this.$pageContent;
    }
    
    // allow empty or null data
    if (!data) {
      data = {};
    }

    var view = Blaze.renderWithData(template, data, $target.get(0));
    
    // console.log('view %o', view);

    var contentHeight = this.contentHeight;

    // calculate height of all children  
    var totalHeight = 0;
    var $children = this.$pageContent.children();
    $children.each(function () {
      totalHeight += $(this).outerHeight(true);
    });
    
    var freeSpace = contentHeight - totalHeight;
    
    // console.log('space (%o, %o), free space %o for element %o', contentHeight, $children.last().outerHeight(true), freeSpace, $children.last().get(0));
    
    if (freeSpace < 0) {
      // remove previously added element and add it to new page
      Blaze.remove(view);
    }
    
    return view;
  }
}

ns.addClass('Page', Page);