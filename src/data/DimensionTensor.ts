import {Scalar} from "./Scalar";
import {MappableTensor} from "./DataSet";
import {ITensor} from "./ITensor";
import {_} from "lodash";
import {range, ReturnValue} from "../lib/utils";
import {Filter, resolveFilterSpec} from "../operations/filters";
import {Sorter} from "../operations/sorters";
import {MapperSpec, Mapper, resolveMapper} from "../operations/mappers";

export class DimensionTensor implements ITensor {
    constructor(
        private _data:Array<Scalar>, 
        private _name:string, 
        private _label?:string, 
        private _indexMap?:number[]) 
    {
    
    }

    get(...indices:number[]):Scalar {
        return this._data[indices[0]];
    }

    name(): string{
        return this._name;
    }
    size():number[] {
        return [this._data.length];
    }

    label(): string {
        return this._label || this._name;
    } 

    filter(f: Filter,indices?:ReturnValue<number[]>):DimensionTensor {
        let filter = resolveFilterSpec(f);
        let filteredIndices = [];
        let newArray = [];
        this._data.forEach(
            (d,ix) => {
                if(filter(d)) {
                    newArray.push(d);
                    filteredIndices.push(ix);
                }
            }
        );
        if(indices) {
            indices.set(filteredIndices)
        }
        return new DimensionTensor(newArray, this._name, this._label);
    }

    sort(sorter: Sorter, indices?:ReturnValue<number[]>):DimensionTensor {
        let mapped = this._data.map(
            (row,ix) => {return  {row, ix}} 
        );
        let clone = mapped.sort(
            (row, row2) => sorter(row.row, row2.row)
        );
        indices.set(<number[]><any>_.map(clone, 'ix'));
        
        return new DimensionTensor(_.map(clone, 'row'), this._name, this._label);
    }

    forEach(fn:(value:Scalar)=>any) {
        this._data.forEach(fn);
    }

    limit(num: number):DimensionTensor {
        return new DimensionTensor(this._data.slice(num), this._name, this._label);
    }

    map(spec:MapperSpec) {
        let mapper = resolveMapper(spec);
        let dt = new DimensionTensor(this._data, this._name, this._label);
        let self = this;
        dt.get = function(...indices:number[]):Scalar {
            return mapper(
                self.get(indices), 
                indices
            );
        }
        return dt;
    }

    group(grouper: Grouper){
        
    }
    
    groupAndAggregate(grouper: Grouper, aggregator:Aggregator){

    }
}