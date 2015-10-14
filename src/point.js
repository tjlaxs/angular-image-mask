(function() {
'use strict';

module.exports = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	return this;
};

module.exports.prototype.moveTo = function(x, y) {
	this.x = x;
	this.y = y;
	return this;
};

})();
