define(["require", "exports", "./lodash.js"], function (require, exports, lodash_js_1) {
    function registerDep(fn, defaultValue) {
        var ix = theDep.getId(fn);
        return function () {
            theDep.registerDepCalled(ix);
            if (theDep.isSimulation) {
                theDep.registerDepReady(ix);
                return defaultValue;
            }
            if (theData.isDirty(ix)) {
                var val = fn.apply(this, arguments);
                theData.set(ix, val);
            }
            theDep.registerDepReady(ix);
            return val;
        };
    }
    var DataStore = (function () {
        function DataStore() {
            this._data = [];
            this._isDirty = [];
        }
        DataStore.prototype.get = function (ix) {
            return this._data[ix];
        };
        DataStore.prototype.isDirty = function (ix) {
            return this._isDirty[ix];
        };
        DataStore.prototype.setIsDirty = function (ix) {
            this._isDirty[ix] = true;
        };
        DataStore.prototype.set = function (ix, val) {
            this._data = val;
            this._isDirty[ix] = false;
        };
        return DataStore;
    })();
    var Script = (function () {
        function Script(_run) {
            this._run = _run;
        }
        return Script;
    })();
    var Dep = (function () {
        function Dep() {
            this._deps = [];
        }
        Dep.prototype.collectCalls = function () {
            this._calls = [];
        };
        Dep.prototype.registerDepCalled = function (ix) {
            this._calls.push({ depIx: ix, type: "called" });
        };
        Dep.prototype.registerDepReady = function (ix) {
            this._calls.push({ depIx: ix, type: "ready" });
        };
        Dep.prototype.endCollectingCalls = function () {
            return this._calls;
        };
        Dep.prototype.getId = function (dep) {
            var ix = this._deps.lastIndexOf(dep);
            if (ix !== -1) {
                return ix;
            }
            this._deps.push(dep);
            return this._deps.length;
        };
        Dep.prototype.getDependencies = function (ix) {
            var start = lodash_js_1._.findIndex(this._calls, { depIx: ix, type: "called" });
            var end = lodash_js_1._.findIndex(this._calls, { depIx: ix, type: "ready" });
            var deps = lodash_js_1._.uniq(lodash_js_1._.map(this._calls.slice(start, end), 'depIx'));
            return deps;
        };
        return Dep;
    })();
    var theDep = new Dep();
    var theData = new DataStore();
    var fn1 = registerDep(function () {
        return 1;
    });
    var fn2 = registerDep(function () {
        return fn1() + 1;
    });
    var fn3 = registerDep(function () {
        return fn1() + fn2();
    });
    theDep.collectCalls();
    console.log(fn3());
    console.log(theDep.endCollectingCalls());
    console.log(theDep.getDependencies(2));
});
