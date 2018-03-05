/* global ReactiveVar */
/* global CustomTemplate */
/* global Concept */
var ns = Concept.Namespace.create('Concept.Paper.Elements');

CustomTemplate = class CustomTemplate extends BaseElement {

  constructor(template, data, options) {
    super();
  
    this.template = template;
    this.dataContext = {};
    
    if (data) {
      this.dataContext.data = data;
    }
    
    if (options) {
      this.dataContext.options = options;
    }
  }
  
  setData(data) {
    this.dataContext.data = data;
  }
  
  render(renderer) {
    
    if (!this.dataContext || !Object.keys(this.dataContext).length) {
      console.warn('not rendering component because data is empty %o', this.dataContext);
      return;
    }
    
    let view = this.renderElement(renderer);
  
    if (view.isDestroyed) {
      page = renderer.newPage();
      let view = this.renderElement(renderer);
  
      if (view.isDestroyed) {
        throw new Error('element larger than page');
      }
    }
  }
  
  renderElement(renderer) {
    let page = renderer.getPage();
    return page.renderElement(this.template, this.dataContext);
  }
}

ns.addClass('CustomTemplate', CustomTemplate);