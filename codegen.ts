import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'https://graphql-pokeapi.graphcdn.app',
	documents: ['src/**/*.ts'],
	ignoreNoDocuments: true,
	generates: {
		'./src/graphql/': {
			preset: 'client',
			config: {
				useTypeImports: true
			}
		},
		'./schema.graphql': {
			plugins: ['schema-ast'],
			config: {
				includeDirectives: true
			}
		}
	}
};

export default config;
