# Adding a reference project

1. Create a descriptive kebab-case directory under `projects/`.
2. Keep it independently runnable, with its own dependency manifest and lockfile when applicable.
3. Document the problem, supported features, prerequisites, setup commands, architecture, tradeoffs, validation steps, and known limitations in its README.
4. Include focused tests for meaningful behavior and failure cases. Keep fixtures deterministic and avoid requiring live services for unit tests.
5. Add the project to the table in the root README.
6. Exclude dependencies, build output, local tool settings, and secrets from Git. Provide an `.env.example` when configuration is needed.

Prefer straightforward feature boundaries. Introduce shared packages only when multiple projects have a concrete need; examples should remain easy to copy and run independently.

Run the relevant checks inside every project you change. For Movie Reference:

```sh
cd projects/movie-reference
npm run typecheck
npm run lint
npm test
npm run format:check
```
