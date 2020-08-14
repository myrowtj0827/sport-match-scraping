import React, { Component } from 'react';
import { connect } from "react-redux";

import { gettingLink, gettingData } from "../redux/actions/filter/scrapingProduct";

import $ from 'jquery';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';


class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            link: '',
        }
    };

    scrapingData = () => {
        const {
            gettingLink
        } = this.props;

        gettingLink(this.state);
    };

    scrapingShowing = () => {
        const  {
            gettingData
        } = this.props;

        gettingData(this.state);
    };

    render() {

        return (
            <>

                <section className="logo-search min-width">
                    <div className="w3-btn w3-yellow w3-hover-blue" onClick={this.scrapingData} style={{marginTop: '40px'}}>Scraping Start</div>


                    <div className="w3-btn w3-yellow w3-hover-blue" onClick={this.scrapingShowing} style={{marginTop: '40px'}}>Scraping Showing</div>
                </section>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // productList: state.filter.productList,
        scrapingList: state.scrapingProduct.scrapingList,
    }
};

export default connect(
    mapStateToProps,
    {
        gettingLink,
        gettingData,
    }
)(Home);
