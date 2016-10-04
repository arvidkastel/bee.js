import {_} from "./lodash.js";

function registerDep(fn, defaultValue?) {
    var ix = theDep.getId(fn);
    return function() {
        theDep.registerDepCalled(ix);
        
        if(theDep.isSimulation) {
            theDep.registerDepReady(ix);
            return defaultValue;
        }
        if(theData.isDirty(ix)){
            let val = fn.apply(this, arguments);
            theData.set(ix, val); 
        }
        
        theDep.registerDepReady(ix);
        
        return val;
    }
}

class DataStore {
    private _data:any[] = [];
    private _isDirty:any[] = [];

    get(ix) {
        return this._data[ix];
    }

    isDirty(ix) {
        return  this._isDirty[ix];
    }

    setIsDirty(ix) {
        this._isDirty[ix] = true;
    }

    set(ix, val) {
        this._data = val
        this._isDirty[ix] = false;
    }
}

class Script {
    constructor(private _run) {}

}

class Dep {
    private _deps:Array<any> = [];
    private _calls:Array<{depIx:number, type:string}>;
    public isSimulation;
    
    collectCalls() {
        this._calls = [];
    }
    
    registerDepCalled(ix) {
        this._calls.push({depIx: ix, type:"called"});
    }
    
    registerDepReady(ix) {
        this._calls.push({depIx: ix, type:"ready"});
    }
    
    endCollectingCalls() {
        return this._calls;
    }
    
    getId(dep) {
        var ix = this._deps.lastIndexOf(dep);
        if(ix !== -1) {
            return ix;
        }
        
        this._deps.push(dep);
        
        return this._deps.length;
    }

    getDependencies(ix) {
        let start = _.findIndex(this._calls, {depIx:ix, type:"called"});
        let end = _.findIndex(this._calls, {depIx:ix, type:"ready"});
        let deps =_.uniq(
            _.map(
                this._calls.slice(start, end),
                'depIx'
            )
        );
        return deps;
    }
}

var theDep = new Dep();
var theData = new DataStore();

var fn1 = registerDep(function() {
    return 1;
});

var fn2 = registerDep(function() {
    return fn1() + 1;
})

var fn3 = registerDep(function() {
    return fn1() + fn2();
})


theDep.collectCalls();
console.log(fn3());
console.log(theDep.endCollectingCalls());

console.log(theDep.getDependencies(2));