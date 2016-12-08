'use strict';

/**
 * Created by ekerot on 2016-12-02.
 */

let mongoose = require("mongoose");

//defining a schema for the Snippets
let snippetSchema = mongoose.Schema
({
    name: {type: String, required: true},
    snippet: {type: String, required: true},
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

let SnippetDB = mongoose.model("SnippetDB", snippetSchema);

// export the object
module.exports = SnippetDB;
