/* global Table */
/* global Concept */
var ns = Concept.Namespace.create('Concept.Paper.Elements');

Table = class Table extends BaseElement {

  constructor(columns, items, docId) {
    super();
    
    this.columns = columns
    this.items = items;
    this.docId = docId;
  };

  render(renderer) {
    // console.log('PageTable.render(%o)', renderer);

    this.table = this.renderTable(renderer);

    _.each(this.items, (item, index) => {
      this.renderItem(renderer, item, index);
    });
  }

  renderTable(renderer) {
    var page = renderer.getPage();
    var view = page.renderElement(Template.PageTable, {
      columns: this.columns,
      docId: this.docId
    });
    return view.firstNode();
  }

  renderItem(renderer, item, index) {
    
    var page = renderer.getPage();

    var template = Template.PageTableItem;
    var data = {
      columns: this.columns,
      item: item,
      index: index
    };

    var $tbody = $(this.table).find('tbody');
    var view = page.renderElement(template, data, $tbody.get(0));

    if (view.isDestroyed) {
      page = renderer.newPage();
      this.table = this.renderTable(renderer);

      $tbody = $(this.table).find('tbody');

      view = page.renderElement(template, data, $tbody.get(0));

      if (view.isDestroyed) {
        throw new Error('element larger than page');
      }
    }
  }
}

ns.addClass('Table', Table);