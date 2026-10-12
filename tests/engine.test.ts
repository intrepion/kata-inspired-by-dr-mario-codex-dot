import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyBoard, resolve, type Cell} from '../src/engine.js';
const knot=(color:0|1|2):Cell=>({color,knot:true,link:null});
test('crossing runs clear their shared knot exactly once',()=>{
 const b=emptyBoard(); for(let x=1;x<=5;x++)b[10][x]=knot(0); for(let y=8;y<=12;y++)b[y][3]=knot(0);
 const r=resolve(b); assert.equal(r.removed,9); assert.equal(r.score,900); assert.equal(r.waves,1);
});
import {newGame,resume,move,rotate,drop,advance,matches,targetCount,settle,decode,encode,pause,tick,landing,legal,positions, type Game} from '../src/engine.js';
import {ORCHARDS} from '../src/levels.js';
function play(g:Game,x:number,dir:number){resume(g);for(let i=0;i<dir;i++)assert.equal(rotate(g),true);for(let i=0;i<8&&g.active!.x!==x;i++)assert.equal(move(g,Math.sign(x-g.active!.x)),true);assert.equal(g.active!.x,x);drop(g,true);}
test('every authored orchard has no initial matches and clears through ordinary moves',()=>{
 let g=newGame();const trace=[];
 for(let level=0;level<5;level++){
  assert.equal(matches(g.board).size,0);assert.equal(targetCount(g),ORCHARDS[level].targets.length);
  for(const p of ORCHARDS[level].solution){play(g,p.x,p.dir);trace.push({level,score:g.score,targets:targetCount(g),waves:g.last.waves});}
  assert.equal(g.status,level===4?'complete':'won');if(level<4)g=advance(g);
 }console.log('SOLVABILITY TRACE (engine actions, not browser play):',JSON.stringify(trace));assert.equal(g.score,4820);
});
test('horizontal pair remains held when only one half is supported',()=>{const b=emptyBoard();b[13][1]=knot(2);b[10][1]={color:0,knot:false,link:82};b[10][2]={color:1,knot:false,link:81};settle(b);assert.deepEqual(b[12].slice(1,3),[{color:0,knot:false,link:98},{color:1,knot:false,link:97}]);});
test('vertical pair falls together and links follow the pair',()=>{const b=emptyBoard();b[3][4]={color:0,knot:false,link:36};b[4][4]={color:1,knot:false,link:28};settle(b);assert.equal(b[12][4]?.link,108);assert.equal(b[13][4]?.link,100);});
test('clearing one half releases its survivor to fall independently',()=>{const b=emptyBoard();for(let y=10;y<13;y++)b[y][1]=knot(0);b[9][1]={color:0,knot:false,link:74};b[9][2]={color:1,knot:false,link:73};resolve(b);assert.deepEqual(b[13][2],{color:1,knot:false,link:null});assert.equal(b[10][1],null);});
test('unsupported fixed knots never move and loose halves settle',()=>{const b=emptyBoard();b[5][0]=knot(1);b[5][2]={color:0,knot:false,link:null};settle(b);assert.deepEqual(b[5][0],knot(1));assert.equal(b[13][2]?.color,0);});
test('genuine cascade clears two waves and awards a combo once',()=>{const g=newGame('campaign',2);play(g,6,0);assert.equal(g.last.waves,2);assert.equal(g.last.knots,6);assert.equal(g.last.score,940);assert.equal(targetCount(g),1);const score=g.score;resume(g);tick(g,250);assert.equal(g.score,score);});
test('simultaneous different-color horizons resolve in a single wave',()=>{const g=newGame('campaign',3);play(g,3,1);play(g,3,0);assert.equal(g.last.waves,1);assert.equal(g.last.removed,8);assert.equal(g.status,'won');});
test('rotations preserve color order and legal wall adjustments',()=>{const g=newGame();resume(g);rotate(g);for(let i=0;i<4;i++)move(g,1);assert.equal(g.active?.x,7);assert.equal(rotate(g),true);assert.equal(g.active?.x,7);assert.equal(g.active?.dir,2);rotate(g);rotate(g);assert.equal(g.active?.x,6);assert.deepEqual(g.active?.colors,[0,0]);});
test('rotation rejects all occupied kick positions',()=>{const g=newGame();resume(g);g.active={x:3,y:5,dir:0,colors:[0,1]};for(const [x,y] of [[3,6],[2,6],[4,6],[3,4]])g.board[y][x]=knot(2);assert.equal(rotate(g),false);assert.equal(g.active.dir,0);});
test('soft drop locks immediately on contact, hard drop places once',()=>{const g=newGame();resume(g);g.active={x:1,y:10,dir:0,colors:[0,0]};drop(g);assert.equal(g.cursor,3);assert.equal(g.last.knots,3);});
test('automatic movement waits for interval, long frames are capped',()=>{const g=newGame();resume(g);tick(g,249);assert.equal(g.active?.y,0);tick(g,10000);assert.equal(g.active?.y,0);tick(g,250);tick(g,250);assert.equal(g.active?.y,0);tick(g,1);assert.equal(g.active?.y,1);});
test('pause freezes movement and clears accumulated fall time',()=>{const g=newGame();resume(g);tick(g,250);pause(g);const before=encode(g);assert.equal(move(g,1),false);assert.equal(drop(g,true),false);tick(g,250);assert.equal(encode(g),before);resume(g);assert.equal(g.fallMs,0);});
test('blocked next spawn tops out after locking',()=>{const g=newGame();resume(g);g.board[0][3]=knot(2);g.active={x:7,y:12,dir:1,colors:[1,2]};drop(g,true);assert.equal(g.status,'lost');assert.equal(g.active,null);});
test('last target victory wins over blocked next spawn',()=>{const g=newGame();g.board=emptyBoard();for(let y=11;y<14;y++)g.board[y][1]=knot(0);g.board[0][3]={color:2,knot:false,link:null};resume(g);g.active={x:1,y:10,dir:0,colors:[0,1]};drop(g,true);assert.equal(g.status,'won');});
test('landing is legal and stops immediately above obstruction',()=>{const g=newGame();const p=landing(g)!;assert.equal(p.y,10);assert.equal(legal(g.board,p),true);assert.equal(legal(g.board,{...p,y:p.y+1}),false);assert.equal(positions(p).length,2);});
test('save roundtrip resumes paused with board, position and score intact',()=>{const g=newGame();resume(g);move(g,-1);drop(g);const copy=decode(encode(g))!;assert.equal(copy.status,'paused');assert.deepEqual(copy.active,g.active);assert.deepEqual(copy.board,g.board);});
test('malformed snapshots, invalid links, huge inputs and invalid victory fail closed',()=>{assert.equal(decode('{'),null);assert.equal(decode('x'.repeat(24001)),null);for(const field of ['level','cursor','rng','score','fallMs']){const g=newGame();(g as unknown as Record<string,unknown>)[field]=-1;assert.equal(decode(encode(g)),null);}const g=newGame();g.board[3][3]={color:0,knot:false,link:25};assert.equal(decode(encode(g)),null);g.board=emptyBoard();assert.equal(decode(encode(g)),null);});
test('endless uses verified layouts across color permutations and continues',()=>{for(let level=0;level<16;level++){const g=newGame('endless',level);assert.equal(matches(g.board).size,0);for(const p of ORCHARDS[level%5].solution)play(g,p.x,p.dir);assert.equal(g.status,'won');assert.equal(advance(g).level,level+1);}});
import {retry} from '../src/engine.js';
test('invalid final-stage won save cannot bypass the ending',()=>{const g=newGame('campaign',4);for(const p of ORCHARDS[4].solution)play(g,p.x,p.dir);g.status='won';assert.equal(decode(encode(g)),null);assert.equal(advance(g).status,'complete');assert.equal(advance(g).level,4);});
test('retry preserves entry totals but discards this orchard’s partial score',()=>{let g=newGame();for(const p of ORCHARDS[0].solution)play(g,p.x,p.dir);g=advance(g);play(g,0,0);g.status='lost';g.active=null;const r=retry(g);assert.equal(r.level,1);assert.equal(r.score,620);assert.equal(r.blooms,2);assert.equal(r.bestChain,1);assert.equal(targetCount(r),9);assert.equal(decode(encode(r))?.score,620);});
test('floor adjustment rotates a horizontal pair upright without leaving the board',()=>{const g=newGame();g.board=emptyBoard();g.board[4][0]=knot(2);resume(g);g.active={x:3,y:13,dir:0,colors:[0,1]};assert.equal(rotate(g),true);assert.deepEqual(positions(g.active!),[[3,12],[3,13]]);});
test('clearing top half of a vertical pair releases lower half',()=>{const b=emptyBoard();for(let x=1;x<4;x++)b[9][x]=knot(0);b[9][4]={color:0,knot:false,link:84};b[10][4]={color:2,knot:false,link:76};const r=resolve(b);assert.equal(r.removed,4);assert.deepEqual(b[13][4],{color:2,knot:false,link:null});});
test('isolated longer match removes every member and repeated resolution scores zero',()=>{const b=emptyBoard();for(let x=0;x<8;x++)b[13][x]=knot(2);assert.deepEqual(resolve(b),{waves:1,removed:8,knots:8,score:800});assert.deepEqual(resolve(b),{waves:0,removed:0,knots:0,score:0});});
test('save rejects invalid entry totals, statuses, colors and colliding active pairs',()=>{for(const change of [(g:Game)=>g.entry.score=1,(g:Game)=>g.status='complete',(g:Game)=>g.active!.y=11,(g:Game)=>g.next=[9,1] as never,(g:Game)=>g.board[1][1]={color:0,knot:true,link:10}]){const g=newGame();change(g);assert.equal(decode(encode(g)),null);}});
