export function boolArrayToNumber(bs: boolean[]): number {
    let sum = 0;
    bs.forEach(
        (b, ix) => { if (b) { sum += (1 << ix) } }
    )
    return sum;
}

export function assert(expr, string) {
    if (!expr) {
        console.log(string || "FEEEEl ");
    }
}

export function range(start:number, end?:number):number[] {
    if(end){
        let a = new Array(end-start);
        for(var i = 0; i < end - start; i++) {
            a[i] = i;
        }
        return a;
    } else {
        return range(0, start);
    }

}

export class ReturnValue<T> {
    private _value:T;
    get() {
        return this._value
    }
    set(value:T) {
        this._value = value;
    }
}
