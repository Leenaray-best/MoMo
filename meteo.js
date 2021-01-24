const mongoose = require("mongoose");
const Weather = mongoose.Schema({
    _id: String,
    PoleNord : String,
    TempleAus : String,
    NationFeu : String,
    TempleOcc : String,
    BaSingSe : String,
    Omashu : String,
    Marais : String,
    Desert : String,
    TempleOr : String,
    IleKyoshi : String,
    TempleBor : String,
    PoleSud : String,
    Nuit: String,
    CounterLune : Number,
    time: Date
});

module.exports = mongoose.model("Meteo", Weather);
