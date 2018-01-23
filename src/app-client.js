/**
 * Created by gopi on 1/8/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import {ApolloClient} from 'apollo-client'
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache} from 'apollo-cache-inmemory';
import 'antd/dist/antd.css';
import './css/style.css';
import Layout from './components/Layout';



/*window.onload = () => {
    ReactDOM.render(<AppRoutes/>, document.getElementById('main'));
};*/

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjcqx7ycu2zm20188mm0ptkmi' })

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

window.onload = () => {
    doRender()
};

function doRender() {
    const main = document.getElementById('main');
    const renderOrHydrate = main.innerHTML.trim().length ? 'hydrate' : 'render';
    //console.log(renderOrHydrate);
    ReactDOM[renderOrHydrate](
        <BrowserRouter>
            <ApolloProvider client={client}>
                <Layout />
            </ApolloProvider>
        </BrowserRouter>,
        main
    );
}

