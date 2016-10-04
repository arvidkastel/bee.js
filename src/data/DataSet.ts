///<reference path="./lodash.d.ts"/>
import "lodash";
import {ITensor} from  "./ITensor";


enum Bee { ALL = -1, NONE = -2 }

type DimSpec = String | number;

type PrimitiveSliceSpec = (Bee | number);
type SliceSpec = (PrimitiveSliceSpec | number[])[];


type Filter = ((d:any)=>boolean | Object);
//class Sorter { }
type Sorter = (s1:any, s2:any) => number;






export abstract class MappableTensor{
    abstract get(indices:number[]):Scalar;
    map(mapper) {
        return new MappingTensorDecorator(this, mapper);
    }
}
class MappingTensorDecorator {
    constructor(private _baseTensor, private _mapper){
    }
    
    get(...indices) {
        return this._mapper(
            this._baseTensor.get(indices),
            indices
        );
    }
}


export class SlicerTensorDecorator implements ITensor{
    constructor(private _baseTensor:ITensor, private _slice:number[]) {

    }
    private _mapIndices(indices:number[]):number[] {
        let nonFixCounter = 0;
        let mappedIndices = this._slice.map(
            (dimSlice) => {
                if(_.isArray(dimSlice)) {
                    return dimSlice[indices[nonFixCounter++]]
                    
                }
                if(dimSlice == Bee.ALL) {
                    return indices[nonFixCounter++]
                }
                
                return dimSlice
            }
        )
        return mappedIndices;
    }
    get(...indices:number[]):Scalar {
        return this._baseTensor.get(
            this._mapIndices(indices)
        );
    }

    size():number[] {
        //todo 
        /*let nonFixedIndices = this._slice.filter(dim => dim == Bee.ALL || _.isArray(dim));
        return nonFixedIndices.map(
            ix=> if 
        )*/
    }

    map(mapper){
        return this._baseTensor.map(
            function(value, indices){
                mapper.call(value, this._mapIndices(indices));
            }
        )
    }
}

class NestedArrayTensor extends MappableTensor implements ITensor {
    constructor(private _data) {
        super();
    }
    private _getFromArray(array, indices) {
        if (indices.length) {
            return this._getFromArray(array[indices[0]], indices.slice(1));
        } else {
            return array;
        }
    }

    get(indices: number[]) {
        return this._getFromArray(this._data, indices);
    }
}

class DataSet {
    constructor(private _tensors: ITensor[]) {

    }
    private _tensor(slice: SliceSpec): ITensor {
        return this._tensors[this._tensorIx(slice)];
    }
    private _tensorIx(slice) : number {
        return  boolArrayToNumber(
            slice.map(ix => ix !== Bee.NONE)
        );
    }

    private _setTensor(slice, value) {
        let clone = _.clone(this._tensors);
        clone[this._tensorIx(slice)] = value;
        return new DataSet(clone);
    }

    get(slice: SliceSpec): ITensor {
        let tensor = this._tensor(slice);
        let sliceWithRemovedNones = slice.filter(ix => ix !== Bee.NONE);
        return tensor.get(sliceWithRemovedNones);
    }

    map(slice:SliceSpec, mapper) {
        return this._setTensor(
            slice,
            this._tensor(slice).map(mapper)
        );
    }
    private _belongsToDim(dim, tensorIx):boolean {
        let dimIx = this._dimIx(dim);
        return !! ((tensorIx << dimIx) % 2); 
    }

    filter(dim:DimSpec, f:Filter) {
        let dimIx = this._dimIx(dim);
        let {tensor, indices} = (<IDimensionTensor><any>this.dim(dim)).filter(f);
        let dataset = DataSet;

        this._tensors.forEach(
            (t, ix)=> if(this._belongsToDim(dimIx, ix)) {
                //dataset = 
            }
        ) 
    }
    private _dimIx(spec:DimSpec):number {
        if (_.isString(spec)) {
            return _.findIndex(this.dims(), 
                d => d.name() == spec
            )
        }
        if (_.isNumber(spec)) {
            return spec;
        }
        throw "Invalid dimspec " + spec;
    }

    dim(spec: DimSpec) {
        return this.dims()[ this._dimIx(spec) ];
    }

    dims(): IDimensionTensor[] {
        let numberOfDims = Math.log2(this._tensors.length);
        return <IDimensionTensor[]><any>_.range(0, numberOfDims - 1).map(
            i => this._tensors[1 << i]
        );
    }

    sort(dim: DimSpec, sorter: Sorter){
        this.dim(dim).sort(sorter)

    }
    limit(dim: DimSpec, number: Number);

    group(dim: DimSpec: grouper: Grouper); //Returns a MultiTensor with dims().length + 1
    aggregate(dim: DimSpec, aggregator: Aggregator); //Returns a MultiTensor with dims().length - 1
}


