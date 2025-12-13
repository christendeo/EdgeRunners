import { ApolloProvider } from '@apollo/client/react';
import client from '../lib/apollo';
import "@/styles/globals.css";
import Layout from "../components/Layout.jsx";

// For user authentication
import { AuthProvider } from "../lib/userAuthContext";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
        <AuthProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AuthProvider>
    </ApolloProvider>
  );
}
