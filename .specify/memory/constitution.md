<!-- SYNC IMPACT REPORT (v1.0.0 initial ratification)
================================================================================
VERSION CHANGE: N/A → 1.0.0 (initial ratification)
RATIFICATION_DATE: 2026-03-19

PRINCIPLES CREATED:
- I. Clean Code Discipline
- II. Component-Driven Architecture
- III. Test Coverage as Priority (NON-NEGOTIABLE)
- IV. Type Safety & Strong Typing
- V. Performance & Maintainability

SECTIONS CREATED:
- Technology Stack & Constraints
- Development Workflow & Quality Gates

TEMPLATES REQUIRING REVIEW:
- ✅ spec-template.md - Validate test requirement sections
- ✅ tasks-template.md - Ensure task grouping includes testing phases
- ✅ plan-template.md - Review for test coverage metrics
- ⚠ commands/ - Verify no outdated references

================================================================================
-->

# Zeus App Constitution

## Core Principles

### I. Clean Code Discipline

Every component, hook, service, and utility MUST adhere to clean code principles:

- **Readability first**: Function names clearly describe intent; code requires no guessing.
- **Single Responsibility**: Each file/function handles one thing well — no god components or omniscient utilities.
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into hooks, helpers, or components; extract duplicated code to maintain.
- **No dead code**: Remove unused imports, functions, and branches; use git history as reference.
- **Consistent naming**: camelCase for functions/variables, PascalCase for components, UPPER_SNAKE_CASE for constants.

**Rationale**: Clean code reduces onboarding time, enables safer refactoring, and prevents technical debt accumulation that slows feature velocity.

---

### II. Component-Driven Architecture

Every feature is built from the ground up as composable components:

- **Atomic components**: Break UI into smallest reusable units (buttons, inputs, cards, etc.) in `src/components/ui/`.
- **Container/Presentation pattern**: Smart components (containers) handle logic; dumb components (presentational) receive props and render.
- **Context for shared state**: Use React Context only for cross-cutting concerns (theme, auth, sidebar state); preference Redux/Zustand for complex domain state.
- **Server vs Client**: Leverage Next.js App Router — mark components `'use client'` only when necessary; default to server components.
- **Props interface clarity**: Define explicit TypeScript interfaces for all component props; avoid spreading objects carelessly.

**Rationale**: Composable, well-structured components enable parallel development, easy testing, and future scaling without rewrites.

---

### III. Test Coverage as Priority (NON-NEGOTIABLE)

Test-driven development is mandatory for all new features:

- **Tests BEFORE implementation**: User stories must have tests written first; tests must FAIL before code is written (Red-Green-Refactor cycle).
- **Coverage thresholds**: Minimum 70% statement coverage on all new code in `src/components/`, `src/hooks/`, `src/services/`.
- **Test types**: Unit tests for utilities and hooks; integration tests for user journeys; snapshot tests for UI components only when appropriate.
- **E2E coverage**: New features touching critical workflows require at least one E2E test (Playwright/Cypress).
- **Test locations**: `src/__tests__/` parallel structure (e.g., `src/__tests__/hooks/useMovimento.test.ts` mirrors `src/hooks/useMovimento.ts`).

**Rationale**: Tests enable fearless refactoring, reduce production bugs, and serve as living documentation of expected behavior.

---

### IV. Type Safety & Strong Typing

TypeScript is non-negotiable; strict mode is required at all times:

- **Explicit types**: Every function parameter and return value MUST have explicit type annotations; no implicit `any`.
- **`noImplicitAny: true`**: Enforced via `tsconfig.json`; use `@ts-ignore` only with written justification in the line above.
- **Shared type definitions**: Domain types live in `src/types/` (e.g., `src/types/chamado.type.ts`); avoid inline type duplication.
- **API contracts**: Services that fetch data MUST include Zod schemas (or TypeScript types) that validate responses at runtime.
- **Redux state typing**: All Redux slices and selectors MUST use explicit return types; leverage Redux Toolkit for type inference where applicable.

