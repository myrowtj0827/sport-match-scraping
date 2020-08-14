// import external modules
import { combineReducers } from "redux";
// import internal(own) modules
import filterReducer from "./filterReducer";

const rootReducer = combineReducers({
    filter: filterReducer,
    scrapingProduct: filterReducer
});

export default rootReducer;
