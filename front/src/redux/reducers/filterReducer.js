import {
    PRODUCT_ALL,
    SET_CURRENT_PRODUCT,
    SET_SORT_PRODUCT,
    SCRAPING_FORM_API,
    SCRAPING_PRODUCT_ALL,
    SET_SCRAPING_SORT_PRODUCT,
    SET_SCRAPING_DELETE
} from "../actions/types/types"

const initialState = {
    product: {},
    productList: [],
    scrapingProduct: [],
    scrapingProductList: []
};

export default function (state = initialState, action) {
    switch(action.type){
        case SET_CURRENT_PRODUCT:
            return {
                ...state,
                product: action.payload
            };
        case PRODUCT_ALL:
            return {
                ...state,
                productList: action.payload
            };
        case SET_SORT_PRODUCT:
            return {
                ...state,
                productSortList: action.payload
            };

        case SCRAPING_FORM_API:
            return {
                ...state,
                scrapingProduct: action.payload
            };

        case SCRAPING_PRODUCT_ALL:
            return {
                ...state,
                scrapingList: action.payload
            };

        case SET_SCRAPING_SORT_PRODUCT:
            return {
                ...state,
                scrapingSortList: action.payload
            };

        default:
            return state;
    }
}
