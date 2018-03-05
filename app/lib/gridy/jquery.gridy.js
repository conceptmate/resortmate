/* global Collision */
/* global jQuery */

if (Meteor.isClient) {

  // import jQuery from 'jquery';

  // console.log('jQuery: %o', jQuery);

  Collision = (function () {

    this.collides = function ($block, $grid) {
      var matrix = buildGridMatrix($grid);
      try {
        computeBlockWithMatrix(matrix, $block.get(0), function (value, colIdx, rowIdx) {
          if (value && value.length > 0) {
            throw new Error('collision detected');
          }
        });
        return false
      }
      catch (err) {
        return true;
      }
    };

    this.collidesWith = function (gridy, $block, $grid) {
      var matrix = buildGridMatrix($grid);

      // revert collision blocks to old state
      $grid.find('li.collision').each(function () {
        var $b = $(this);
        $b.removeClass('collision');
        $b.data('heightSplit', 1);
        $b.data('heightSplitOrder', 1);
        gridy.updateBlock(this);
      });

      computeBlockWithMatrix(matrix, $block.get(0), function (value, colIdx, rowIdx) {
        if (!value) {
          return [$block.get(0)];
        }
        value.push($block.get(0));
        return value;
      });

      for (var col = 0; col < matrix.length; col++) {
        for (var row = 0; row < matrix[col].length; row++) {
          var values = matrix[col][row];

          if (!values || values.length < 2) {
            continue;
          }

          for (var i = 0; i < values.length; i++) {
            var b = values[i];
            var $b = $(b);

            if ($b.hasClass('collision')) {
              var curData = $b.data();
              var heightSplit = curData.heightSplit < values.length ? values.length : curData.heightSplit;
              var heightSplitOrder = curData.heightSplitOrder < i + 1 ? i + 1 : heightSplitOrder;

              $b.data('heightSplit', heightSplit);
              $b.data('heightSplitOrder', heightSplitOrder);
            }
            else {
              $b.addClass('collision');
              $b.data('heightSplit', values.length);
              $b.data('heightSplitOrder', i + 1);
            }

            gridy.updateBlock(b);
          }
        }
      }

      return false;
    };

    var buildGridMatrix = function ($grid) {

      var gridData = $grid.data();

      var cols = gridData.cols;
      var rows = gridData.rows;

      var matrix = new Array(cols);
      for (var i = 0; i < cols; i++) {
        matrix[i] = new Array(rows);
      }

      $grid.find('li:not(.ghost)').each(function () {
        var block = this;
        var $block = $(block);

        // ignore dragging block
        if ($block.hasClass('dragging')) {
          return;
        }

        computeBlockWithMatrix(matrix, block, function (value) {
          if (!value) {
            return [block];
          }
          value.push(block);
          return value;
        });
      });

      return matrix;
    };

    var computeBlockWithMatrix = function (matrix, block, func) {
      var $block = $(block);
      var blockData = $block.data();

      var col = typeof blockData.col !== 'undefined' ? blockData.col : 1;
      var row = typeof blockData.row !== 'undefined' ? blockData.row : 1;
      var colSpan = typeof blockData.colSpan !== 'undefined' ? blockData.colSpan : 1;
      var rowSpan = typeof blockData.rowSpan !== 'undefined' ? blockData.rowSpan : 1;

      for (var i = 0; i < colSpan; i++) {
        for (var j = 0; j < rowSpan; j++) {
          var colIdx = (col - 1) + i;
          var rowIdx = (row - 1) + j;

          // check if colIdx and rowIdx are in range of matrix
          if ((colIdx >= 0 && colIdx < matrix.length) && (rowIdx >= 0 && rowIdx < matrix[colIdx].length)) {
            matrix[colIdx][rowIdx] = func(matrix[colIdx][rowIdx], colIdx, rowIdx);
          }
        }
      }
    };

    return this;

  }).call({});

  var jQueryDraggable = (function ($) {

    function Draggable(gridy, element) {
      this.gridy = gridy;

      this.$element = $(element);

      this.draggingClass = 'dragging';
      this.ghostClass = 'ghost';

      init.call(this);
    }

    var init = function () {
      this.$element.on('mousedown', handleMouseDown.bind(this));
      this.$element.on('mousemove', handleMouseMove.bind(this));
      $(window).on('mousemove', handleMouseMove.bind(this));
      this.$element.on('mouseup', handleMouseUp.bind(this));
      $(window).on('mouseup', handleMouseUp.bind(this));
    };

    var handleAbort = function (e) {

      // handle ESC key
      if (e.keyCode === 27) {
        console.log('log');

        if (this.$element.hasClass(this.draggingClass)) {
          e.preventDefault();
          e.stopImmediatePropagation();

          // clear abort handler
          window.removeEventListener('keydown', handleAbort, true);

          this.$element.removeClass(this.draggingClass);
          delete this.position;

          var gridy = this.gridy;
          var data = this.$element.data();
          var col = data.col;
          var row = data.row;

          // set old location of block
          this.$element.css({
            left: (col - 1) * gridy.block.width,
            top: (row - 1) * gridy.block.height
          });

          // remove ghost
          removeGhost.call(this);
        }
      }
    };

    var handleMouseDown = function (e) {
      e.preventDefault();

      // only start drag when left mouse button
      if (e.button !== 0) {
        return;
      }

      // console.log('mouse down %o', e);

      var data = this.$element.data();
      if (data.col < 1 || data.row < 1) {
        console.warn('not draggable');
        return;
      }

      // abort drag and drop on ESC
      window.addEventListener('keydown', handleAbort.bind(this), true);

      this.position = this.$element.position();
      this.dragStart = {
        x: e.clientX,
        y: e.clientY
      };
      this.$element.addClass(this.draggingClass);

      this.$ghost = this.$element.clone();
      this.$ghost.addClass(this.ghostClass);
      this.$element.parent().append(this.$ghost);
    };

    /**
     * Handles mouse move events.
     */
    var handleMouseMove = function (e) {

      // only perform if element is dragged
      if (this.$element.hasClass(this.draggingClass)) {
        // console.log('mouse move %o, %o', e, this.position);
        e.preventDefault();
        e.stopImmediatePropagation();

        var gridy = this.gridy;
        var diffX = e.clientX - this.dragStart.x;
        var diffY = e.clientY - this.dragStart.y;

        // set new location when dragged
        this.$element.css({
          left: this.position.left + diffX,
          top: this.position.top + diffY
        });

        var bounds = getBounds.call(this, this.$element, this.$element.parent());
        var col = Math.floor((bounds.x + gridy.block.width / 2) / gridy.block.width) + 1;
        var row = Math.floor((bounds.y + gridy.block.height / 2) / gridy.block.height) + 1;

        // keep track of old ghost data to revert if a collision is detected
        var oldGhostData = this.$ghost.data();
        var oldCol = oldGhostData.col;
        var oldRow = oldGhostData.row;
        // var oldSplitHeight = oldGhostData.splitHeight;
        // var oldSplitHeightOrder = oldGhostData.splitHeightOrder;

        // temporarily set current ghost col/row to perform collision detection
        this.$ghost.data('col', col);
        this.$ghost.data('row', row);
        // this.$ghost.data('splitHeight', oldSplitHeight);
        // this.$ghost.data('splitHeightOrder', oldSplitHeightOrder);

        // var collides = Collision.collides(this.$ghost, gridy.$grid);
        var collides = Collision.collidesWith(gridy, this.$ghost, gridy.$grid);
        if (collides) {
          // revert to old ghost col/row if collision was detected
          this.$ghost.data('col', oldCol);
          this.$ghost.data('row', oldRow);
          return;
        }

        // update ghost block
        gridy.updateBlock(this.$ghost.get(0));
      }
    };

    var handleMouseUp = function (e) {
      var that = this;
      var gridy = this.gridy;

      if (this.$element.hasClass(this.draggingClass)) {
        // console.log('mouse up %o', e);
        e.preventDefault();
        e.stopImmediatePropagation();

        // clear abort handler
        window.removeEventListener('keydown', handleAbort, true);

        this.$element.removeClass(this.draggingClass);
        delete this.position;

        var blockData = this.$element.data();
        var ghostData = this.$ghost.data();

        var oldRow;
        var newRow;
        gridy.$rows.find('li').each(function () {
          var data = $(this).data();
          var rowVal = data.row;
          // console.log('data %o, row val %o, val %o', data, rowVal, blockData.row);
          if (rowVal === blockData.row) {
            oldRow = this;
          }

          if (rowVal === ghostData.row) {
            newRow = this;
          }
        });

        var oldColumn;
        var newColumn;
        gridy.$columns.find('li').each(function () {
          var data = $(this).data();
          var colVal = data.col;
          if (colVal === blockData.col) {
            oldColumn = this;
          }

          if (colVal === ghostData.col) {
            newColumn = this;
          }
        });

        // check if column changed and then notify registered event
        if (
          blockData.col !== ghostData.col ||
          blockData.row !== ghostData.row
        ) {
          // // check if change event was registered
          // if (gridy.events && typeof gridy.events.change === 'function') {

          var event = $.Event('change');
          $.extend(event, {
            gridy: gridy,
            oldRow: oldRow,
            row: newRow,
            oldColumn: oldColumn,
            column: newColumn,
            newData: ghostData,
            oldData: blockData,
            allow: function () {
              that.$element.data(ghostData);

              // update block position
              gridy.updateBlock(that.$element.get(0));
            }
          });
          this.$element.trigger(event);
          // }
          // else {
          //   that.$element.data(ghostData.data());

          //   // update block position
          //   gridy.updateBlock(that.$element.get(0));
          // }
        }

        console.log('ghostData %o', ghostData);

        // update block position
        that.gridy.updateBlock(that.$element.get(0));

        // remove ghost
        removeGhost.call(this);
      }
    };

    var getBounds = function ($element, $container) {

      var elementBounds = {
        left: $element.position().left,
        top: $element.position().top,
        width: $element.outerWidth(),
        height: $element.outerHeight()
      }

      var containerBounds = {
        left: $container.position().left,
        top: $container.position().top,
        width: $container.innerWidth(),
        height: $container.innerHeight()
      }

      // console.log('bounds1=%o, bounds2=%o', elementBounds, containerBounds);

      var x1 = elementBounds.left;
      var x2 = containerBounds.width - (elementBounds.left + elementBounds.width);
      var y1 = elementBounds.top;
      var y2 = containerBounds.height - (elementBounds.top + elementBounds.height);

      // console.log('x1=%o, x2=%o, y1=%o, Y2=%o', x1, x2, y1, y2);

      var x = x1;
      if (x1 < 0) {
        x = 0;
      }
      else if (x2 < 0) {
        x = containerBounds.width - elementBounds.width;
      }

      var y = y1;
      if (y1 < 0) {
        y = 0;
      }
      else if (y2 < 0) {
        y = containerBounds.height - elementBounds.height;
      }

      return {
        x: x,
        y: y
      }
    };

    /**
     * Remove ghost from parent and delete reference.
     */
    var removeGhost = function () {
      this.$ghost.remove();
      delete this.$ghost;
    };

    return Draggable;
  }).call({}, jQuery);

  var Draggable = jQueryDraggable;

  /**
   * 
   */
  var Gridy = (function ($) {

    function Gridy(container, options) {
      this.$container = $(container);

      this.block = {
        width: options.blockWidth,
        height: options.blockHeight
      };
      this.gutter = options.gutter;
      this.events = options.events || {};
      this.columns = options.columns;
      this.rows = options.rows;
      this.renderer = options.renderer || {};

      // get rows
      this.$rows = this.$container.find('ul.rows');
      if (!this.$rows.length) {
        createRows.call(this);
      }

      // get rows
      this.$columns = this.$container.find('ul.columns');
      if (!this.$columns.length) {
        createColumns.call(this);
      }

      // get grid
      this.$grid = this.$container.find('ul.grid');

      init.call(this);
    };

    Gridy.prototype.update = function () {
      init.call(this);
    };

    /**
     * Update block position using its data attributes (data-row, data-col).
     */
    Gridy.prototype.updateBlock = function (block, collisionCheck) {
      var gridy = this;
      var $block = $(block);

      // init block if block dclass missing -> adds class + draggable
      if (!$block.hasClass('block')) {
        initBlock.call(this, block);
      }

      this.updateBlockPosition(block);
      this.updateBlockSize(block);

      // collision check
      if (collisionCheck) {
        // Collision.collidesWith(gridy, $block, gridy.$grid);
      }
    };

    Gridy.prototype.updateBlockPosition = function (block) {
      var gridy = this;
      var $block = $(block);

      // get data attributes (data-col, data-row, data-row-span, data-col-span)
      var data = $block.data();
      var col = typeof data.col !== 'undefined' ? data.col : 1;
      var row = typeof data.row !== 'undefined' ? data.row : 1;
      var colSpan = typeof data.colSpan !== 'undefined' ? data.colSpan : 1;
      var rowSpan = typeof data.rowSpan !== 'undefined' ? data.rowSpan : 1;

      var blockWidth = gridy.block.width * colSpan;
      var blockHeight = gridy.block.height * rowSpan;

      var heightSplit = typeof data.heightSplit != 'undefined' ? data.heightSplit : 1;
      var heightSplitOrder = typeof data.heightSplitOrder != 'undefined' ? data.heightSplitOrder : 1;

      var widthSplit = typeof data.widthSplit != 'undefined' ? data.widthSplit : 1;
      var widthSplitOrder = typeof data.widthSplitOrder != 'undefined' ? data.widthSplitOrder : 1;

      var left = (col - 1) * gridy.block.width;
      var top = (row - 1) * gridy.block.height;

      if (gridy.gutter) {
        left += (col) * gridy.gutter;
        top += (row) * gridy.gutter;
      }

      left += (blockWidth / widthSplit) * (widthSplitOrder - 1);
      top += (blockHeight / heightSplit) * (heightSplitOrder - 1);

      $block.css({
        left: left + 'px',
        top: top + 'px'
      });
    };

    Gridy.prototype.updateBlockSize = function (block) {
      var gridy = this;
      var $block = $(block);

      // get data attributes (data-col, data-row, data-row-span, data-col-span)
      var data = $block.data();
      var colSpan = typeof data.colSpan !== 'undefined' ? data.colSpan : 1;
      var rowSpan = typeof data.rowSpan !== 'undefined' ? data.rowSpan : 1;

      var widthSplit = typeof data.widthSplit != 'undefined' ? data.widthSplit : 1;
      var heightSplit = typeof data.heightSplit != 'undefined' ? data.heightSplit : 1;

      var width = gridy.block.width * colSpan;
      var height = gridy.block.height * rowSpan;

      if (gridy.gutter) {
        if (colSpan > 1) {
          width += (colSpan - 1) * gridy.gutter;
        }

        if (rowSpan > 1) {
          height += (rowSpan - 1) * gridy.gutter;
        }
      }

      width = width / widthSplit;
      height = height / heightSplit;

      // console.log('width=%o, height=%o, heightSplit=%o, data=%o', width, height, heightSplit, data);

      $block.css({
        width: width + 'px',
        height: height + 'px'
      });
    };

    /**
     * Initialize Gridy.
     */
    var init = function () {
      var gridy = this;

      var gridData = this.$grid.data();

      var cols = gridData.cols;
      if (!cols) {
        cols = this.$columns.find('li').length;
        this.$grid.data('cols', cols);
      }

      var rows = gridData.rows;
      if (!rows) {
        rows = this.$rows.find('li').length;
        this.$grid.data('rows', rows);
      }

      var gridWidth = cols * gridy.block.width;
      var gridHeight = rows * gridy.block.height;

      if (gridy.gutter) {
        gridWidth += (cols + 1) * gridy.gutter;
        gridHeight += (rows + 1) * gridy.gutter;
      }

      // initialize columns
      this.$columns.css({
        'width': gridWidth + 'px',
      });

      this.$columns.find('li').each(function (index) {
        var column = this;
        initColumn.call(gridy, column, index);
      });

      // initialize rows
      this.$rows.css({
        'height': gridHeight + 'px'
      });

      this.$rows.find('li').each(function (index) {
        var row = this;
        initRow.call(gridy, row, index);
      });

      // initialize grid
      this.$grid.css({
        'width': gridWidth + 'px',
        'height': gridHeight + 'px'
      });

      this.$grid.find('li').each(function () {
        var block = this;
        initBlock.call(gridy, block);
      });

      // adjust column offset left after columns initialize
      this.$columns.css({
        'left': this.$rows.width() + 'px'
      });

      this.$container.css({
        'height': this.$grid.height() + this.$columns.height() + 'px'
      });

      if (this.$container.hasClass('test')) {
        this.$container.addClass('test');
        this.$container.dblclick(function (e) {
          console.log(e);
        });
      }
    };

    /**
     * Initialize rows.
     */
    var createRows = function () {
      var gridy = this;

      if (gridy.rows) {

        // create rows container
        this.$rows = $('<ul />', {
          'class': 'rows'
        });

        $.each(gridy.rows, function (index, value) {
          var $row = $('<li></li>', {
            'class': 'row',
            'data-row': index + 1
          });

          // set row value
          $row.data('value', value);

          if (typeof gridy.renderer.row === 'function') {
            var content = gridy.renderer.row.call(gridy, value);
            $row.html(content);
          }

          gridy.$rows.append($row);
        });

        gridy.$container.prepend(this.$rows);
      }
    };

    /**
     * Initialize columns.
     */
    var createColumns = function () {
      var gridy = this;

      if (gridy.columns) {

        // create columns container
        this.$columns = $('<ul />', {
          'class': 'columns'
        });

        $.each(gridy.columns, function (index, value) {
          var $column = $('<li></li>', {
            'class': 'column',
            'data-col': index + 1
          });

          // set column value
          $column.data('value', value);

          if (typeof gridy.renderer.column === 'function') {
            var content = gridy.renderer.column.call(gridy, value);
            $column.html(content);
          }

          gridy.$columns.append($column);
        });

        gridy.$container.prepend(this.$columns);
      }
    };

    /**
     * Initialize column.
     */
    var initColumn = function (column, index) {
      var gridy = this;
      $(column).css({
        width: gridy.block.width
      });

      // set column data
      $(column).attr({
        'data-col': index + 1
      });

      // set column value
      $(column).data('value', Template.currentData());
    };

    /**
     * Initialize row.
     */
    var initRow = function (row, index) {
      var gridy = this;
      $(row).css({
        height: gridy.block.height
      });

      // set row data
      $(row).attr({
        'data-row': index + 1
      });

      // set row value
      $(row).data('value', Template.currentData());
    };

    /**
     * Initialize block.
     */
    var initBlock = function (block) {
      var gridy = this;
      var $block = $(block);

      // init draggable for block if not yet initialized
      if (!$block.data('draggable')) {
        var draggable = new Draggable(gridy, block);
        $block.data('draggable', draggable);
      }

      $block.addClass('block');

      gridy.updateBlock(block);
    };

    return Gridy;

  }).call({}, jQuery);

  /**
   * jQuery wrapper for Gridy
   */
  ; (function ($) {

    //jQuery adapter
    $.fn.gridy = function (options) {

      options = $.extend({
        blockWidth: 40,
        blockHeight: 40,
        gutter: 0
      }, options);

      return this.each(function () {
        var gridy = new Gridy(this, options);
        $(this).data('gridy', gridy);
      });
    };

  } (jQuery));
}