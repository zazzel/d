'use strict';

var d = require('../d')

  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

module.exports = function (t, a) {
	var Foo = function () {}, i = 1, o, o2, desc;
	Object.defineProperties(Foo.prototype, t({
		bar: d(function () { return ++i; }),
		bar2: d(function () { return this.bar + 23; }),
		bar3: d(function () { return this.bar2 + 34; }, { desc: 'ew' }),
		bar4: d(function () { return this.bar3 + 12; }, { cacheName: '_bar4_' }),
		bar5: d(function () { return this.bar4 + 3; },
			{ cacheName: '_bar5_', desc: 'e' })
	}));

	o = new Foo();
	a.deep([o.bar, o.bar2, o.bar3, o.bar4, o.bar5], [2, 25, 59, 71, 74],
		"Values");

	a.deep(getOwnPropertyDescriptor(o, 'bar3'), { configurable: false,
		enumerable: true, writable: true, value: 59 }, "Desc");
	a(o.hasOwnProperty('bar4'), false, "Cache not exposed");
	desc = getOwnPropertyDescriptor(o, 'bar5');
	a.deep(desc, { configurable: false,
		enumerable: true, get: desc.get, set: desc.set }, "Cache & Desc: desc");

	o2 = Object.create(o);
	o2.bar = 30;
	o2.bar3 = 100;

	a.deep([o2.bar, o2.bar2, o2.bar3, o2.bar4, o2.bar5], [30, 25, 100, 112, 115],
		"Extension Values");

};
