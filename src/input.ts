export type Action='left'|'right'|'down'|'cw'|'ccw'|'hard';
export class InputGate {
 private held=new Map<Action,number>();
 press(action:Action,now:number):boolean{if(this.held.has(action))return false;this.held.set(action,now+160);return true;}
 release(action:Action):void{this.held.delete(action);}
 clear():void{this.held.clear();}
 repeat(now:number):Action[]{const out:Action[]=[];for(const [a,next] of this.held)if(['left','right','down'].includes(a)&&now>=next){out.push(a);this.held.set(a,now+(a==='down'?55:80));}return out;}
}
