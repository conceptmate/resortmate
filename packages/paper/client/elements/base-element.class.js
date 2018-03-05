/* global BaseElement */
/* global Concept */
var ns = Concept.Namespace.create('Concept.Paper.Elements');

BaseElement = class BaseElement {

  constructor() {
    // empty
  }
  
  render(renderer) {
    throw new Error('render(renderer) not implemented');    
  }
}

ns.addClass('BaseElement', BaseElement);