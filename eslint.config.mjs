import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTypescript,
	prettier,
	globalIgnores([
		'.next/**',
		'out/**',
		'build/**',
		'.turbo/**',
		'node_modules/**',
		'next-env.d.ts',
	]),
	{
		// Customização de regras TypeScript
		rules: {
			// Permitir variáveis prefixadas com _ (convenção para intencionalmente não usadas)
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},
]);

export default eslintConfig;
