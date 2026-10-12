import {ORCHARDS, type Color, type Colors} from './levels.js';
export const WIDTH=8, HEIGHT=14;
export interface Cell {color:Color;knot:boolean;link:number|null}
export type Board=(Cell|null)[][];
export interface Piece {x:number;y:number;dir:number;colors:Colors}
export type Status='playing'|'paused'|'won'|'lost'|'complete';
export interface Game {version:1;entry:{score:number;blooms:number;bestChain:number};board:Board;active:Piece|null;next:Colors;mode:'campaign'|'endless';level:number;cursor:number;rng:number;score:number;blooms:number;bestChain:number;status:Status;fallMs:number;last:{waves:number;removed:number;score:number;knots:number};}
export const emptyBoard=():Board=>Array.from({length:HEIGHT},()=>Array<Cell|null>(WIDTH).fill(null));
const offsets=[[1,0],[0,1],[-1,0],[0,-1]];
export function positions(p:Piece):[number,number][]{const [dx,dy]=offsets[p.dir];return [[p.x,p.y],[p.x+dx,p.y+dy]];}
export function legal(b:Board,p:Piece):boolean{return positions(p).every(([x,y])=>x>=0&&x<WIDTH&&y>=0&&y<HEIGHT&&!b[y][x]);}
export function matches(b:Board):Set<number>{
 const hit=new Set<number>();
 for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){
  const c=b[y][x];if(!c)continue;
  if(x===0||b[y][x-1]?.color!==c.color){let end=x;while(end<WIDTH&&b[y][end]?.color===c.color)end++;if(end-x>=4)for(let i=x;i<end;i++)hit.add(y*WIDTH+i);}
  if(y===0||b[y-1][x]?.color!==c.color){let end=y;while(end<HEIGHT&&b[end][x]?.color===c.color)end++;if(end-y>=4)for(let i=y;i<end;i++)hit.add(i*WIDTH+x);}
 }return hit;
}
export function settle(b:Board):void{
 for(let pass=0;pass<HEIGHT*WIDTH;pass++){
  let moved=false;const visited=new Set<Cell>();
  for(let y=HEIGHT-1;y>=0;y--)for(let x=0;x<WIDTH;x++){
   const c=b[y][x];if(!c||c.knot||visited.has(c))continue;
   const group:{x:number;y:number;c:Cell}[]=[{x,y,c}];
   if(c.link!==null){const ly=Math.floor(c.link/WIDTH),lx=c.link%WIDTH;const other=b[ly]?.[lx];if(other&&other.link===y*WIDTH+x)group.push({x:lx,y:ly,c:other});else c.link=null;}
   group.forEach(v=>visited.add(v.c));
   if(!group.every(v=>v.y+1<HEIGHT&&(!b[v.y+1][v.x]||group.some(g=>g.x===v.x&&g.y===v.y+1))))continue;
   group.forEach(v=>{b[v.y][v.x]=null;});
   group.forEach(v=>{b[v.y+1][v.x]=v.c;v.c.link=group.length===2?(group.find(g=>g!==v)!.y+1)*WIDTH+group.find(g=>g!==v)!.x:null;});moved=true;
  }if(!moved)return;
 }throw new Error('Gravity exceeded board bound');
}
export function resolve(b:Board):Game['last']{
 let waves=0,removed=0,score=0,knots=0;
 for(let pass=0;pass<WIDTH*HEIGHT/4;pass++){
  const hit=matches(b);if(!hit.size)return {waves,removed,score,knots};waves++;
  for(const id of hit){const y=Math.floor(id/WIDTH),x=id%WIDTH,c=b[y][x]!;removed++;score+=(c.knot?100:10)*waves;if(c.knot)knots++;
   if(c.link!==null&&!hit.has(c.link)){const other=b[Math.floor(c.link/WIDTH)][c.link%WIDTH];if(other)other.link=null;}b[y][x]=null;
  }settle(b);
 }if(matches(b).size)throw new Error('Resolution exceeded removal bound');return {waves,removed,score,knots};
}
export function targetCount(g:Game):number{return g.board.flat().filter(c=>c?.knot).length;}
function nextColors(g:Game):Colors{
 const scripted=ORCHARDS[g.level%ORCHARDS.length].seeds[g.cursor++];const shift=g.mode==='endless'?Math.floor(g.level/5)%3:0;
 if(scripted)return scripted.map(c=>(c+shift)%3) as Colors;
 const rand=()=>{g.rng=(Math.imul(g.rng,1664525)+1013904223)>>>0;return (g.rng%3) as Color;};return [rand(),rand()];
}
function spawn(g:Game):void{
 g.active={x:3,y:0,dir:0,colors:g.next};g.next=nextColors(g);g.fallMs=0;
 if(!legal(g.board,g.active)){g.active=null;g.status='lost';}
}
export function newGame(mode:Game['mode']='campaign',level=0,score=0):Game{
 const board=emptyBoard(),orchard=ORCHARDS[level%5],shift=mode==='endless'?Math.floor(level/5)%3:0;
 for(const [x,y,c] of orchard.targets)board[y][x]={color:((c+shift)%3) as Color,knot:true,link:null};
 for(const [x,y,c] of orchard.loose)board[y][x]={color:((c+shift)%3) as Color,knot:false,link:null};
 const g:Game={version:1,entry:{score,blooms:0,bestChain:0},board,active:null,next:[0,0],mode,level,cursor:0,rng:12345+level,score,blooms:0,bestChain:0,status:'paused',fallMs:0,last:{waves:0,removed:0,score:0,knots:0}};
 g.next=nextColors(g);spawn(g);return g;
}
export function landing(g:Game):Piece|null{if(!g.active)return null;let p={...g.active};for(let i=0;i<HEIGHT;i++){const q={...p,y:p.y+1};if(!legal(g.board,q))break;p=q;}return p;}
export function move(g:Game,dx:number):boolean{if(g.status!=='playing'||!g.active||![-1,1].includes(dx))return false;const p={...g.active,x:g.active.x+dx};if(!legal(g.board,p))return false;g.active=p;return true;}
export function rotate(g:Game,direction=1):boolean{
 if(g.status!=='playing'||!g.active)return false;
 const p={...g.active,dir:(g.active.dir+(direction===-1?3:1))%4};
 for(const [dx,dy] of [[0,0],[-1,0],[1,0],[0,-1],[0,1]]){const q={...p,x:p.x+dx,y:p.y+dy};if(legal(g.board,q)){g.active=q;return true;}}return false;
}
function lock(g:Game):void{
 if(!g.active)return;const pts=positions(g.active),colors=g.active.colors;
 pts.forEach(([x,y],i)=>{const [ox,oy]=pts[1-i];g.board[y][x]={color:colors[i],knot:false,link:oy*WIDTH+ox};});g.active=null;
 g.last=resolve(g.board);g.score+=g.last.score;g.blooms+=g.last.waves;g.bestChain=Math.max(g.bestChain,g.last.waves);g.fallMs=0;
 if(targetCount(g)===0){g.status=g.mode==='campaign'&&g.level===4?'complete':'won';return;}spawn(g);
}
export function drop(g:Game,hard=false):boolean{
 if(g.status!=='playing'||!g.active)return false;
 if(hard){g.active=landing(g);lock(g);return true;}
 const p={...g.active,y:g.active.y+1};if(legal(g.board,p)){g.active=p;g.fallMs=0;}else lock(g);return true;
}
export function fallInterval(g:Game):number{return Math.max(260,1000-g.level*100);}
export function tick(g:Game,dt:number):boolean{if(g.status!=='playing'||!Number.isFinite(dt)||dt<0)return false;g.fallMs+=Math.min(dt,250);if(g.fallMs<fallInterval(g))return false;g.fallMs=0;return drop(g);}
export function pause(g:Game):void{if(g.status==='playing'){g.status='paused';g.fallMs=0;}}
export function resume(g:Game):void{if(g.status==='paused'){g.status='playing';g.fallMs=0;}}
export function advance(g:Game):Game{if(g.status!=='won')return g;if(g.mode==='campaign'&&g.level>=4){g.status='complete';return g;}const n=newGame(g.mode,g.level+1,g.score);n.blooms=g.blooms;n.bestChain=g.bestChain;n.entry={score:g.score,blooms:g.blooms,bestChain:g.bestChain};return n;}
export function retry(g:Game):Game{const n=newGame(g.mode,g.level,g.entry.score);n.blooms=g.entry.blooms;n.bestChain=g.entry.bestChain;n.entry={...g.entry};return n;}
export function encode(g:Game):string{return JSON.stringify(g);}
export function decode(raw:string):Game|null{
 if(raw.length>24000)return null;
 try{
  const g=JSON.parse(raw) as Game;const int=(v:unknown,min:number,max:number)=>Number.isSafeInteger(v)&&Number(v)>=min&&Number(v)<=max;
  const color=(v:unknown)=>int(v,0,2),colors=(v:unknown)=>Array.isArray(v)&&v.length===2&&v.every(color);
  if(!g||g.version!==1||!['campaign','endless'].includes(g.mode)||!int(g.level,0,g.mode==='campaign'?4:100000)||!int(g.cursor,1,1000000)||!int(g.rng,0,4294967295)||!int(g.score,0,1e12)||!int(g.blooms,0,1e9)||!int(g.bestChain,0,28)||!['playing','paused','won','lost','complete'].includes(g.status)||!colors(g.next)||!Number.isFinite(g.fallMs)||g.fallMs<0||g.fallMs>1000)return null;
  if(!g.entry||!int(g.entry.score,0,g.score)||!int(g.entry.blooms,0,g.blooms)||!int(g.entry.bestChain,0,g.bestChain))return null;
  if(!Array.isArray(g.board)||g.board.length!==HEIGHT||g.board.some(r=>!Array.isArray(r)||r.length!==WIDTH))return null;
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){
   const c=g.board[y][x];if(c===null)continue;
   if(!c||!color(c.color)||typeof c.knot!=='boolean'||(c.link!==null&&!int(c.link,0,111))||(c.knot&&c.link!==null))return null;
   if(c.link!==null){const ly=Math.floor(c.link/WIDTH),lx=c.link%WIDTH,o=g.board[ly][lx];if(Math.abs(lx-x)+Math.abs(ly-y)!==1||!o||o.knot||o.link!==y*WIDTH+x)return null;}
  }
  if(!g.last||!int(g.last.waves,0,28)||!int(g.last.removed,0,112)||!int(g.last.knots,0,112)||!int(g.last.score,0,1e7))return null;
  if(g.active!==null){const p=g.active;if(!int(p.x,0,7)||!int(p.y,0,13)||!int(p.dir,0,3)||!colors(p.colors)||!legal(g.board,p))return null;}
  if(['playing','paused'].includes(g.status)&&(!g.active||targetCount(g)===0))return null;
  if(['won','complete','lost'].includes(g.status)&&g.active!==null)return null;
  if(['won','complete'].includes(g.status)&&targetCount(g)!==0)return null;
  if(g.status==='won'&&g.mode==='campaign'&&g.level===4)return null;
  if(g.status==='complete'&&(g.mode!=='campaign'||g.level!==4))return null;
  if(matches(g.board).size)return null;
  if(g.status==='playing')g.status='paused';g.fallMs=0;return g;
 }catch{return null;}
}
