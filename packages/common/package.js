Package.describe({
  name: 'concept:common',
  version: '0.5.0',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'templating',
    'less'
  ]);
  
  api.addFiles([
    'both/namespace.js',
    'both/object-utils.js',
    'both/moment-utils.js'
  ], ['client', 'server']);
  
  // COMPONENT 'text'
  api.addFiles([
    'client/components/text.html',
    'client/components/text.js'
  ], ['client']);
  
  api.export('momentDay');
  api.export('Concept');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('concept:common');
  api.addFiles('tests/common-tests.js');
});
