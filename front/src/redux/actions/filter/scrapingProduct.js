import axios from "axios";
import config from "../../../config/index"

import {
    SCRAPING_FORM_API,
} from "../types/types";

export const gettingLink = () => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/scrapingProduct/scraping-product")
        .then(res => {
            alert('success');
            console.log(res);
        })
        .catch(err => {
            alert('Failed - Back end turned off !');
            dispatch({
                type: SCRAPING_FORM_API,
                payload: err.response ? err.response.data : {error: "error"}
            });
        })
};

export const gettingData = () => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/scrapingProduct/get-all")
        .then(res => {
            alert('success');
            console.log(res.data.results);
        })
        .catch(err => {
            alert('Failed - Back end turned off !');
            dispatch({
                type: SCRAPING_FORM_API,
                payload: err.response ? err.response.data : {error: "error"}
            });
        })
};
