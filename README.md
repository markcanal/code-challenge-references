# Code Challenge References

A collection of small, standalone projects for practicing code challenges and studying practical architecture. Each project focuses on a limited feature set, clear data flow, and explicit tradeoffs.

## Projects

| Project | Stack | Scope | Concepts |
| --- | --- | --- | --- |
| [Movie Reference](REACTNATIVE/movie-reference/) | React Native, Expo, TypeScript, TanStack Query | Movie search and details using iTunes | Feature-based organization, API mapping, debounce, caching, cancellation, async UI states |

## Repository layout

```text
CMP/                     Compose Multiplatform reference projects
KOTLIN/                  Kotlin reference projects
REACTNATIVE/              React Native reference projects
  movie-reference/       Standalone Expo app with its own lockfile and README
```

Each project owns its dependencies, scripts, configuration, tests, and documentation. There is no root dependency install or shared runtime package. Run commands from the project's directory.

## Start Movie Reference

Requires Node 22.13+ and npm.

```sh
cd REACTNATIVE/movie-reference
npm ci
npm start
```

Use a compatible Expo Go version on a phone or emulator. See the [project README](REACTNATIVE/movie-reference/README.md) for platform setup, architecture, validation commands, API behavior, and limitations.

## Adding a project

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep examples small enough to study and explain during an interview. These are learning references; adapt them to the requirements and rules of your actual challenge.
