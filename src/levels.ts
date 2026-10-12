export type Color = 0 | 1 | 2;
export type Colors = [Color, Color];
export type Target = [number, number, Color];
export interface Orchard {name:string; subtitle:string; hint:string; targets:Target[]; loose:Target[]; seeds:Colors[]; solution:{x:number;dir:number}[]}
const pillar=(x:number,c:Color,bottom=13):Target[]=>[0,1,2].map(d=>[x,bottom-d,c]);
export const ORCHARDS:Orchard[]=[
 {name:'First light',subtitle:'The garden remembers your touch.',hint:'Bring a sun seed to the sun pillar, then a tide seed to the tide pillar.',targets:[...pillar(1,0),...pillar(4,1)],loose:[],seeds:[[0,0],[1,1]],solution:[{x:1,dir:0},{x:4,dir:0}]},
 {name:'Three constellations',subtitle:'Different lights, one quiet rhythm.',hint:'A matching half is enough. Its partner keeps falling after the bloom.',targets:[...pillar(0,0),...pillar(3,1),...pillar(6,2)],loose:[],seeds:[[0,1],[1,2],[2,2]],solution:[{x:0,dir:0},{x:3,dir:0},{x:6,dir:0}]},
 {name:'The falling star',subtitle:'One bloom wakes another.',hint:'Land the sun pair beside the three sun knots. The tide seed above them will fall and bloom. Finish with upright dusk pairs.',targets:[[0,13,1],[1,13,1],[2,13,1],[3,12,0],[4,12,0],[5,12,0],[2,13,2]],loose:[[3,11,1]],seeds:[[0,0],[2,2],[2,2]],solution:[{x:6,dir:0},{x:6,dir:1},{x:6,dir:1}]},
 {name:'Twin horizons',subtitle:'Two skies bloom at the same time.',hint:'An upright dusk pair opens the center. Then bridge the sun and tide horizons with one flat pair.',targets:[[0,13,0],[1,13,0],[2,13,0],[5,13,1],[6,13,1],[7,13,1],...pillar(3,2)],loose:[],seeds:[[2,2],[0,1]],solution:[{x:3,dir:1},{x:3,dir:0}]},
 {name:'Dawn keeper',subtitle:'Restore the last lights before morning.',hint:'Work across the sky: sun on the far left, tide, dusk, then an upright sun pair on the far right.',targets:[...pillar(0,0),...pillar(2,1,12),...pillar(5,2,11),...pillar(7,0)],loose:[],seeds:[[0,1],[1,2],[2,0],[0,0]],solution:[{x:0,dir:0},{x:2,dir:0},{x:5,dir:0},{x:7,dir:1}]}
];
// One dusk knot supports the incoming sun pair at row 12.
ORCHARDS[2].targets=[[0,13,1],[1,13,1],[2,13,1],[3,12,0],[4,12,0],[5,12,0],[6,13,2]];
ORCHARDS[2].loose=[[3,11,1]];
