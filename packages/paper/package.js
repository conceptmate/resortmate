/* global Package */
Package.describe({
  name: 'concept:paper',
  version: '0.5.0',
  // Brief, one-line summary of the package.
  summary: 'A library to create a paper-like UI.',
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
    'less',
    'concept:common'
  ]);
  
  // api.addFiles([
  //   'lib/heir.js'
  // ], ['client']);
  
  api.addFiles([
    'client/utils/blaze-helpers.js',
    'client/page.class.js',
    'client/page-renderer.class.js',
    'client/elements/base-element.class.js',
    'client/elements/custom-template.class.js',
    'client/elements/textbox.class.js',
    'client/elements/table.class.js'
  ], ['client']);
  
  api.addFiles([
    'client/templates/textbox.html',
    'client/templates/textbox.js',
    'client/templates/textbox.less'
  ], ['client']);
  
  api.export('Concept', ['client']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('concept:page');
  api.addFiles('tests/page-tests.js');
});
