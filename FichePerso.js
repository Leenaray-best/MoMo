const mongoose = require("mongoose");

const Perso = mongoose.Schema({
    _id: String,
    Username: String,
    Identite :{
        Nom : String,
        Prenom : String,
        Age : Number, 
        Sexe : String,
        Metier : String,
        Categorie : String,
    },
    GainCompetence : Number,
    NiveauDeMaitrise : Number,
    NiveauXP : Number,
    Qualite : [String,String],
    Defaut :String,
    Faiblesse :[String,String],
    Competence : {
        Force : Number,
        Constitution : Number,
        Charisme : Number, 
        Intelligence : Number, 
        Sagesse : Number, 
        Dexterite : Number
    },
    LienFichePerso : String,
    time: Date
});

module.exports = mongoose.model("FichePerso", Perso);