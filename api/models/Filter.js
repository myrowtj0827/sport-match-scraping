const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Brand schema
 */
const FilterSchema = new Schema({
    id: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    league: {
        type: String,
        required: false,
    },
    matchYear: {
        type: String,
        required: false,
    },
    teamA: {
        type: String,
        required: false,
    },
    teamB: {
        type: String,
        required: false,
    },
    matchDate: {
        type: String,
        required: false,
    },
    finalScore: {
        type: String,
        required: false,
    },
    historiesFirstHalf: {
        type: String,
        required: false,
    },
    historiesSecondHalf: {
        type: String,
        required: false,
    },
    final1X2: {
        type: String,
        required: false,
    },
    overUnder: {
        type: String,
        required: false,
    },
    gol: {
        type: String,
        required: false,
    },

});

module.exports = Filter = mongoose.model("filters", FilterSchema);
