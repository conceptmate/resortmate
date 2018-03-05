/* global TextBox */
/* global Concept */
var ns = Concept.Namespace.create('Concept.Paper.Elements');

TextBox = class TextBox extends CustomTemplate {

  constructor(text, options) {
    super(Template.ConceptPaperTextBox, {}, options);
    this.setText(text);
  }
  
  setText(text) {
    if (text) {
      this.dataContext.data.text = text;
    }
    else {
      delete this.dataContext.data.text;
    }
  }

  render(renderer) {
    super.render(renderer);
  }
}

ns.addClass('TextBox', TextBox);