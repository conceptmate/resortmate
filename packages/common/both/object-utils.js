var ns = Concept.Namespace.create('Concept.Utils');

ns.addModule('ObjectUtils', function() {
  
  this.proxyProperties = function (proxy, obj) {
		var props = [];
		var proxies = {};
		
		// create proxy functions
		for (var prop in obj) {
			props.push(prop);
		}

		_.each(props, function (prop) {
			proxies[prop] = {
				get: function () {
					return obj[prop];
				},
				set: function (value) {
					obj[prop] = value;
				}
			}
		});

		Object.defineProperties(proxy, proxies);
	};
  
  return this;
});