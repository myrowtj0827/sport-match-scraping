const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Brand schema
 */
const FilterSchema = new Schema({
    // product_photo: {
    //     type: String,
    //     required: false,
    // },
    //
    // product_id: {
    //     type: String,
    //     required: false,
    // },
    //
    // product_category: {
    //     type: String,
    //     required: false,
    // },
    //
    // product_name: {
    //     type: String,
    //     required: false,
    // },
    //
    // product_description: {
    //     type: String,
    //     required: false,
    // },
    //
    // product_price: {
    //     type: Number,
    //     required: false,
    // },
    //
    // product_store_address: {
    //     type: String,
    //     required: false,
    // },

    scraping_id: {
        type: String,
        required: true,
    },

    scraping_store_address: {
        type: String,
        required: true,
    },

    scraping_photo_link: {
        type: String,
        required: true,
    },

    scraping_category: {
        type: String,
        required: false,
    },

    scraping_name: {
        type: String,
        required: false,
    },

    scraping_description: {
        type: String,
        required: false,
    },

    scraping_price: {
        type: Number,
        required: false,
    },

    scraping_thumbnail_Link : {
        type: String,
        required: false,
    }
});

module.exports = Filter = mongoose.model("filters", FilterSchema);
