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
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Layout from './components/Layout';
import Environment from './utils/env';



/*window.onload = () => {
    ReactDOM.render(<AppRoutes/>, document.getElementById('main'));
};*/

const httpLink = new HttpLink({ uri: Environment.GCOOL_ENDPOINT})

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

