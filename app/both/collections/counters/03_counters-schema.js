Schemas = typeof Schemas !== 'undefined' ? Schemas : {};

/**
 *
 */
Schemas.Counters = new SimpleSchema({
  counters: {
    type: Array,
    autoform: {
      label: false
    }
  },
  'counters.$': {
    type: Object,
    autoform: {
      label: false
    }
  },
  'counters.$.name': {
    type: String,
    autoform: {
      readonly: true
    }
  },
  'counters.$.value': {
    type: Number
  }
});