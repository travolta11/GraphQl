import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:8082/graphql', 
        credentials: 'include', 
    }),
    cache: new InMemoryCache(),
});

export default client;
