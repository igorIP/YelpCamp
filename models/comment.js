var mongoose = require("mongoose");

var commentsSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User"
        },
        username:String
    }
});

module.exports = mongoose.model("Comment",commentsSchema);