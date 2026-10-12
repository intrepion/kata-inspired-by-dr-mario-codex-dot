# Prism Orchard specification

## Autonomous design tree (Grill with Docs adaptation)
User authorized recommended defaults without design questions. We therefore settle the interview frontier here.
1. Identity → celestial night garden, original geometric crystals, no medical fiction or Nintendo assets.
2. Scope → five short handcrafted orchards, definite dawn ending, replay and an endless loop. Difficulty comes from color/orientation, support and cascades; no exact reference boards.
3. Board → 8 columns × 14 rows, three colors distinguished by circle, diamond and stripes.
4. Physics → reciprocal pair links; connected horizontal halves stop if either is supported, vertical halves fall together. Knots never fall. A cleared partner releases its survivor.
5. Input → arrows move/soft-drop; up/X rotate clockwise; Z counterclockwise; space hard-drops; P/Escape pauses. Initial action plus timed repeat for move/soft drop, no held-key hard-drop repetition. Rotation tries current, left, right, then up or down one cell; cannot pass through occupied cells. No lock delay.
6. Pacing → initial 1000ms fall, stage speeds 900/800/700/600ms; endless lower bound 260ms. Frame input capped at 250ms, max one automatic step per tick. Blur/hidden pauses and clears held input.
7. Resolution → all crossing/long runs unioned once; clear, unlink survivors, component gravity until settled, repeat to stable. Score each wave once: 10 per seed + 100 per knot, multiplied by cascade depth. Last-knot victory precedes next spawn top-out.
8. Persistence → versioned validated bounded snapshot after every action and pause; resumes paused. Campaign progress and records local only. Malformed or incompatible saves discarded with a visible message; storage errors do not break play.
9. Accessibility → readable ghost landing, next pair, tutorial, onscreen buttons, keyboard, responsive portrait/desktop, reduced motion, textual status and shape/color legend.

## Acceptance and agreed seams
The user explicitly requested rigorous engine tests and browser QA. Public engine actions, board resolution, input gate, and snapshot parsing are the test seams. Engine fixtures inspect resulting board/status/score; browser QA uses ordinary visible controls. Tests cannot establish real browser campaign completion. Preserve scripts and observed outcomes separately.

Campaign solutions: orchard 1 AA horizontal x1, TT horizontal x4; orchard 2 AT horizontal x0, TP horizontal x3, PP horizontal x6; orchard 3 AA horizontal x6 (two-wave cascade), PP vertical x6 twice; orchard 4 PP vertical x3, AT horizontal x3 (two simultaneous colors); orchard 5 AT horizontal x0, TP horizontal x2, PA horizontal x5, AA vertical x7. Coordinates are zero-based; vertical means clockwise once (second half below).

No hidden UI cheats or board mutations. QA may use these documented sequences via visible controls; disclose assistance. Campaign should open paused before the first drop, provide an objective/hint per stage, and require explicit continuation between stages. Retry resets only the current orchard. New campaign or endless starts a new run. Restored saves resume at the same active pair and board with paused input.
