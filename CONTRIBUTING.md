# Contributing

Thanks for your interest in contributing to Caroline!

## How to Contribute

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/caroline.git`
3. **Create a branch**: `git checkout -b feat/your-feature-name`
4. **Make your changes**
5. **Run checks locally**:
   ```bash
   pnpm check
   pnpm lint
   ```
6. **Commit** with a clear message
7. **Push** to your fork: `git push origin feat/your-feature-name`
8. **Open a Pull Request** against the `main` branch

## Pull Request Guidelines

- Keep PRs focused — one feature/fix per PR
- Write a clear description of what and why
- Make sure CI passes (lint + typecheck)
- Update README if your change adds/modifies functionality

## Code Style

- TypeScript strict mode
- Svelte 5 Runes API (no legacy `$:` syntax)
- Prettier + ESLint — run `pnpm format` before committing

## Questions?

Open a [Discussion](https://github.com/your-username/caroline/discussions) first before submitting a PR for major changes.
