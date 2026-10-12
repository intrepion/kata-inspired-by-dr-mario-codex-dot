import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyBoard, resolve, type Cell} from '../src/engine.js';
const knot=(color:0|1|2):Cell=>({color,knot:true,link:null});
test('crossing runs clear their shared knot exactly once',()=>{
 const b=emptyBoard(); for(let x=1;x<=5;x++)b[10][x]=knot(0); for(let y=8;y<=12;y++)b[y][3]=knot(0);
 const r=resolve(b); assert.equal(r.removed,9); assert.equal(r.score,900); assert.equal(r.waves,1);
});
