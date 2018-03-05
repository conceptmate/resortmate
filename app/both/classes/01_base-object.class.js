/* global Concept */
/* global BaseObject */
var ns = Concept.Namespace.create('ResortMate');

BaseObject = class BaseObject {
  
  constructor(baseObject) {
    this.baseObject = baseObject;
    
    Concept.Utils.ObjectUtils.proxyProperties(this, this.baseObject);
  }
}

ns.addClass('BaseObject', BaseObject);