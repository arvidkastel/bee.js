import {Scalar} from "../data/Scalar";
import {_} from "lodash";

export type Sorter = (value1:any, value2) => number; 
export type SorterSpec = Sorter | {[colName: string] : ("asc" | "desc") }
