Template.registerHelper('Concept_Paper_joinClasses', function(classes) {
  if (!classes) {
    return null;
  }
  return classes.join(' ');
});

Template.registerHelper('Concept_Paper_maintainLinebreaks', function(value) {
  if (value) {
    let fixedValue = value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    return new Spacebars.SafeString(fixedValue);
  }
  return null;
});