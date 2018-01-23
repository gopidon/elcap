import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import open from 'open';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router'
import bodyParser from 'body-parser';
require('fetch-everywhere');

import {ApolloClient} from 'apollo-client'
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache} from 'apollo-cache-inmemory';
import Layout from './components/Layout';

import webpack from 'webpack';
import config from '../webpack.config.dev';

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
const compiler = webpack(config);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// universal routing and rendering
app.get('*', (req, res) => {
    const context = {}
    const link = createHttpLink({
        uri: 'https://api.graph.cool/simple/v1/cixlg7sc818wu01777l47joao',
        credentials: 'same-origin'
    })
    const client = new ApolloClient({
        link,
        cache: new InMemoryCache(),
        ssrMode: true,
    });

    const markup = renderToString(
        <StaticRouter
            location={req.url}
            context={context}
        >
            <ApolloProvider client={client}>
                <Layout/>
            </ApolloProvider>
        </StaticRouter>
    )

    if (context.url) {
        return res.redirect(302, context.url);
    }
    else {
        return res.render('index', { markup });
    }
});



// start the server
const port = process.env.PORT || 8000;
const env = process.env.NODE_ENV || 'dev';
server.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    else{
        open(`http://localhost:${port}`);
    }
    console.info(`Server running on http://localhost:${port} [${env}]`);
});