import { ApolloProvider } from '@apollo/client/react';
import client from '../lib/apollo';
import "@/styles/globals.css";
import Layout from "../components/Layout.jsx";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
        <Layout>
            <Component {...pageProps} />
        </Layout>
    </ApolloProvider>
  );
}
