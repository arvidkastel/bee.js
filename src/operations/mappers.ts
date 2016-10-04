import {Scalar} from "../data/Scalar";
import {_} from "lodash";

export type Mapper = (val:Scalar, ...indices:number[])=>Scalar;
export type MapperSpec = Mapper | string;

export function resolveMapper(spec:MapperSpec):Mapper {
    if(_.isFunction(spec)) {
        return spec as any as Mapper;
    } else {
        return (value:Scalar)=>(value as Object)[spec as string] as any as Mapper;
    }
}