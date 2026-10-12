# QA ledger

## Engine verification
The ordinary-action campaign verifier in `tests/engine.test.ts` restores every orchard using rotate, move and drop calls. No direct board mutation occurs in those solvability runs. Other tests intentionally construct board fixtures for edge-case physics and ordering. These fixtures are not browser achievements.

Worked score: first orchard 620; second 930; cascade orchard 1080 (first wave 3 knots + 2 seeds = 320, second 3 knots + 1 seed × 2 = 620, final 1 knot + 4 seeds = 140); fourth 940; fifth 1250. Campaign total 4820.

Campaign layouts have unique coordinates, no initial runs of four, and finite ordinary-move solutions. Endless permutations are separately verified through 16 successive skies. This verifies the seeded intended route, not every arbitrary player state or every possible random suffix.

## Browser verification
Pending supported Chrome QA. Use the spec's ordinary move sequences through visible controls, with no hidden state mutation. Record solver/script assistance explicitly.
