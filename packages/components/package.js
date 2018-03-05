/* global Package */
Package.describe({
  name: 'concept:components',
  version: '0.1.0',
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
    'accounts-base',
    'templating',
    'less'
  ], ['client']);
  
  // api.use('numtel:webcomponent@0.0.6');
  
  api.addFiles([
    'client/profile/profile-thumb.less',
    'client/profile/profile-thumb.html',
    'client/profile/profile-thumb.js',
    'client/components.js',
  ], ['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('concept:components');
  api.addFiles('tests/components-tests.js');
});