**Rationale**: Strong typing catches entire categories of bugs at compile time; reduces runtime errors and makes code self-documenting.

---

### V. Performance & Maintainability

Optimize for both runtime performance and code maintainability:

- **Lazy load routes**: Use `next/dynamic` for components lazy-loaded on demand; exempt critical-path components (header, auth).
- **Image optimization**: All images use `<Image>` component from Next.js with explicit width/height; no raw `<img>` tags.
- **Bundle size awareness**: Monitor bundle size with every major dependency addition; prefer lighter libraries over feature-rich behemoths when equivalent.
- **Debt prevention**: Refactor code as you go — if a component exceeds 300 lines, break it apart; if a hook logic exceeds 100 lines, extract logic to helpers.
- **Documentation**: Complex business logic (especially in services and helpers) MUST include JSDoc comments with examples.

**Rationale**: Performance optimizations prevent user experience degradation; planned refactoring prevents code rot that becomes expensive later.

---

## Technology Stack & Constraints

### Core Stack
- **Framework**: Next.js 15.x with React 19
- **Language**: TypeScript 5.x (strict mode mandatory)
- **Styling**: Tailwind CSS v4.0 with Tailwind Merge for conditional classes
- **Forms**: React Hook Form with Zod for validation
- **State**: Redux Toolkit for domain state; React Context for UI concerns only
- **API**: Axios with interceptors for auth/error handling; types validated at runtime with Zod
- **Code Quality**: ESLint 9.x + Prettier 3.x + Tailwind Prettier plugin
- **Testing**: Jest + React Testing Library for unit/integration; Playwright for E2E

### Forbidden Patterns
- No prop drilling beyond 2 levels — use Context or Redux instead.
- No inline styles — Tailwind only.
- No untyped Redux state slices.
- No API calls directly in components — fetch via services/hooks.
- No component files over 300 lines; split before reaching that threshold.

---

## Development Workflow & Quality Gates

### Code Review Requirements
- **Minimum reviewers**: 1 approved review required before merge.
- **CI/CD gates**: Build MUST pass, linting MUST pass, tests MUST pass (70%+ coverage on new code).
- **Type checking**: TypeScript compilation MUST have zero errors.
- **Clean code checks**: Reviewer flags any violations of Principle I and requires fixes.

### Branching & Commits
- **Branch naming**: `feature/<issue-number>-<kebab-case-title>` or `fix/<kebab-case-title>`
- **Commit messages**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`)
- **Squash on merge**: Feature branches MUST be squashed to a single meaningful commit before merge.

### Release & Versioning
- **Semantic Versioning**: MAJOR.MINOR.PATCH (e.g., 2.0.2 → 2.1.0 for feature, 2.0.3 for patch)
- **MAJOR**: Breaking API changes, removed features, governance changes.
- **MINOR**: New features, new principles, expanded test requirements.
- **PATCH**: Bug fixes, documentation, clean-up, type refinements.
- **Tag all releases**: git tag `v{VERSION}` at release commits.

---

## Governance

### Amendment Process
1. **Proposal**: Create GitHub issue describing changes and rationale.
2. **Discussion**: Team reviews for 3 business days minimum; consensus required.
3. **Ratification**: Approved amendments documented in this file with updated `LAST_AMENDED_DATE` and `CONSTITUTION_VERSION`.
4. **Migration**: All PRs post-amendment MUST comply; retroactive compliance on critical violations only.

### Compliance Verification
- **PR gate**: Every PR title and changes checked against current constitution principles.
- **Quarterly review**: Team audits code against principles; flag recurring violations for discussion.
- **Living document**: Constitution supersedes all other guidance; conflicts resolved in favor of constitution first.

### Runtime Guidance
For day-to-day development, reference `docs/development-guide.md` and component examples in `src/components/`. Constitution sets the non-negotiable rules; guidance docs provide patterns and shortcuts.

---

**Version**: 1.0.0 | **Ratified**: 2026-03-19 | **Last Amended**: 2026-03-19
