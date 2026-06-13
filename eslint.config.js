import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import ts from 'typescript-eslint';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: [
			'**/.svelte-kit/**',
			'**/build/**',
			'**/drizzle/meta/**',
			'**/src/paraglide/**',
			'**/src/lib/paraglide/**',
			'**/project.inlang/cache/**',
			'**/node_modules/**'
		]
	},
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	prettier,
	svelte.configs['flat/prettier'],
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.ts'],
		ignores: ['.config/**'],
		rules: {}
	},
	{
		rules: {}
	}
);
