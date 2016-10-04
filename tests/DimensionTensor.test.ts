import test from 'ava';
import {ReturnValue} from "../lib/utils";
import {DimensionTensor} from '../data/DimensionTensor';

test('foo', t => {
    var data = [
        {name:"ett", group:"g1",val:3},
        {name:"två", group:"g2",val:1.2},
        {name:"tre", group:"g3",val:4},
        {name:"fyra", group:"g1",val:3.1},
        {name:"fem", group:"g2",val:1.3},
        {name:"sex", group:"g3",val:0},
        {name:"sju", group:"g1",val:2.1},
        {name:"åtta", group:"g2",val:2.2}
    ];
    
    let indices = new ReturnValue<number[]>();
    let dt = new DimensionTensor(data, "test")
    .sort(
        (a,b)=>{
            return b.val -  a.val;
        },
        indices
    );
    t.deepEqual(indices.get(), [2,3,0,7,6,4,1,5]);
    
    dt = new DimensionTensor(data, "test")
    .limit(2);
    t.deepEqual(dt.size(), [2]);

    indices = new ReturnValue<number[]>();
    dt = new DimensionTensor(data, "test")
    .filter(
        d=>d.group=="g1",
        indices
    )
    t.deepEqual(indices.get(), [0,3,6]);
 

    let val = (new DimensionTensor(data, "test")).get(0);
    t.is(val.name, "ett");

    val = (new DimensionTensor(data, "test")).map('name').get(0);
    t.is(val, "ett");

});