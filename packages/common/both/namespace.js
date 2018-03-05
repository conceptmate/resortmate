/* global global */
/* global jQuery */

;
Concept = typeof Concept !== 'undefined' ? Concept : {};
Concept.Namespace = (function (global) {

  'use strict';

  /**
   * This bind polyfill function is required for 'wkhtmltopdf' or 'phantomjs rasterize.js'
   * to render webpages to pdf.
   */
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () { },
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
            ? this
            : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments)));
        };

      if (this.prototype) {
        // native functions don't have a prototype
        fNOP.prototype = this.prototype;
      }
      fBound.prototype = new fNOP();

      return fBound;
    };
  }

  this.addClass = function (namespace, module) {

    var names = namespace.split('.');
    var length = names.length;

    var rootNamespace = this;
    var subNamespace = rootNamespace;

    names.forEach(function (name, index) {
      if (index == length - 1) {
        subNamespace[name] = module;
      }

      if (!subNamespace[name]) {
        subNamespace[name] = {};
      }

      subNamespace = subNamespace[name];
    });
  };
  
  /**
   * Convenient function to add a class to a namespace. This function will be added to
   * every namespace that is created through Concept.Namespace.create('My.Namespace');
   */
  var _addClass = function (className, classDef) {
    // var classDefString = classDef.toString();
    // var matches = classDefString.match(/function\s([a-zA-Z][a-zA-Z0-9]*)/);
    
    // // found class name
    // var className = matches[1];

    if (this[className]) {
      throw new Error('class ' + className + ' already exists in namespace ' + this._namespace);
    }
    
    // console.log('adding class to %s.%s', this._namespace, className);
    
    this[className] = classDef;
  };
  
  /**
   * Convenient function to add a module to a namespace. This function will be added to
   * every namespace that is created through Concept.Namespace.create('My.Namespace');
   */
  var _addModule = function (moduleName, moduleDeps, moduleDef) {

    // console.log('adding module to %s.%s', this._namespace, moduleName);

    if (this[moduleName]) {
      throw new Error('module ' + moduleName + ' already exists in namespace ' + this._namespace);
    }
    
    // allow deps as optional parameter
    if (!moduleDef && typeof moduleDeps == 'function') {
      moduleDef = moduleDeps;
      moduleDeps = [];
    }

    var DepsInjectionWrapper = 'function () {' +
    '  var value = moduleDef.apply({}, moduleDeps);' +
    '  ' +
    '  if (!value) {' +
    '    throw new Error("module " + namespace + "." + moduleName + " requires a return value (e.g., return this)");' +
    '  }' +
    '  ' +
    '  return value;' +
    '};';
    var expression = 'var ' + moduleName + ' = ' + DepsInjectionWrapper + '; return ' + moduleName + ';';
    var Class = new Function('moduleName', 'namespace', 'moduleDef', 'moduleDeps', expression)(moduleName, this._namespace, moduleDef, moduleDeps);

    this[moduleName] = Class();
  };
  
  // /**
  //  * Adds a functions to the namespace object.
  //  */
  // var _addFunctions = function (functionsName, functionsDeps, functionsDef) {

  //   console.log('adding functions to %s.%s', this._namespace, functionsName);
   
  //   // allow deps as optional parameter
  //   if (!functionsDef && typeof functionsDeps == 'function') {
  //     functionsDef = functionsDeps;
  //     functionsDeps = [];
  //   }

  //   var newFunctions = functionsDef.apply({}, functionsDeps);

  //   this[functionsName] = this[functionsName] || {};
  //   $.extend(true, this[functionsName], newFunctions);
  // };
  
  /**
   * Returns the namespace object or creates a new namespace if it does not yet exist. For
   * instance <code>var namespace = Concept.Namespace.create('My.Namespace');</code> returns a
   * namespace to which class can be added by
   * <code>namespace.addModule('MyModule', [jQuery], function($) { });</code>. The MyModule
   * class will then be accessible by Concept.My.Namespace.MyModule.
   * 
   * Namespacing is important for function scoping and was derived from an idea presented
   * at: http://elegantcode.com/2011/01/26/basic-javascript-part-8-namespaces/
   * 
   * @param {String} ns A string representing the namespace, e.g., 'My.Namesace'.
   */
  this.create = function (ns) {

    // console.log('creating namespace %s', ns);

    var names = ns.split('.');

    if (names.length < 1) {
      throw new Error('no namespace defined');
    }

    var rootName = names[0];
    var rootNamespace = rootName === 'Concept' ? Concept : global[rootName];
    
    // create root namespace if not exists
    if (!rootNamespace) {
      rootNamespace = global[rootName] = {};
    }

    var subNamespace = rootNamespace;
    var namespaceConcat = rootName;

    subNamespace.addClass = _addClass.bind(subNamespace);
    subNamespace.addModule = _addModule.bind(subNamespace);
    // subNamespace.addFunctions = _addFunctions.bind(subNamespace);
    subNamespace._namespace = namespaceConcat;

    var length = names.length;
    for (var i = 1; i < length; i++) {
      var name = names[i];
      namespaceConcat += '.' + name;
      
      // use existing sub namespace if exist, otherwise define empty sub namespace
      if (!subNamespace[name]) {
        var newSubNamespace = {};
        newSubNamespace.addClass = _addClass.bind(newSubNamespace);
        newSubNamespace.addModule = _addModule.bind(newSubNamespace);
        // newSubNamespace.addFunctions = _addFunctions.bind(newSubNamespace);
        newSubNamespace._namespace = namespaceConcat;
        subNamespace[name] = newSubNamespace;
      }

      subNamespace = subNamespace[name];
    }

    subNamespace.addClass = _addClass.bind(subNamespace);
    subNamespace.addModule = _addModule.bind(subNamespace);
    // subNamespace.addFunctions = _addFunctions.bind(subNamespace);
    subNamespace._namespace = ns;

    return subNamespace;
  }

  return this;

}).call({}, typeof global !== 'undefined' ? global : window);