(function() {
'use strict';

var Point = require('./point.js');

module.exports = function(name, p1, p2) {
	this.name = name || "Line";
	this.p = [];
	this.p[0] = p1 || new Point();
	this.p[1] = p2 || new Point();
	return this;
};

})();
