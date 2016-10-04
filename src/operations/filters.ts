import {Scalar} from "../data/Scalar";
import {_} from "lodash";

export type Filter = (value:any) => boolean; 
export type FilterSpec = Filter | {[colName: string] : Scalar}

export function resolveFilterSpec(spec:Filter) {
    if (_.isFunction(spec)) {
        return spec;
    } else {
        return _.matches(spec) 
    }
}
