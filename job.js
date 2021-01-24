const mongoose = require("mongoose");

const ListeJob = mongoose.Schema({
    _id: String,
    Souverain : Number,
    Princesse : Number,
    Pretresse : Number,
    AgentSecret : Number,
    Probender : Number,
    Soldat : Number,
    Commercant : Number,
    Ministre : Number,
    Mafieux : Number,
    Journaliste : Number,
    Artiste : Number,
    Moine : Number,
    CouteauSuisse : Number,
    Jobless : Number,
    time: Date
});

module.exports = mongoose.model("job", ListeJob);