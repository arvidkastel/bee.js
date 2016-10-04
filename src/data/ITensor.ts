import {Scalar} from "./Scalar";
export interface ITensor {
    get(...indices: number[]): Scalar;
    map(mapper);
    size(): number[];
    aggregate(aggregator: Aggregator){

    }
}
