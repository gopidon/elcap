/**
 * Created by gopi on 1/8/17.
 */
import React from 'react';
import { Link, Switch, Route  } from 'react-router-dom';

export default class NotFoundPage extends React.Component {
    render() {
        return (
            <div className="not-found">
                <h1>404</h1>
                <h2>Page not found!</h2>
                <Link to="/">Go back to the main page</Link>
            </div>
        );
    }
}