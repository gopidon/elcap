/**
 * Created by gopi on 1/14/17.
 */
import ApolloClient, { createNetworkInterface } from 'apollo-client'
const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    networkInterface: createNetworkInterface({
        uri: 'https://api.graph.cool/simple/v1/cixlg7sc818wu01777l47joao'
    }),
});

export default client;