import {test} from 'node:test';
import assert from 'node:assert/strict';
import {InputGate} from '../src/input.js';
test('held hard-drop never places a second seed pair until released',()=>{const i=new InputGate();assert.equal(i.press('hard',0),true);assert.equal(i.press('hard',10),false);assert.deepEqual(i.repeat(10000),[]);i.release('hard');assert.equal(i.press('hard',10001),true);});
test('horizontal and soft-drop repeat only after initial delay and interval',()=>{const i=new InputGate();i.press('left',0);assert.deepEqual(i.repeat(159),[]);assert.deepEqual(i.repeat(160),['left']);assert.deepEqual(i.repeat(170),[]);assert.deepEqual(i.repeat(240),['left']);});
test('interrupted controls are cleared and cannot repeat after resume',()=>{const i=new InputGate();i.press('down',0);i.clear();assert.deepEqual(i.repeat(900),[]);assert.equal(i.press('down',1000),true);});
