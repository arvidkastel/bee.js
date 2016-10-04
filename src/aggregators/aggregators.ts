export interface Aggregator<InitType, ValueType, OutputType> {
    init():InitType;
    reduce(reduced:InitType, value:ValueType):InitType;
    transform(value:InitType): OutputType;
}

export const sum : Aggregator<number, number,number> = {
    init():number {
        return 0;
    },
    reduce(reduced:number, value:number):number {
        return reduced + value;
    },
    transform(value:number) {
        return value;
    }
}


export const count : Aggregator<number, any, number> = {
    init():number {
        return 0;
    },
    reduce(reduced:number, value:number):number {
        return reduced++;
    },
    transform(value:number) {
        return value;
    }
}


interface Counter {sum:number; count:number};

export const avg : Aggregator<Counter, number, number> = {
    init():Counter {
        return {
            sum:0, 
            count:0
        }
    },
    reduce(reduced:Counter, value:number):Counter {
        reduced.count++;
        reduced.sum += value;
        return reduced;
    },
    transform(value:Counter) {
        return value.sum / value.count;
    }
}