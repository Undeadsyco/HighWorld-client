import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
 
import App from './App';

const httpLink = createHttpLink({
  uri: 'https://radiant-crag-82065.herokuapp.com/'
});

const authLink = setContext(() => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const Provider = () => {
  return(
<ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  )
}

export default Provider