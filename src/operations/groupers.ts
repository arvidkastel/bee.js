import {Scalar} from "../data/Scalar";
import {DimensionTensor} from "../data/DimensionTensor";
import {Map} from "es6-map";

type GrouperArg = IGrouper | string | string[];

export interface IGrouper { 
    prepare(tensor: DimensionTensor):void;
    classify(val:Scalar):number[];
    dimensions():DimensionTensor[];
}

export function resolveGrouperArg(GrouperArg):IGrouper {
    if (_.isString(GrouperArg)) {
        return new ColumnGrouper([GrouperArg]);
    }
    if (_.isArray(GrouperArg)) {
        return new ColumnGrouper(GrouperArg);
    }
    return GrouperArg;
}

export class ColumnGrouper implements IGrouper {
    private _groups : Map<Scalar, Array<Scalar>>[];

    constructor(private _columnNames:string[]) {
        this._groups = this._columnNames.map(
            ()=>{return {}}
        );
    } 

    prepare(dimension:DimensionTensor) {
        
    }
    
    classify(val: Scalar):number[] {
        let indices = this._columnNames.map(
            (name, ix) => {
                let arr = this._groups[ix].get(name); 
                if(arr) {
                    this._groups[ix].get(name).push(val);
                } else {
                    this._groups[ix].set(name, []);
                }
                return this._groups[ix].get(name).length;
            }
        )
        return indices;
    }
    dimensions():DimensionTensor[] {

    }
}
