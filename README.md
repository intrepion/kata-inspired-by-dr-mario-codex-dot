# Prism Orchard

An original celestial garden puzzle inspired by the idea of falling two-color pairs. Restore five handcrafted orchards and reach dawn, then replay or keep growing in endless mode. No Nintendo characters, assets, branding, music or boards are included.

## Play

```sh
npm ci
npm run build
npm run preview
```

Open http://127.0.0.1:5214. Development: `npm run dev`. Both commands require this port to be free and never select another port silently.

Arrows move and soft-drop; ↑/X rotate clockwise; Z rotates counterclockwise; Space hard-drops. P/Escape pauses. Touch/mouse controls are below the board. Shapes identify every color. The field guide explains pair support and cascades; gardener notes offer stage hints. Saved runs resume paused, including the exact active pair. Local records and saves stay on your device. Retry restores the current orchard’s entry score and records. Starting another mode replaces your active saved run.

## Deliberate differences

Original night-garden fiction, five short authored lessons, geometric framed knots, shape-coded seeds, bounded deterministic physics, upward/downward wall adjustment, immediate locking without lock delay, explicit between-orchard pauses and an endless cycle of verified authored layouts. Cascade physics resolves atomically; the interface displays its wave count and score rather than animating each intermediate gravity frame. Board speed is forgiving and caps at 260 ms in endless. No sound or network gameplay dependency.

## Engineering evidence

- [Specification](docs/SPEC.md), [glossary](GLOSSARY.md), [ADRs](docs/adr/), [standards](CODING_STANDARDS.md)
- `npm test`: public engine and input seams, authored move verification, pair gravity, simultaneous matches, rotations, timing, pause, top-out precedence and malformed saves.
- `npm run typecheck`, `npm run build`, `npm audit --audit-level=moderate`
- [QA evidence](docs/QA.md) distinguishes engine fixtures from ordinary browser gameplay.

Matt Pocock workflows used from official `mattpocock/skills`: Grill with Docs (grilling/domain modeling), Implement (TDD/code review). The user authorized default choices and autonomous decisions, so the interview is recorded in the spec rather than interrupting with design questions. Initial red/green seam logs are under `evidence/`; additional domain coverage was added around worked fixtures after the first vertical slice. Reviews are independent spec and standards passes against the initial documentation commit.
