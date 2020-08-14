import axios from "axios";
import config from "../../../config/index"

import {
    MESSAGE_FORM_API,
    SET_SORT_PRODUCT
} from "../types/types";

export const SortProduct = (category, history) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/filters/get-product-sort", {category})
        .then(res => {
            dispatch({
                type: SET_SORT_PRODUCT,
                payload: res.data.results,
            });

        })
        .catch(err => {
            alert('fail-category');
            dispatch({
                type: MESSAGE_FORM_API,
                payload: err.response ? err.response.data : {error: "error"}
            });
        })
};
