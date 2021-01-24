
const mongoose = require("mongoose");
const Store = mongoose.Schema({
    _id: String,
    Maitrise2 : String,
    Maitrise3 : String,
    Maitrise4 : String,
    Maitrise5 : String,
    Maitrise6 : String,
    Maitrise7 : String,
    Maitrise8 : String,
    Maitrise9 : String,
    Maitrise10 : String,
    Maitrise11 : String,
    Maitrise12 : String,
    Maitrise13 : String,
    Maitrise14 : String,
    Maitrise15 : String,
    Maitrise16 : String,
    Maitrise17 : String,
    Maitrise18 : String,
    Maitrise19 : String,
    Maitrise20 : String,
    time: Date
});

module.exports = mongoose.model("Boutique", Store);
