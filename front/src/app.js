import React, { Component } from 'react';
// import axios from "axios"

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import SearchFilter from "./search/searchFilter";
import Home from "./home/home";


class App extends React.Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // axios.get("https://jsonplaceholder.typicode.com/users/2")
        //     .then(response => {
        //         console.log(response.data)
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     })
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home} key="home" />
                    <Route exact path="/searchFilter" component={SearchFilter} key="searchFilter" />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
