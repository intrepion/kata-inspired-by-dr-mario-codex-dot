# QA ledger

## Engine verification
The ordinary-action campaign verifier in `tests/engine.test.ts` restores every orchard using rotate, move and drop calls. No direct board mutation occurs in those solvability runs. Other tests intentionally construct board fixtures for edge-case physics and ordering. These fixtures are not browser achievements.

Worked score: first orchard 620; second 930; cascade orchard 1080 (first wave 3 knots + 2 seeds = 320, second 3 knots + 1 seed × 2 = 620, final 1 knot + 4 seeds = 140); fourth 940; fifth 1250. Campaign total 4820.

Campaign layouts have unique coordinates, no initial runs of four, and finite ordinary-move solutions. Endless permutations are separately verified through 16 successive skies. This verifies the seeded intended route, not every arbitrary player state or every possible random suffix.

## Browser verification
Supported Chrome QA uses the spec’s ordinary move sequences through visible controls, with no hidden state mutation. Script assistance and observations are recorded below.

## Supported Chrome observations — 2026-10-12
Chrome profile intrepion, supported extension tab 222224408; production HTTP server at 127.0.0.1:5214. Native Chrome keyboard input was also used for holds and tab interruption. No Mac unlock or security changes were needed.

Two complete campaign playthroughs used the documented ordinary move sequences, executed with scripted clicks on visible controls. This is solution-guided/script-assisted gameplay, not unaided discovery. No hidden state, storage, engine variables or board cells were mutated for browser achievements. Final production-code playthrough was on a497ad7; following final commit changes are evidence/documentation only.

| Observation | Visible result |
|---|---|
| First light | 0 knots, restored, 620 light |
| Three constellations | 0 knots, restored, cumulative 1550 |
| Falling star first placement | 2× CASCADE +940, six knots released, one remaining, cumulative 2490 |
| Falling star finish | 0 knots, restored, cumulative 2630 |
| Twin horizons | simultaneous horizon bloom +620, cumulative 3570 |
| Dawn keeper | ALL FIVE ORCHARDS RESTORED; And then, dawn.; 4820 light; best cascade 2× |
| Top-out | Repeated ordinary hard drops in center produced THE SKY IS FULL and Retry orchard |
| Later-stage retry | Top-out in orchard 3; retry restored orchard 3 with its 1550 entry score |
| Keyboard | Left, Up, Down and P changed active position to column 3 row 2 and paused; reload preserved it |
| Held Enter / held Space | Native 1300ms holds each changed settled seed count from 0 to 2, one pair |
| Pause | Paused board disabled all six game controls; resume continued at same pair |
| Interruption | Switching away using native Chrome keyboard paused orchard 3 with one knot; reload resumed paused at same pair, 2490 light and 2× chain |
| Saved resume | Reload after cascade retained one dusk knot, pair, 2490 score and 2× chain |
| Replay | Grow again reset to First light, six knots and zero score; local 4820 record retained |
| Endless | Restored first endless sky and advanced to ENDLESS · SKY 2 with 620 score |
| Tutorial | All four instructions visible; opening it pauses game; close returns to paused garden |
| Portrait | 390×844 full-page render inspected; 320px viewport had clientWidth/scrollWidth both 305 (no horizontal overflow); onscreen controls usable |

Screenshots: [ending](../evidence/chrome-ending.jpg), [portrait](../evidence/chrome-portrait.jpg). [Ending DOM](../evidence/chrome-ending-dom.txt) preserves exact visible result. Browser screenshot capability viewport override was reset. Browser left at a fresh paused campaign. Browser log warnings came from an installed Chrome extension; no game-origin errors were observed.

## Independent reviews
Matt Pocock code-review workflow: fixed point 076fc4c, initial implementation fa05419. Separate spec and standards agents reviewed independently. Spec found final-stage `won` save could advance past ending, and retry discarded prior totals. Standards found held Enter on focused Drop could bypass repeat gating, and duplicate authored third-orchard data. All were fixed in a497ad7 with regression coverage and ordinary Chrome held-key verification. Both reviewers re-reviewed a497ad7 and returned no remaining blocking findings. Optional main.ts responsibility split remains a maintainability suggestion. Final suite: 28 tests.

## Limits
Five compact lesson orchards (14 intended placements); endless cycles authored layouts with color permutations rather than creating novel random target fields. Cascade resolution is atomic with wave reports, not per-wave animation. No audio. Portrait page uses vertical scrolling. Save is local to this origin/browser and the new entry-total schema safely discards pre-release snapshots. CI verifies engine/input/type/build/audit, not browser achievement. QA does not prove all arbitrary player strategies or suffix RNG paths are solvable.
