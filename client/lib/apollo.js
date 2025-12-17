import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const authLink = new ApolloLink((operation, forward) => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('fuelme_token') : null;

	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}));

	return forward(operation);
});

const httpLink = new HttpLink({
	uri: 'http://localhost:4000'
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;