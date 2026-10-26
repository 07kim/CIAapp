# Repository instructions

## Purpose

This repository contains an event-use virtual PC interface for CIA Internet Co. The first release contains a desktop, a locked surveillance-camera application, and a placeholder for a future access-log application.

## Required reading order

Before proposing or making changes, read:

1. `docs/PRODUCT_SPEC.md` for approved user-visible behavior.
2. `docs/SCREEN_FLOW.md` for navigation and reset rules.
3. `docs/ARCHITECTURE.md` for technical boundaries.
4. `docs/DECISIONS.md` for accepted decisions and unresolved choices.
5. `PLANS.md` for phase status and the next approved unit of work.
6. `CHANGELOG.md` for previously delivered changes.

If these files conflict, stop and report the conflict. Do not silently choose one interpretation.

## Source-of-truth ownership

- Product behavior belongs in `docs/PRODUCT_SPEC.md`.
- Screen transitions and state resets belong in `docs/SCREEN_FLOW.md`.
- Technical structure and integration boundaries belong in `docs/ARCHITECTURE.md`.
- Important accepted or rejected choices belong in `docs/DECISIONS.md`.
- Work status and phase sequencing belong in `PLANS.md`.
- Delivered changes belong in `CHANGELOG.md`.

Avoid copying the same requirement into several documents. Link to the owning document instead.

## Change rules

- Do not implement unresolved requirements as if they were approved.
- Keep the surveillance application usable without network access.
- Do not add a database merely for fixed event data.
- Treat all locks as event presentation, not strong security, unless the specification explicitly changes.
- Do not place secrets, credentials, deployment tokens, or private sheet identifiers in the repository.
- Preserve the approved red/black visual direction and CIA Internet Co. branding.
- Keep Japanese as the primary UI language with short English system labels for atmosphere.
- A behavior change must update its owning specification in the same change.
- A newly fixed bug must receive a regression test when practical.
- Record meaningful completed work in `CHANGELOG.md`.
- For this repository, the user authorized the GitHub/Vercel publication workflow on 2026-10-27. After an approved phase passes lint, type checking, tests, and the production build, update the owning documents and changelog, commit the verified state, push it to GitHub, and verify the corresponding Vercel deployment.
- Never push failing, partially verified, or secret-bearing changes. If authentication expires or a new external service is required, stop and request the user's involvement.

## Planned engineering standards

- React, TypeScript, and Vite.
- CSS Modules plus shared CSS custom properties for styling.
- Strict TypeScript settings once the application is initialized.
- Explicit typed application states; avoid scattered boolean flags for navigation and locks.
- Unit tests for answer normalization, authentication transitions, and inactivity timers.
- Browser-level tests for the principal user journeys and responsive layouts.
- Production readiness requires lint, type checking, tests, and a production build to pass.

## Planning boundary

Each implementation phase requires explicit approval. Before writing application code, summarize the phase scope, affected files, acceptance criteria, and verification plan. Stop after the approved phase instead of automatically starting the next phase.
