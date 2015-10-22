/*
 * Point Spec
 */

var Point = require('../src/point');
var Path = require('../src/path');
var Mask = require('../src/mask');

describe("Point handler", function() {
	it("creates point from array of three elements", function() {
		var xyz = [1, 2, 3];
		var point = new Point(xyz);
		expect(point.x).toBe(xyz[0]);
		expect(point.y).toBe(xyz[1]);
		expect(point.z).toBe(xyz[2]);
	});
	it("creates point from one number", function() {
		var point = new Point(4);
		expect(point.x).toBe(4);
		expect(point.y).toBe(0);
		expect(point.z).toBe(5);
	});
	it("creates point from two numbers", function() {
		var point = new Point(5, 6);
		expect(point.x).toBe(5);
		expect(point.y).toBe(6);
		expect(point.z).toBe(5);
	});
	it("creates point from three numbers", function() {
		var point = new Point(7, 8, 9);
		expect(point.x).toBe(7);
		expect(point.y).toBe(8);
		expect(point.z).toBe(9);
	});
});
