import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const apolloClient = new ApolloClient({
	uri: 'https://graphql-pokeapi.graphcdn.app/',
	cache: new InMemoryCache()
});

export default apolloClient;
