var auth = require('./auth.json');
var cron = require('node-cron');
const Discord = require('discord.js');
const client = new Discord.Client();
const counterMot = require('letter-count');
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
/*mongoose.connect('mongodb+srv://Leena:Vincent_7@cluster0.x32ne.mongodb.net/RolesPlayAvatar',{ useNewUrlParser: true, useUnifiedTopology: true });*/
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
/*mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }() => { }).catch(err => console.log(err));*/
mongoose.set('useFindAndModify', false);


const FichePerso = require("./FichePerso.js");
const BoutiqueMaitrise = require("./Boutique.js");
const Weather = require("./meteo.js");
const ListeMetier = require("./job.js");
const prefixFiche = "ficheperso";
const prefixMaitrise = "roll-maitrise";
const prefixXP= "monxp"
const prefixCarte= "carte"
const prefixremoveXP = "removexp"
const prefixgiveXP = "givexp"
const prefixMaFiche = "mafiche"
const prefixresetXP = "resetallxp"
const prefixResetFiche = "resetfiche"
const prefixCreateFicheStep1= "remplirfiche1"
const prefixCreateFicheStep2= "remplirfiche2"
const prefixCreateFicheStep3= "remplirfiche3"
const prefixCreateFicheStep4= "remplirfiche4"
const prefixBoutique= "store"
const prefixRoll= "roll"
const prefixRollBasique = "rand"
const prefixAchatBoutique= "buy"
const prefixDegat= "rolldegats"
const prefixLevel= "check-levels"
const prefixWhatWeather= "check-meteo"
const prefixUpdateFiche = "updatefiche"
const prefixAjoutCompetence = "newcompetence"
const SalaireCat0= 0
const SalaireCat6= 150
const SalaireCat1 = 200
const SalaireCat2 = 300
const SalaireCommercant = 150
const SalaireCat3 = 400
const SalaireCat4 = 450
const SalaireCat5 = 500
var CountLune;

client.login(process.env.BOT_TOKEN);
client.on('ready', () => {
	createBoutique();
	createJobList();
	createWeather();
  console.log(`Logged in as ${client.user.tag}!`);
});

//Delivrance quotidienne des salaires
//const test0 = '16 11 * * *';
//cron.schedule(test0, async () => 
//{
cron.schedule('0 7 * * *', async () => {
    const guildRP = client.guilds.cache.get(auth.guildRP);
    const channel = client.channels.cache.get(auth.Salon.Jet);

    var fichesCollect = await FichePerso.find({});
	var numberFiche = fichesCollect.length;

	var ficheCollectZ0 = await FichePerso.findOne({_id: fichesCollect[0]._id});
	var TableauAllXp = [];
		for (var zz = 0; zz < numberFiche; zz++) 
		{	
			console.log("nom n°"+(zz+1)+" : "+fichesCollect[zz].Username);
			var ficheCollectZ = await FichePerso.findOne({_id: fichesCollect[zz]._id});
			var ValueXPz = ficheCollectZ.NiveauXP;
			var Usernamez = ficheCollectZ.Username;
			TableauAllXp.push([Usernamez,ValueXPz])
        }
	console.log(TableauAllXp)
	var TableauFinal = TableauAllXp.sort(([a, b], [c, d]) => a - c || d - b);
	console.log(TableauFinal)
	var tailletableau = TableauFinal.length;
	var texte = "";
		for (var zz = 0; zz < numberFiche; zz++) 
		{
			texte = texte+TableauFinal[zz][0]+ " : " + TableauFinal[zz][1] + " Xp \r";
		}
	const exampleEmbed1 = new Discord.MessageEmbed()
            .setColor('#16EF0E')
            .setTitle("Tableau de l'XP avant salaires")
            .setDescription(texte)
            channel.send(exampleEmbed1);

	var z;
		for (z = 0; z < numberFiche; z++) 
		{

	        console.log("nom n°"+(z+1)+" : "+fichesCollect[z].Username);

	        var ficheCollectZ = await FichePerso.findOne({_id: fichesCollect[z]._id});
	        var idZ = ficheCollectZ.Identite.Categorie
	        console.log(idZ)
	        console.log(ficheCollectZ.NiveauXP +" XP")
					if(idZ==auth.RoleRP.CouteauSuisse)
					{
						console.log("XP avant:"+ficheCollectZ.NiveauXP);
						var SalaryXP =  ficheCollectZ.NiveauXP + Number(SalaireCat6);
						console.log(SalaryXP)
						await FichePerso.findOneAndUpdate({_id: fichesCollect[z]._id}, {NiveauXP : SalaryXP});
						console.log("Salaire"+ SalaryXP);

					}
	        		 if(idZ==auth.RoleRP.Moine || idZ==auth.RoleRP.Artiste || idZ==auth.RoleRP.Journaliste || idZ==auth.RoleRP.Mafieux|| idZ==auth.RoleRP.Probender|| idZ==auth.RoleRP.Pretresse )
	                {
		                console.log("XP avant:"+ficheCollectZ.NiveauXP);
		                var SalaryXP =  ficheCollectZ.NiveauXP + Number(SalaireCat1);
		                console.log(SalaryXP)
		                await FichePerso.findOneAndUpdate({_id: fichesCollect[z]._id}, {NiveauXP : SalaryXP});
		                console.log("Salaire"+ SalaryXP);

	                }
	                if(idZ==auth.RoleRP.Commercant)            
	                {
		                console.log("XP avant:"+ficheCollectZ.NiveauXP);
						var NumRand = Number(Rand(SalaireCommercant))
						console.log("Tirage random commercant"+ Number(NumRand));
		                var SalaryXP =  ficheCollectZ.NiveauXP + Number(NumRand)+ Number(150) ;
		                await FichePerso.findOneAndUpdate({_id: fichesCollect[z]._id}, {NiveauXP : SalaryXP});
		                console.log("Salaire"+ Number(SalaryXP));

	                }

	                if(idZ==auth.RoleRP.Soldat)
	                {
		                console.log("XP avant:"+ficheCollectZ.NiveauXP);
		                var SalaryXP =  ficheCollectZ.NiveauXP + Number(SalaireCat2) ;
		                await FichePerso.findOneAndUpdate({_id: fichesCollect[z]._id}, {NiveauXP : SalaryXP});
		                console.log("Salaire"+ SalaryXP);

	                }

	                if(idZ==auth.RoleRP.AgentSecret || idZ==auth.RoleRP.Ministre )
	                {
		                console.log("XP avant:"+ficheCollectZ.NiveauXP);
		                var SalaryXP =  ficheCollectZ.NiveauXP + Number(SalaireCat3);
		                await FichePerso.findOneAndUpdate({_id: fichesCollect[z]._id}, {NiveauXP : SalaryXP});
		                console.log("Salaire"+ SalaryXP);

	                }
	                 if(idZ==auth.RoleRP.Princesse)
	                {
		                console.log("XP avant:"+ficheCollectZ.NiveauXP);
		                var SalaryXP =  ficheCollectZ.NiveauXP + Number(SalaireCat4);
		                await FichePerso.findOneAndUpdate({_id: fichesCollect[z]._id}, {NiveauXP : SalaryXP});
		                console.log("Salaire"+ SalaryXP);

	                }
	                 if(idZ==auth.RoleRP.Souveraine)
	                {
		                console.log("XP avant:"+ficheCollectZ.NiveauXP);
		                var SalaryXP =  ficheCollectZ.NiveauXP + Number(SalaireCat5);
		                await FichePerso.findOneAndUpdate({_id: fichesCollect[z]._id}, {NiveauXP : SalaryXP});
		                console.log("Salaire"+ SalaryXP);

	                }
	                 if(idZ==auth.RoleRP.Jobless)
	                {
		                console.log("XP avant:"+ficheCollectZ.NiveauXP);
		                var SalaryXP =  ficheCollectZ.NiveauXP + Number(SalaireCat0);
		                await FichePerso.findOneAndUpdate({_id: fichesCollect[z]._id}, {NiveauXP : SalaryXP});
		                console.log("Salaire"+ SalaryXP);

	                }
	               

        }
	channel.send("Les salaires ont ete mis a jour !")
	var fichesCollect = await FichePerso.find({});
	var numberFiche = fichesCollect.length;

	var ficheCollectZ0 = await FichePerso.findOne({_id: fichesCollect[0]._id});
	var TableauAllXp = [];
		for (var zz = 0; zz < numberFiche; zz++) 
		{	
			console.log("nom n°"+(zz+1)+" : "+fichesCollect[zz].Username);
			var ficheCollectZ = await FichePerso.findOne({_id: fichesCollect[zz]._id});
			var ValueXPz = ficheCollectZ.NiveauXP;
			var Usernamez = ficheCollectZ.Username;
			TableauAllXp.push([Usernamez,ValueXPz])
        }
	console.log(TableauAllXp)
	var TableauFinal = TableauAllXp.sort(([a, b], [c, d]) => a - c || d - b);
	console.log(TableauFinal)
	var tailletableau = TableauFinal.length;
	var texte = "";
		for (var zz = 0; zz < numberFiche; zz++) 
		{
			texte = texte+TableauFinal[zz][0]+ " : " + TableauFinal[zz][1] + " Xp \r";
		}
	const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#16EF0E')
            .setTitle("Tableau de l'XP apres salaires")
            .setDescription(texte)
            channel.send(exampleEmbed);
});

//const test0 = '17 23 * * *';
//cron.schedule(test0, async () => 
//{
cron.schedule('0 7 * * *', async () => {
    const guildRP = client.guilds.cache.get(auth.guildRP);
    const channel = client.channels.cache.get(auth.Salon.Meteo);
	var tableauMeteo1 = ['☀️','☁️','🌤️','🌧️','☀️','☁️','🌤️','🌧️'];
	var tableauMeteo2 = ['☁️','🌫️','🌧️','🌫️','🌫️','🌫️','🌫️','🌧️'];
	var tableauMeteo3 = ['🌨️','☁️','🌨️','🌧️','🌧️','🌨️','🌨️','🌨️'];
	var tableauNuit = ['🌑','🌒','🌒','🌓','🌔','🌔','🌕','🌖','🌖','🌗','🌘']
	var tableauSang = ['🌕',auth.Emote.bloodmoon,'🌕']
	var WeatherNord = tableauMeteo3[Math.floor(Math.random()*8)];
	var WeartherTempAus = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeartherNationFeu = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeartherTempOcc = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeartherBahSing = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeartherOmashu = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeatherMarais = tableauMeteo2[Math.floor(Math.random()*8)];	
	var WeartherDesert = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeartherTempOr = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeartherKyoshi = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeartherTempBor = tableauMeteo1[Math.floor(Math.random()*8)];
	var WeatherSud = tableauMeteo3[Math.floor(Math.random())];
	channel.send(`**Bulletin meteo du jour**  

__Pole Nord__ : ` + WeatherNord+ `
__Temple de l'air austral__: ` + WeartherTempAus+ `
__Nation du feu__: ` + WeartherNationFeu +`
__Temple de l'air occidental__: ` + WeartherTempOcc +`
__Ba Sing Se__: ` + WeartherBahSing +`
__Omashu__: ` + WeartherOmashu +`
__Marais__ : ` + WeatherMarais+ `
__Desert__: ` + WeartherDesert +`
__Temple de l'air Oriental__: ` + WeartherTempOr +`
__Ile de Kyoshi__: ` + WeartherKyoshi +`
__Temple de l'air boreal__: ` + WeartherTempBor +`
__Pole Sud__ : `+ WeatherSud)

	await Weather.findOneAndUpdate({_id: "152579868"},{PoleNord: WeatherNord, TempleAus: WeartherTempAus, NationFeu: WeartherNationFeu, TempleOcc: WeartherTempOcc, BaSingSe: WeartherBahSing, Omashu: WeartherOmashu, Marais: WeatherMarais, Desert: WeartherDesert, TempleOr: WeartherTempOr, IleKyoshi: WeartherKyoshi, TempleBor: WeartherTempBor, PoleSud: WeatherSud});
	var FicheLune = await Weather.findOne({_id: "152579868"});
	CountLune = FicheLune.CounterLune;
	CountLune = CountLune + Number(1);

	if (CountLune == 11){CountLune=Number(0);}

	if (CountLune==6)
	{
		var LuneBloodOrNot = tableauSang[Math.floor(Math.random()*2)];
		console.log(LuneBloodOrNot);
		channel.send(`**Bulletin de la nuit (a partir de 19h)**

__Lune__ : ` +LuneBloodOrNot)
		await Weather.findOneAndUpdate({_id: "152579868"}, {Nuit : LuneBloodOrNot})
	}
	else
	{
		console.log("CountLune : "+CountLune);
	channel.send(`**Bulletin de la nuit (a partir de 18h)**

__Lune__ : ` +tableauNuit[CountLune])
		await Weather.findOneAndUpdate({_id: "152579868"}, {Nuit : tableauNuit[CountLune]})
	}

	await Weather.findOneAndUpdate({_id: "152579868"}, {CounterLune : CountLune});

});

client.on('message', async function (message, user) 
{

  petitMessage = message.content.toLowerCase();

  	if (message.author.bot) return;

  	//Commande dans salon JetDeDes focntion de Maitrise et creation de la fiche perso du joueur
	if (message.channel.id==auth.Salon.JetDeDes)
	{
		//Fonction Maitrise
		if (petitMessage === prefixMaitrise) {

	  		if (message.member.roles.cache.has(auth.RoleRP.Bienvenue))
	  		{
	  			if (message.member.roles.cache.has(auth.RoleRP.Maitrise1) || message.member.roles.cache.get(auth.RoleRP.Maitrise2)||message.member.roles.cache.get(auth.RoleRP.Maitrise3))
	  			{
	  				message.reply("La commande se fait une seule fois");
	  			} else {
	  				Niveau= Rand(3);
	  				switch (Niveau) {
	  					case 1: message.member.roles.add(auth.RoleRP.Maitrise1);
	  							message.member.roles.remove(auth.RoleRP.Bienvenue);
	  						var gifMaitrise = "https://tenor.com/view/avatar-the-last-airbender-aang-airbending-goofy-funny-gif-13514465";
	  						break;
	  					case 2: message.member.roles.add(auth.RoleRP.Maitrise2);
	  							message.member.roles.remove(auth.RoleRP.Bienvenue);
	  						var gifMaitrise = "https://cdn.discordapp.com/attachments/594824367733604361/797169637946687488/firebend___cooking.gif";
	  						break;
	  					case 3: message.member.roles.add(auth.RoleRP.Maitrise3);
	  							message.member.roles.remove(auth.RoleRP.Bienvenue);
	  						var gifMaitrise = "https://cdn.discordapp.com/attachments/594824367733604361/797169079411671071/Waterbend___trempli_attaque.gif";
	  						break;
	  					default :
	  						break;
	  								}
	  			await message.reply('Tu as une maitrise de niveau ' + Niveau +' ! ');
	  			await client.channels.cache.get(auth.Salon.JetDeDes).send(gifMaitrise);
	  			await createFichePerso(message,Niveau);
	  					}
	  		}    
		}
	}

	// Commande pour la carte
	if (message.channel.id==auth.Salon.Jet && petitMessage === prefixCarte)
	{
		var gifCarte = "https://cdn.discordapp.com/attachments/641015662118174730/843501620172292096/map2.jpg";
	  	await client.channels.cache.get(auth.Salon.Jet).send(gifCarte);
	}

	// COMMANDE POUR LES ADMINS
	//Fonction affichage fiche pour admin
	if (message.channel.id==auth.Salon.GestionFiche || message.channel.id==auth.Salon.SalonBotAdmin)
	{
		console.log("2")
		if (petitMessage.startsWith(prefixFiche) && message.member.roles.cache.has(auth.RoleRP.RoleStaff)) 
		{	console.log("3");
			const taggedUser = message.mentions.users.first();
			console.log(taggedUser)
			if (!taggedUser) return message.author.send("Vous n'avez pas saisi de pseudo à chercher.").then(msg => msg.delete({ timeout: 10000 }));
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
			var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
			console.log(fiche)
			const listeQualite=fiche.Qualite;
			const listeFaiblesse=fiche.Faiblesse;			
			console.log(listeQualite)
			console.log(listeFaiblesse)
			const exampleEmbed = new Discord.MessageEmbed()
	            .setColor('#16EF0E')
	            .setTitle("Fiche de " +fiche.Username)
	            .setDescription(`Nom : `+fiche.Identite.Nom+`
	                         Prenom : `+fiche.Identite.Prenom+`
	                         Age: `+fiche.Identite.Age+`
	                         Metier : `+fiche.Identite.Metier+`
	                         Niveau de Maitrise : `+fiche.NiveauDeMaitrise+`
	                         Niveau XP : `+fiche.NiveauXP+`
	                         Point de Competence : `+fiche.GainCompetence+`
	                         Faiblesse : `+listeFaiblesse[0]+`, `+listeFaiblesse[1])
	            .addFields(
                    { name : `Qualite 1`, value : listeQualite[0], inline : true},
                    { name : `Qualite 2`, value : listeQualite[1], inline : true},
                    { name : `Defaut 1`, value : fiche.Defaut, inline : true}
                )
                .addFields(
                    { name : `Force`, value : fiche.Competence.Force, inline : true},
                    { name : `Constitution`, value : fiche.Competence.Constitution, inline : true},
                    { name : `Charisme`, value : fiche.Competence.Charisme, inline : true}
                )
                .addFields(
                    { name : `Intelligence`, value : fiche.Competence.Intelligence, inline : true},
                    { name : `Sagesse`, value : fiche.Competence.Sagesse, inline : true},
                    { name : `Dexterite`, value : fiche.Competence.Dexterite, inline : true}
                )
                .addFields(
                    { name : `Lien Gdoc`, value : fiche.LienFichePerso, inline : true}
                )
                .setThumbnail(taggedUser.avatarURL())
	            message.channel.send(exampleEmbed);
		}
	}

	//Fonction reset fiche pour admin
	if (message.channel.id==auth.Salon.GestionFiche || message.channel.id==auth.Salon.SalonBotAdmin)
	{
		console.log("2")
		if (petitMessage.startsWith(prefixResetFiche) && message.member.roles.cache.has(auth.RoleRP.RoleStaff)) 
		{	console.log("3");
			const taggedUser = message.mentions.users.first();
			console.log(taggedUser)
			if (!taggedUser) return message.author.send("Vous n'avez pas saisi de pseudo à chercher.").then(msg => msg.delete({ timeout: 10000 }));
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
			var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
			console.log(fiche)
			await FichePerso.findOneAndDelete({_id: taggedUser.id});
	        message.channel.send("La fiche a ete detruite, enlever tout les roles lies au RolePlay et celui de Maitrise. Lui mettre le role Bienvenue et lui faire retirer sa maitrise");
		}
	}

	//Commande pour donner de l'XP a un joueur PAR UN ADMIN
	if ((message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin) && message.member.roles.cache.has(auth.RoleRP.RoleStaff) && petitMessage.startsWith(prefixgiveXP))
	{
		const taggedUser = message.mentions.users.first();
		const argsNumber = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
		var Quantity = argsNumber.join(' '); // Amount of Joker
			if (!Quantity) Quantity=0;
			if (isNaN(Quantity)) Quantity=0;
			if (!taggedUser) return message.author.send("Vous n'avez pas saisi de pseudo à chercher.").then(msg => msg.delete({ timeout: 10000 }));
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		var NewXP = fiche.NiveauXP + Number(Quantity)
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{NiveauXP: NewXP});
		client.channels.cache.get(auth.Salon.SalonBotAdmin).send("<@"+taggedUser.id+"> a gagne " + Quantity + " XP");
	}

	//Commande pour retirer de l'XP a un joueur PAR UN ADMIN
	if ((message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin) && message.member.roles.cache.has(auth.RoleRP.RoleStaff) && petitMessage.startsWith(prefixremoveXP))
	{
		const taggedUser = message.mentions.users.first();
		const argsNumber = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
		var Quantity = argsNumber.join(' '); // Amount of Joker
			if (!Quantity) Quantity=0;
			if (isNaN(Quantity)) Quantity=0;
			if (!taggedUser) return message.author.send("Vous n'avez pas saisi de pseudo à chercher.").then(msg => msg.delete({ timeout: 10000 }));
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		var NewXP = fiche.NiveauXP-Quantity
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{NiveauXP: NewXP});
		client.channels.cache.get(auth.Salon.SalonBotAdmin).send("<@"+taggedUser.id+"> a perdu " + Quantity + " XP");
	}

	//Fonction pour set up la fiche Nom/Prenom/Age/Sexe/Metier
	if (message.channel.id==auth.Salon.GestionFiche && message.member.roles.cache.has(auth.RoleRP.RoleStaff) && petitMessage.startsWith(prefixCreateFicheStep1))
	{
		const taggedUser = message.mentions.users.first();
			if (!taggedUser) return message.channel.send("remplirfiche1 @joueur Prenom Nom Age Sexe @RoleCategorie Metier.");
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
		const argIdPrenom = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
		const argIdNom = message.content.split(' ').slice(3); // All arguments behind the command name with the prefix
		const argIdAge = message.content.split(' ').slice(4); // All arguments behind the command name with the prefix
		const argIdSexe = message.content.split(' ').slice(5); // All arguments behind the command name with the prefix
		const argIdCat = message.content.split(' ').slice(6);
		const argIdCat1 = argIdCat[0].split('&');
		const realID = argIdCat1[1].split('>');
		console.log(realID);
		const argIdJob = message.content.split(' ').slice(7).join(' '); // All arguments behind the command name with the prefix
		console.log(argIdJob)
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		NewPrenom=argIdPrenom[0];
		NewNom=argIdNom[0];
		NewAge=argIdAge[0];
		NewSexe=argIdSexe[0];
		NewCat= realID[0];
		NewMetier=argIdJob;
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Identite.Prenom': NewPrenom , 'Identite.Nom': NewNom, 'Identite.Age': NewAge, 'Identite.Sexe': NewSexe, 'Identite.Metier': NewMetier, 'Identite.Categorie': NewCat});
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		console.log(fiche)
		const listeQualite=fiche.Qualite;
		const listeFaiblesse=fiche.Faiblesse;			
		console.log(listeQualite)
		console.log(listeFaiblesse)
		const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#16EF0E')
            .setTitle("Fiche de "+fiche.Username)
            .setDescription(`Nom : `+fiche.Identite.Nom+`
                         Prenom : `+fiche.Identite.Prenom+`
                         Age: `+fiche.Identite.Age+`
                         Sexe: `+fiche.Identite.Sexe+`
                         Metier : `+fiche.Identite.Metier+`
                         Niveau de Maitrise : `+fiche.NiveauDeMaitrise+`
                         Niveau XP : `+fiche.NiveauXP+`
                         Point de Competence : `+fiche.GainCompetence+`
                         Faiblesse : `+listeFaiblesse[0]+`, `+listeFaiblesse[1])
            .addFields(
                { name : `Qualite 1`, value : listeQualite[0], inline : true},
                { name : `Qualite 2`, value : listeQualite[1], inline : true},
                { name : `Defaut 1`, value : fiche.Defaut, inline : true}
            )
            .addFields(
                { name : `Force`, value : fiche.Competence.Force, inline : true},
                { name : `Constitution`, value : fiche.Competence.Constitution, inline : true},
                { name : `Charisme`, value : fiche.Competence.Charisme, inline : true}
            )
            .addFields(
                { name : `Intelligence`, value : fiche.Competence.Intelligence, inline : true},
                { name : `Sagesse`, value : fiche.Competence.Sagesse, inline : true},
                { name : `Dexterite`, value : fiche.Competence.Dexterite, inline : true}
            )
            .addFields(
                    { name : `Lien Gdoc`, value : fiche.LienFichePerso, inline : true}
            )
            .setThumbnail(taggedUser.avatarURL())
            message.channel.send(exampleEmbed);
	}

	//Fonction pour set up la fiche Qualite1/Qualite2/Defaut1/Faiblesse1
	if (message.channel.id==auth.Salon.GestionFiche && message.member.roles.cache.has(auth.RoleRP.RoleStaff) && petitMessage.startsWith(prefixCreateFicheStep2))
	{
		const taggedUser = message.mentions.users.first();
			if (!taggedUser) return message.channel.send("remplirfiche2 @joueur Qualite1 Qualite2 Defaut1 Faiblesse1.");
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
		const argQualiteUn = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
		const argQualiteDeux = message.content.split(' ').slice(3); // All arguments behind the command name with the prefix
		const argDefautUn = message.content.split(' ').slice(4); // All arguments behind the command name with the prefix
		const argFaiblesseUn = message.content.split(' ').slice(5).join(' '); // All arguments behind the command name with the prefix
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		NewQualiteUn=argQualiteUn[0];
		NewQualiteDeux=argQualiteDeux[0];
		NewDefautUn=argDefautUn[0];
		NewFaiblesse=argFaiblesseUn;
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Qualite.0': NewQualiteUn ,'Qualite.1': NewQualiteDeux, Defaut: NewDefautUn, 'Faiblesse.0': NewFaiblesse});
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		console.log(fiche)
		const listeQualite=fiche.Qualite;
		const listeFaiblesse=fiche.Faiblesse;			
		console.log(listeQualite)
		console.log(listeFaiblesse)
		const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#16EF0E')
            .setTitle("Fiche de " +fiche.Username)
            .setDescription(`Nom : `+fiche.Identite.Nom+`
                         Prenom : `+fiche.Identite.Prenom+`
                         Age: `+fiche.Identite.Age+`
                         Sexe: `+fiche.Identite.Sexe+`
                         Metier : `+fiche.Identite.Metier+`
                         Niveau de Maitrise : `+fiche.NiveauDeMaitrise+`
                         Niveau XP : `+fiche.NiveauXP+`
                         Point de Competence : `+fiche.GainCompetence+`
                         Faiblesse : `+listeFaiblesse[0]+`, `+listeFaiblesse[1])
            .addFields(
                { name : `Qualite 1`, value : listeQualite[0], inline : true},
                { name : `Qualite 2`, value : listeQualite[1], inline : true},
                { name : `Defaut 1`, value : fiche.Defaut, inline : true}
            )
            .addFields(
                { name : `Force`, value : fiche.Competence.Force, inline : true},
                { name : `Constitution`, value : fiche.Competence.Constitution, inline : true},
                { name : `Charisme`, value : fiche.Competence.Charisme, inline : true}
            )
            .addFields(
                { name : `Intelligence`, value : fiche.Competence.Intelligence, inline : true},
                { name : `Sagesse`, value : fiche.Competence.Sagesse, inline : true},
                { name : `Dexterite`, value : fiche.Competence.Dexterite, inline : true}
            )
            .addFields(
                    { name : `Lien Gdoc`, value : fiche.LienFichePerso, inline : true}
            )
            .setThumbnail(taggedUser.avatarURL())
            message.channel.send(exampleEmbed);
	}


	//Fonction pour set up la fiche Force/Constitution/Charisme/Intelligence/Sagesse/Dexterite/Faiblesse2
	if (message.channel.id==auth.Salon.GestionFiche && message.member.roles.cache.has(auth.RoleRP.RoleStaff) && petitMessage.startsWith(prefixCreateFicheStep3))
	{
		const taggedUser = message.mentions.users.first();
			if (!taggedUser) return message.channel.send("remplirfiche3 @joueur Force Constitution Charisme Intelligence Sagesse Dexterite Faiblesse2");
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
		const argForce = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
		const argConst = message.content.split(' ').slice(3); // All arguments behind the command name with the prefix
		const argCharisme = message.content.split(' ').slice(4); // All arguments behind the command name with the prefix
		const argInt = message.content.split(' ').slice(5); // All arguments behind the command name with the prefix
		const argSagesse = message.content.split(' ').slice(6); // All arguments behind the command name with the prefix
		const argDext = message.content.split(' ').slice(7); // All ar.join(' ')guments behind the command name with the prefix
		const argFaiblesseDeux = message.content.split(' ').slice(8).join(' '); // All arguments behind the command name with the prefix
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		NewForce=argForce[0];
		NewConst=argConst[0];
		NewCharisme=argCharisme[0];
		NewInt=argInt[0];
		NewSagesse=argSagesse[0];
		NewDext=argDext[0];
		NewFaiblesseDeux=argFaiblesseDeux;
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Competence.Force': NewForce ,'Competence.Constitution': NewConst, 'Competence.Charisme': NewCharisme});
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Competence.Intelligence': NewInt ,'Competence.Sagesse': NewSagesse, 'Competence.Dexterite': NewDext});
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Faiblesse.1': NewFaiblesseDeux});
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		console.log(fiche)
		const listeQualite=fiche.Qualite;
		const listeFaiblesse=fiche.Faiblesse;			
		console.log(listeQualite)
		console.log(listeFaiblesse)
		const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#16EF0E')
            .setTitle("Fiche de " +fiche.Username)
            .setDescription(`Nom : `+fiche.Identite.Nom+`
                         Prenom : `+fiche.Identite.Prenom+`
                         Age: `+fiche.Identite.Age+`
                         Sexe: `+fiche.Identite.Sexe+`
                         Metier : `+fiche.Identite.Metier+`
                         Niveau de Maitrise : `+fiche.NiveauDeMaitrise+`
                         Niveau XP : `+fiche.NiveauXP+`
                         Point de Competence : `+fiche.GainCompetence+`
                         Faiblesse : `+listeFaiblesse[0]+`, `+listeFaiblesse[1])
            .addFields(
                { name : `Qualite 1`, value : listeQualite[0], inline : true},
                { name : `Qualite 2`, value : listeQualite[1], inline : true},
                { name : `Defaut 1`, value : fiche.Defaut, inline : true}
            )
            .addFields(
                { name : `Force`, value : fiche.Competence.Force, inline : true},
                { name : `Constitution`, value : fiche.Competence.Constitution, inline : true},
                { name : `Charisme`, value : fiche.Competence.Charisme, inline : true}
            )
            .addFields(
                { name : `Intelligence`, value : fiche.Competence.Intelligence, inline : true},
                { name : `Sagesse`, value : fiche.Competence.Sagesse, inline : true},
                { name : `Dexterite`, value : fiche.Competence.Dexterite, inline : true}
            )
            .addFields(
                    { name : `Lien Gdoc`, value : fiche.LienFichePerso, inline : true}
            )
            .setThumbnail(taggedUser.avatarURL())
            message.channel.send(exampleEmbed);
	}

	//Fonction pour set up la fiche Ĺien Gdoc
	if (message.channel.id==auth.Salon.GestionFiche && message.member.roles.cache.has(auth.RoleRP.RoleStaff) && petitMessage.startsWith(prefixCreateFicheStep4))
	{
		const taggedUser = message.mentions.users.first();
			if (!taggedUser) return message.channel.send("remplirfiche4 @joueur Lien Gdoc");
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
		const argLienGdoc = message.content.split(' ').slice(2).join(' '); // All arguments behind the command name with the prefix
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{LienFichePerso: argLienGdoc});
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		console.log(fiche)
		const listeQualite=fiche.Qualite;
		const listeFaiblesse=fiche.Faiblesse;			
		console.log(listeQualite)
		console.log(listeFaiblesse)
		const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#16EF0E')
            .setTitle("Fiche de " +fiche.Username)
            .setDescription(`Nom : `+fiche.Identite.Nom+`
                         Prenom : `+fiche.Identite.Prenom+`
                         Age: `+fiche.Identite.Age+`
                         Sexe: `+fiche.Identite.Sexe+`
                         Metier : `+fiche.Identite.Metier+`
                         Niveau de Maitrise : `+fiche.NiveauDeMaitrise+`
                         Niveau XP : `+fiche.NiveauXP+`
                         Point de Competence : `+fiche.GainCompetence+`
                         Faiblesse : `+listeFaiblesse[0]+`, `+listeFaiblesse[1])
            .addFields(
                { name : `Qualite 1`, value : listeQualite[0], inline : true},
                { name : `Qualite 2`, value : listeQualite[1], inline : true},
                { name : `Defaut 1`, value : fiche.Defaut, inline : true}
            )
            .addFields(
                { name : `Force`, value : fiche.Competence.Force, inline : true},
                { name : `Constitution`, value : fiche.Competence.Constitution, inline : true},
                { name : `Charisme`, value : fiche.Competence.Charisme, inline : true}
            )
            .addFields(
                { name : `Intelligence`, value : fiche.Competence.Intelligence, inline : true},
                { name : `Sagesse`, value : fiche.Competence.Sagesse, inline : true},
                { name : `Dexterite`, value : fiche.Competence.Dexterite, inline : true}
            )
            .addFields(
                    { name : `Lien Gdoc`, value : fiche.LienFichePerso, inline : true}
            )
            .setThumbnail(taggedUser.avatarURL())
            message.channel.send(exampleEmbed);
	}


	//commande admin update fiche des gens
	if (message.channel.id==auth.Salon.GestionFiche && message.member.roles.cache.has(auth.RoleRP.RoleStaff) && petitMessage.startsWith(prefixUpdateFiche))
	{
		const taggedUser = message.mentions.users.first();
			if (!taggedUser) return message.author.send("Vous n'avez pas saisi de pseudo à chercher.").then(msg => msg.delete({ timeout: 10000 }));
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
		var argumentUpdate = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
		console.log(argumentUpdate)
		console.log(argumentUpdate[0])
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		var ValueUpdate = message.content.split(' ').slice(3).join(' ');
		console.log(ValueUpdate)
		switch (argumentUpdate[0]) 
		{
			case "metier" : await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Identite.Metier' : ValueUpdate}); 
			break;
			case "categorie" : 
			var ValueUpdate2 = message.content.split(' ').slice(3).join(' ').split('&')
			console.log(ValueUpdate2)
			var ValueUpdate3 = ValueUpdate2[1].split('>')
			console.log(ValueUpdate3)
			await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Identite.Categorie' : ValueUpdate3[0]}); 
			break;
			case "age" : await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Identite.Age' : Number(ValueUpdate)}); 
			break;
			case "force" : await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Competence.Force' : Number(ValueUpdate)}); 
			break;
			case "constitution" : await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Competence.Constitution' : Number(ValueUpdate)}); 
			break;
			case "charisme" : await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Competence.Charisme' : Number(ValueUpdate)}); 
			break;
			case "intelligence" : await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Competence.Intelligence' : Number(ValueUpdate)}); 
			break;
			case "sagesse" : await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Competence.Sagesse' : Number(ValueUpdate)}); 
			break;
			case "dexterite" : await FichePerso.findOneAndUpdate({_id: taggedUser.id},{'Competence.Dexterite' : Number(ValueUpdate)}); 
			break;
			default:
			break;
		}
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		const listeQualite=fiche.Qualite;
		const listeFaiblesse=fiche.Faiblesse;			
		console.log(listeQualite)
		console.log(listeFaiblesse)
		const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#16EF0E')
            .setTitle("Fiche de " +fiche.Username)
            .setDescription(`Nom : `+fiche.Identite.Nom+`
                         Prenom : `+fiche.Identite.Prenom+`
                         Age: `+fiche.Identite.Age+`
                         Metier : `+fiche.Identite.Metier+`
                         Niveau de Maitrise : `+fiche.NiveauDeMaitrise+`
                         Niveau XP : `+fiche.NiveauXP+`
                         Point de Competence : `+fiche.GainCompetence+`
                         Faiblesse : `+listeFaiblesse[0]+`, `+listeFaiblesse[1])
            .addFields(
                { name : `Qualite 1`, value : listeQualite[0], inline : true},
                { name : `Qualite 2`, value : listeQualite[1], inline : true},
                { name : `Defaut 1`, value : fiche.Defaut, inline : true}
            )
            .addFields(
                { name : `Force`, value : fiche.Competence.Force, inline : true},
                { name : `Constitution`, value : fiche.Competence.Constitution, inline : true},
                { name : `Charisme`, value : fiche.Competence.Charisme, inline : true}
            )
            .addFields(
                { name : `Intelligence`, value : fiche.Competence.Intelligence, inline : true},
                { name : `Sagesse`, value : fiche.Competence.Sagesse, inline : true},
                { name : `Dexterite`, value : fiche.Competence.Dexterite, inline : true}
            )
            .addFields(
                { name : `Lien Gdoc`, value : fiche.LienFichePerso, inline : true}
            )
            .setThumbnail(taggedUser.avatarURL())
            message.channel.send(exampleEmbed);
			message.channel.send("Fiche update")
	}


	// COMMANDE POUR LES GENS
	//Fonction affichage fiche pour les gens 
	if (message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin)
	{
		if (petitMessage.startsWith(prefixMaFiche)) 
		{
			var fiche = await FichePerso.findOne({_id: message.author.id}); 
			const listeQualite=fiche.Qualite;
			const listeFaiblesse=fiche.Faiblesse;
			const exampleEmbed = new Discord.MessageEmbed()
	            .setColor('#16EF0E')
	            .setTitle("Fiche de " +fiche.Username)
	            .setDescription(`Nom : `+fiche.Identite.Nom+`
	                         Prenom : `+fiche.Identite.Prenom+`
	                         Age: `+fiche.Identite.Age+`
	                         Sexe: `+fiche.Identite.Sexe+`
	                         Metier : `+fiche.Identite.Metier+`
	                         Niveau de Maitrise : `+fiche.NiveauDeMaitrise+`
	                         Niveau XP : `+fiche.NiveauXP+`
	                         Point de Competence : `+fiche.GainCompetence+`
	                         Faiblesse : `+listeFaiblesse[0]+`, `+listeFaiblesse[1])

                .addFields(
                    { name : `Qualite 1`, value : listeQualite[0], inline : true},
                    { name : `Qualite 2`, value : listeQualite[1], inline : true},
                    { name : `Defaut 1`, value : fiche.Defaut, inline : true}
                )
                .addFields(
                    { name : `Force`, value : fiche.Competence.Force, inline : true},
                    { name : `Constitution`, value : fiche.Competence.Constitution, inline : true},
                    { name : `Charisme`, value : fiche.Competence.Charisme, inline : true}
                )
                .addFields(
                    { name : `Intelligence`, value : fiche.Competence.Intelligence, inline : true},
                    { name : `Sagesse`, value : fiche.Competence.Sagesse, inline : true},
                    { name : `Dexterite`, value : fiche.Competence.Dexterite, inline : true}
                )
                .addFields(
                   	{ name : `Lien Gdoc`, value : fiche.LienFichePerso, inline : true}
            	)
                .setThumbnail(message.author.avatarURL())
	            message.channel.send(exampleEmbed);
		}
	}

	//Commande de gain d'XP par message dans les salons RP
	if (message.channel.parent==auth.Salon.CategorieRPAzathys || message.channel.parent==auth.Salon.CategorieRPTempleAustral || message.channel.parent==auth.Salon.CategorieRPMasun || message.channel.parent==auth.Salon.CategorieRPCroissant || message.channel.parent==auth.Salon.CategorieRPTempOcci || message.channel.parent==auth.Salon.CategorieRPBraise || message.channel.parent==auth.Salon.CategorieRPBahSingSe || message.channel.parent==auth.Salon.CategorieRPOmashu || message.channel.parent==auth.Salon.CategorieRPMaraisBrumeux || message.channel.parent==auth.Salon.CategorieRPDesertSiWang || message.channel.parent==auth.Salon.CategorieRPTempOrient || message.channel.parent==auth.Salon.CategorieRPIleKyoshi || message.channel.parent==auth.Salon.CategorieRPTempBoreal|| message.channel.parent==auth.Salon.CategorieRPTribuSud)
	{
		var NewXP=0;
		var taillemessage = counterMot.count(petitMessage,'-c');
		console.log(taillemessage)
		if (taillemessage.chars>=100 && taillemessage.chars<=150)
		{
			var xPfiche = await FichePerso.findOne({_id: message.author.id});
			var NewXP=xPfiche.NiveauXP+Rand(50)+20;
			await FichePerso.findOneAndUpdate({_id: message.author.id},{NiveauXP: NewXP});
		};
		if (taillemessage.chars>150 && taillemessage.chars<=250)
		{
			var xPfiche = await FichePerso.findOne({_id: message.author.id});
			var NewXP=xPfiche.NiveauXP+Rand(70)+50;
			await FichePerso.findOneAndUpdate({_id: message.author.id},{NiveauXP: NewXP});
		};
		if (taillemessage.chars>250)
		{
			var xPfiche = await FichePerso.findOne({_id: message.author.id});
			var NewXP=xPfiche.NiveauXP+Rand(100)+120;
			await FichePerso.findOneAndUpdate({_id: message.author.id},{NiveauXP: NewXP});
		};
		console.log(NewXP)
	}

	//Commande pour voir son XP
	if ((message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin) && message.member.roles.cache.has(auth.RoleRP.RolePlay) && petitMessage.startsWith(prefixXP))
	{
		var xPficheLive = await FichePerso.findOne({_id: message.author.id});
		message.reply("Tu as "+xPficheLive.NiveauXP+ " XP")
	}


	//Appel de la BOUTIQUE
	if ((message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin) && petitMessage.startsWith(prefixBoutique) && message.member.roles.cache.has(auth.RoleRP.RolePlay))
	{
		var boutique = await BoutiqueMaitrise.findOne({_id: "15257986"}); 
			const exampleEmbed = new Discord.MessageEmbed()

	            .setColor('#16EF0E')
	            .setTitle("Boutique de Nivaux de Maitrise")
	            .setDescription("")

                .addFields(
                    { name : `Maitrise 2`, value : boutique.Maitrise2, inline : true},
                    { name : `Maitrise 3`, value : boutique.Maitrise3, inline : true},
                    { name : `Maitrise 4`, value : boutique.Maitrise4, inline : true},
                )
                .addFields(
                    { name : `Maitrise 5`, value : boutique.Maitrise5, inline : true},
                    { name : `Maitrise 6`, value : boutique.Maitrise6, inline : true},
                    { name : `Maitrise 7`, value : boutique.Maitrise7, inline : true},
                )
                .addFields(
                    { name : `Maitrise 8`, value : boutique.Maitrise8, inline : true},
                    { name : `Maitrise 9`, value : boutique.Maitrise9, inline : true},
                    { name : `Maitrise 10`, value : boutique.Maitrise10, inline : true},
                )
                .addFields(
                    { name : `Maitrise 11`, value : boutique.Maitrise11, inline : true},
                    { name : `Maitrise 12`, value : boutique.Maitrise12, inline : true},
                    { name : `Maitrise 13`, value : boutique.Maitrise13, inline : true},
                )
                .addFields(
                    { name : `Maitrise 14`, value : boutique.Maitrise14, inline : true},
                    { name : `Maitrise 15`, value : boutique.Maitrise15, inline : true},
                    { name : `Maitrise 16`, value : boutique.Maitrise16, inline : true},
                )
                .addFields(
                    { name : `Maitrise 17`, value : boutique.Maitrise17, inline : true},
                    { name : `Maitrise 18`, value : boutique.Maitrise18, inline : true},
                    { name : `Maitrise 19`, value : boutique.Maitrise19, inline : true},
                )
                .addFields(
                    { name : `Maitrise 20`, value : boutique.Maitrise20, inline : true},
                )
                .setThumbnail("https://static.wikia.nocookie.net/skies-of-arcadia/images/e/e4/Avatar_The_Last_Airbender_logo_%28alternate_version%29.png/revision/latest?cb=20180224144932")
	            message.channel.send(exampleEmbed);
	}

	//Achat dans la BOUTIQUE
	if (message.channel.id==auth.Salon.Jet && petitMessage.startsWith(prefixAchatBoutique) && message.member.roles.cache.has(auth.RoleRP.RolePlay))
	{
		console.log("Coucou")
		var NiveauMaitrise = Number(message.content.split(' ').slice(2).join(' '));
		console.log(NiveauMaitrise)
		prixNiveau=Number(NiveauMaitrise)*1000;
		console.log(prixNiveau)
		var fiche = await FichePerso.findOne({_id: message.author.id});
		console.log(fiche.NiveauDeMaitrise)
		console.log(fiche.NiveauXP)
			if (NiveauMaitrise != fiche.NiveauDeMaitrise+Number(1))
			{
				console.log("ici")
				message.reply("Tu n'as pas le niveau adequat pour cet achat");
			}
			else
			{
				console.log("la")
				if (prixNiveau > fiche.NiveauXP)
				{
					message.reply("Tu n'as pas assez d'Ex");
				}
				else 
				{
					NewXP=fiche.NiveauXP-prixNiveau;
					var CompetencePlus= fiche.GainCompetence + Number(2);
					await FichePerso.findOneAndUpdate({_id: message.author.id},{NiveauXP: NewXP, NiveauDeMaitrise: NiveauMaitrise, GainCompetence : CompetencePlus});
					switch (NiveauMaitrise) 
					{
						case 2: message.member.roles.add(auth.RoleRP.Maitrise2);
		  						message.member.roles.remove(auth.RoleRP.Maitrise1);
		  						var messagePaiement = "Bravo tu viens passer M2 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 3: message.member.roles.add(auth.RoleRP.Maitrise3);
		  						message.member.roles.remove(auth.RoleRP.Maitrise2);
		  						var messagePaiement = "Bravo tu viens passer M3 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 4: message.member.roles.add(auth.RoleRP.Maitrise4);
		  						message.member.roles.remove(auth.RoleRP.Maitrise3);
		  						var messagePaiement = "Bravo tu viens passer M4 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 5: message.member.roles.add(auth.RoleRP.Maitrise5);
		  						message.member.roles.remove(auth.RoleRP.Maitrise4);
		  						var messagePaiement = "Bravo tu viens passer M5 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 6: message.member.roles.add(auth.RoleRP.Maitrise6);
		  						message.member.roles.remove(auth.RoleRP.Maitrise5);
		  						var messagePaiement = "Bravo tu viens passer M6 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 7: message.member.roles.add(auth.RoleRP.Maitrise7);
		  						message.member.roles.remove(auth.RoleRP.Maitrise6);
		  						var messagePaiement = "Bravo tu viens passer M7 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 8: message.member.roles.add(auth.RoleRP.Maitrise8);
		  						message.member.roles.remove(auth.RoleRP.Maitrise7);
		  						var messagePaiement = "Bravo tu viens passer M8 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 9: message.member.roles.add(auth.RoleRP.Maitrise9);
		  						message.member.roles.remove(auth.RoleRP.Maitrise8);
		  						var messagePaiement = "Bravo tu viens passer M9 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 10: message.member.roles.add(auth.RoleRP.Maitrise10);
		  						message.member.roles.remove(auth.RoleRP.Maitrise9);
		  						var messagePaiement = "Bravo tu viens passer M10 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 11: message.member.roles.add(auth.RoleRP.Maitrise11);
		  						message.member.roles.remove(auth.RoleRP.Maitrise10);
		  						var messagePaiement = "Bravo tu viens passer M11 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 12: message.member.roles.add(auth.RoleRP.Maitrise12);
		  						message.member.roles.remove(auth.RoleRP.Maitrise11);
		  						var messagePaiement = "Bravo tu viens passer M12 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 13: message.member.roles.add(auth.RoleRP.Maitrise13);
		  						message.member.roles.remove(auth.RoleRP.Maitrise12);
		  						var messagePaiement = "Bravo tu viens passer M13 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 14: message.member.roles.add(auth.RoleRP.Maitrise14);
		  						message.member.roles.remove(auth.RoleRP.Maitrise13);
		  						var messagePaiement = "Bravo tu viens passer M14 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 15: message.member.roles.add(auth.RoleRP.Maitrise15);
		  						message.member.roles.remove(auth.RoleRP.Maitrise14);
		  						var messagePaiement = "Bravo tu viens passer M15 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 16: message.member.roles.add(auth.RoleRP.Maitrise16);
		  						message.member.roles.remove(auth.RoleRP.Maitrise15);
		  						var messagePaiement = "Bravo tu viens passer M16 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 17: message.member.roles.add(auth.RoleRP.Maitrise17);
		  						message.member.roles.remove(auth.RoleRP.Maitrise16);
		  						var messagePaiement = "Bravo tu viens passer M17 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 18: message.member.roles.add(auth.RoleRP.Maitrise18);
		  						message.member.roles.remove(auth.RoleRP.Maitrise17);
		  						var messagePaiement = "Bravo tu viens passer M18 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 19: message.member.roles.add(auth.RoleRP.Maitrise19);
		  						message.member.roles.remove(auth.RoleRP.Maitrise18);
		  						var messagePaiement = "Bravo tu viens passer M19 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				case 20: message.member.roles.add(auth.RoleRP.Maitrise20);
		  						message.member.roles.remove(auth.RoleRP.Maitrise19);
		  						var messagePaiement = "Bravo tu viens passer M20 et tu gagnes 2 points a repartir dans tes competences !";
		  				break;
		  				default:
		  				break;
					}
					message.channel.send(messagePaiement)
				}
			}

	}

	//LES ROLLS ATTAQUES USANT DE LA MAITRISE OU DES COMPETENCES
	if (message.channel.id==auth.Salon.Jet && petitMessage.startsWith(prefixRoll) && message.member.roles.cache.has(auth.RoleRP.RolePlay))
	{
		console.log("roll")
		const taggedUser = message.mentions.users.first();
			if (!taggedUser) 
      		{
      			var tableauDeMot = message.content.split(' ').slice(1)
      			console.log(tableauDeMot)
				var TypeAttaque = tableauDeMot[0];
				var fiche = await FichePerso.findOne({_id: message.author.id});
				console.log(TypeAttaque)
					switch (TypeAttaque) 
					{
						case "maitrise" :
						console.log("roll de Maitrise")
						NiveauMaitrise = fiche.NiveauDeMaitrise
						switch (NiveauMaitrise) 
						{
								case 1: var bonusAttaque = Number(-1);
				  				break;
				  				case 2: var bonusAttaque = Number(0);
				  				break;
				  				case 3: var bonusAttaque = Number(1);
				  				break;
				  				case 4: var bonusAttaque = Number(2);
				  				break;
				  				case 5: var bonusAttaque = Number(3);
				  				break;
				  				case 6: var bonusAttaque = Number(3);
				  				break;
				  				case 7: var bonusAttaque = Number(4);
				  				break;
				  				case 8: var bonusAttaque = Number(5);
				  				break;
				  				case 9: var bonusAttaque = Number(6);
				  				break;
				  				case 10: var bonusAttaque = Number(6);
				  				break;
				  				case 11: var bonusAttaque = Number(7);
				  				break;
				  				case 12: var bonusAttaque = Number(8);
				  				break;
				  				case 13: var bonusAttaque = Number(9);
				  				break;
				  				case 14: var bonusAttaque = Number(10);
				  				break;
				  				case 15: var bonusAttaque = Number(11);
				  				break;
				  				case 16: var bonusAttaque = Number(11);
				  				break;
				  				case 17: var bonusAttaque = Number(12);
				  				break;
				  				case 18: var bonusAttaque = Number(13);
				  				break;
				  				case 19: var bonusAttaque = Number(14);
				  				break;
				  				case 20: var bonusAttaque = Number(15);
				  				break;
				  				default:
				  				break;
						}
						console.log(bonusAttaque);
				  		var ValRand =  Rand(20);
				  		var ficheMeteo = await Weather.findOne({_id: "152579868"});
				  		if (message.member.roles.cache.has(auth.RoleRP.Eau))
				  		{
				  			if (message.member.roles.cache.has(auth.RoleRP.PoleNord))
				  			{
				  				if (ficheMeteo.PoleNord=='🌧️' || ficheMeteo.PoleNord=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleAus))
				  			{
				  				if (ficheMeteo.TempleAus=='🌧️' || ficheMeteo.TempleAus=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.NationFeu))
				  			{
				  				if (ficheMeteo.NationFeu=='🌧️' || ficheMeteo.NationFeu=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}
								else
				  				{
				  					console.log("Il fait beau")
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleOcc))
				  			{
				  				if (ficheMeteo.TempleOcc=='🌧️' || ficheMeteo.TempleOcc=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.BaSingSe))
				  			{
				  				if (ficheMeteo.BaSingSe=='🌧️' || ficheMeteo.BaSingSe=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Omashu))
				  			{
				  				if (ficheMeteo.Omashu=='🌧️' || ficheMeteo.Omashu=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Marais))
				  			{
				  				if (ficheMeteo.Marais=='🌧️' || ficheMeteo.Marais=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Desert))
				  			{
				  				if (ficheMeteo.Desert=='🌧️' || ficheMeteo.Desert=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleOr))
				  			{
				  				if (ficheMeteo.TempleOr=='🌧️' || ficheMeteo.TempleOr=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.IleKyoshi))
				  			{
				  				if (ficheMeteo.IleKyoshi=='🌧️' || ficheMeteo.IleKyoshi=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleBor))
				  			{
				  				if (ficheMeteo.TempleBor=='🌧️' || ficheMeteo.TempleBor=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.PoleSud))
				  			{
				  				if (ficheMeteo.PoleSud=='🌧️' || ficheMeteo.PoleSud=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			if (message.createdAt.getHours()>= 16 || message.createdAt.getHours()<= 3)
				  			{
				  				console.log("C'est la nuit")
				  				if (ficheMeteo.Nuit=='🌕')
				  				{
				  					BonusMeteo = BonusMeteo + Number(2);
				  				}
				  				if (ficheMeteo.Nuit=='🌔' || ficheMeteo.Nuit=='🌖')
				  				{
				  					BonusMeteo = BonusMeteo + Number(1);
				  				}
				  				if (ficheMeteo.Nuit=='🌑')
				  				{
				  					BonusMeteo = BonusMeteo + Number(-2);
				  				}
				  				if (ficheMeteo.Nuit=='🌒' || ficheMeteo.Nuit=='🌘')
				  				{
				  					BonusMeteo = BonusMeteo + Number(-1);
				  				}
				  			}
				  		}
				  		if (message.member.roles.cache.has(auth.RoleRP.Feu))
				  		{
				  			if (message.member.roles.cache.has(auth.RoleRP.PoleNord))
				  			{
				  				if (ficheMeteo.PoleNord=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.PoleNord=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.PoleNord=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleAus))
				  			{
				  				if (ficheMeteo.TempleAus=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.TempleAus=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.TempleAus=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.NationFeu))
				  			{
				  				if (ficheMeteo.NationFeu=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.NationFeu=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.NationFeu=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleOcc))
				  			{
				  				if (ficheMeteo.TempleOcc=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.TempleOcc=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.TempleOcc=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.BaSingSe))
				  			{
				  				if (ficheMeteo.BaSingSe=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.BaSingSe=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.BaSingSe=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Omashu))
				  			{
				  				if (ficheMeteo.Omashu=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.Omashu=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.Omashu=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Marais))
				  			{
				  				if (ficheMeteo.Marais=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.Marais=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.Marais=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Desert))
				  			{
				  				if (ficheMeteo.Desert=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.Desert=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.Desert=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleOr))
				  			{
				  				if (ficheMeteo.TempleOr=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.TempleOr=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.TempleOr=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.IleKyoshi))
				  			{
				  				if (ficheMeteo.IleKyoshi=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.IleKyoshi=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.IleKyoshi=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleBor))
				  			{
				  				if (ficheMeteo.TempleBor=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.TempleBor=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.TempleBor=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.PoleSud))
				  			{
				  				if (ficheMeteo.PoleSud=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.PoleSud=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.PoleSud=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  		}
				  		if (message.member.roles.cache.has(auth.RoleRP.Eau) || message.member.roles.cache.has(auth.RoleRP.Feu))
				  		{
				  			if (!tableauDeMot[1])
							{
					  			var ValRoll= ValRand + Number(bonusAttaque)+ Number(BonusMeteo);
								if (ValRoll<=1)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) + " + BonusMeteo + " (bonus/malus Meteo) = " + ValRoll +"\rOuhla c'est un echec critique ! Tu dois t'infliger une blessure");
								}
								else if (ValRoll<=9)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) + " + BonusMeteo + " (bonus/malus Meteo) = " + ValRoll +"\rTu n'as pas su utiliser ta maitrise correctement, c'est un echec sans dommage physique");
								}
								else if (ValRoll<=15)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) + " + BonusMeteo + " (bonus/malus Meteo) = " + ValRoll +"\rLa maitrise de ton element est correcte, tu reussis ton action sans briller");
								}
								else if (ValRoll<=19)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) + " + BonusMeteo + " (bonus/malus Meteo) = " + ValRoll +"\rLa maitrise de ton element est tres bonne, tu reussis ton action !");
								}
								else
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) + " + BonusMeteo + " (bonus/malus Meteo) = " + ValRoll +"\rBravo c'est une reussite critique ! Ton action est juste parfait");
								}
							}
							else 
							{
								console.log(tableauDeMot[1])
								var BonusLieu = tableauDeMot[1]
								var ValRoll= ValRand + Number(bonusAttaque)+ Number(BonusMeteo) + Number(BonusLieu);
								if (ValRoll<=1)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusMeteo + " (bonus/malus Meteo) " + BonusLieu + " (bonus/malus Lieu/Contexte)  = " + ValRoll +"\rOuhla c'est un echec critique ! Tu dois t'infliger une blessure");
								}
								else if (ValRoll<=9)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusMeteo + " (bonus/malus Meteo) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rTu n'as pas su utiliser ta maitrise correctement, c'est un echec sans dommage physique");
								}
								else if (ValRoll<=15)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusMeteo + " (bonus/malus Meteo) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rLa maitrise de ton element est correcte, tu reussis ton action sans briller");
								}
								else if (ValRoll<=19)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusMeteo + " (bonus/malus Meteo) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rLa maitrise de ton element est tres bonne, tu reussis ton action !");
								}
								else
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusMeteo + " (bonus/malus Meteo) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rBravo c'est une reussite critique ! Ton action est juste parfait");
								}
							}	
						}
						if (message.member.roles.cache.has(auth.RoleRP.Terre) || message.member.roles.cache.has(auth.RoleRP.Air))
				  		{
				  			if (!tableauDeMot[1])
							{
								console.log("pas de boost de lieu")
					  			var ValRoll= ValRand + Number(bonusAttaque)
								if (ValRoll<=1)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) = " + ValRoll +"\rOuhla c'est un echec critique ! Tu dois t'infliger une blessure");
								}
								else if (ValRoll<=9)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) = " + ValRoll +"\rTu n'as pas su utiliser ta maitrise correctement, c'est un echec sans dommage physique");
								}
								else if (ValRoll<=15)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) = " + ValRoll +"\rLa maitrise de ton element est correcte, tu reussis ton action sans briller");
								}
								else if (ValRoll<=19)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) = " + ValRoll +"\rLa maitrise de ton element est tres bonne, tu reussis ton action !");
								}
								else
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) = " + ValRoll +"\rBravo c'est une reussite critique ! Ton action est juste parfait");
								}
							}
							else 
							{
								console.log(tableauDeMot[1])
								var BonusLieu = tableauDeMot[1]
								var ValRoll= ValRand + Number(bonusAttaque)+ Number(BonusLieu)
								if (ValRoll<=1)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rOuhla c'est un echec critique ! Tu dois t'infliger une blessure");
								}
								else if (ValRoll<=9)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rTu n'as pas su utiliser ta maitrise correctement, c'est un echec sans dommage physique");
								}
								else if (ValRoll<=15)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rLa maitrise de ton element est correcte, tu reussis ton action sans briller");
								}
								else if (ValRoll<=19)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rLa maitrise de ton element est tres bonne, tu reussis ton action !");
								}
								else
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus/malus maitrise) " + BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +"\rBravo c'est une reussite critique ! Ton action est juste parfait");
								}	
							}	
						}
						break;
						case "force" :
						console.log("roll de force")
						var Nombre = Number(fiche.Competence.Force)
						var ValRoll = Rand(20);
						if (ValRoll<=Nombre)
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est une reussite");
						}
						else
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est un echec");
						}
						break;
						case "constitution" :
						var Nombre = Number(fiche.Competence.Constitution)
						var ValRoll = Rand(20);
						if (ValRoll<=Nombre)
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est une reussite");
						}
						else
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est un echec");
						}
						break;
						case "charisme" :
						var Nombre = Number(fiche.Competence.Charisme)
						var ValRoll = Rand(20);
						if (ValRoll<=Nombre)
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est une reussite");
						}
						else
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est un echec");
						}
						break;						
						case "intelligence" :
						var Nombre = Number(fiche.Competence.Intelligence)
						var ValRoll = Rand(20);
						if (ValRoll<=Nombre)
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est une reussite");
						}
						else
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est un echec");
						}
						break;
						case "sagesse" :
						var Nombre = Number(fiche.Competence.Sagesse)
						var ValRoll = Rand(20);
						if (ValRoll<=Nombre)
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est une reussite");
						}
						else
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est un echec");
						}
						break;
						case "dexterite" :
						var Nombre = Number(fiche.Competence.Dexterite)
						var ValRoll = Rand(20);
						if (ValRoll<=Nombre)
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est une reussite");
						}
						else
						{
							message.reply(" Ton roll est de " +ValRoll+ ", c'est un echec");
						}
						break;
						default:
						break;
					}
			}
			else
			{
				console.log("attaque d'opposition")
				var tableauDeMot = message.content.split(' ').slice(1)
				console.log(tableauDeMot)
				var TypeAttaque = tableauDeMot[0];
				var fiche = await FichePerso.findOne({_id: message.author.id});
				console.log(TypeAttaque)
					switch (TypeAttaque) 
					{
						case "maitrise" :
						console.log("je fais une attaque opposition de maitrise")
						NiveauMaitrise = fiche.NiveauDeMaitrise
						switch (NiveauMaitrise) 
						{
								case 1: var bonusAttaque = Number(-1);
				  				break;
				  				case 2: var bonusAttaque = Number(0);
				  				break;
				  				case 3: var bonusAttaque = Number(1);
				  				break;
				  				case 4: var bonusAttaque = Number(2);
				  				break;
				  				case 5: var bonusAttaque = Number(3);
				  				break;
				  				case 6: var bonusAttaque = Number(3);
				  				break;
				  				case 7: var bonusAttaque = Number(4);
				  				break;
				  				case 8: var bonusAttaque = Number(5);
				  				break;
				  				case 9: var bonusAttaque = Number(6);
				  				break;
				  				case 10: var bonusAttaque = Number(6);
				  				break;
				  				case 11: var bonusAttaque = Number(7);
				  				break;
				  				case 12: var bonusAttaque = Number(8);
				  				break;
				  				case 13: var bonusAttaque = Number(9);
				  				break;
				  				case 14: var bonusAttaque = Number(10);
				  				break;
				  				case 15: var bonusAttaque = Number(11);
				  				break;
				  				case 16: var bonusAttaque = Number(11);
				  				break;
				  				case 17: var bonusAttaque = Number(12);
				  				break;
				  				case 18: var bonusAttaque = Number(13);
				  				break;
				  				case 19: var bonusAttaque = Number(14);
				  				break;
				  				case 20: var bonusAttaque = Number(15);
				  				break;
				  				default:
				  				break;
						}
						console.log(bonusAttaque);
				  		var ValRand =  Rand(20);
				  		var ficheMeteo = await Weather.findOne({_id: "152579868"});
				  		if (message.member.roles.cache.has(auth.RoleRP.Eau))
				  		{
				  			if (message.member.roles.cache.has(auth.RoleRP.PoleNord))
				  			{
				  				if (ficheMeteo.PoleNord=='🌧️' || ficheMeteo.PoleNord=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleAus))
				  			{
				  				if (ficheMeteo.TempleAus=='🌧️' || ficheMeteo.TempleAus=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.NationFeu))
				  			{
				  				if (ficheMeteo.NationFeu=='🌧️' || ficheMeteo.NationFeu=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}
								else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleOcc))
				  			{
				  				if (ficheMeteo.TempleOcc=='🌧️' || ficheMeteo.TempleOcc=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.BaSingSe))
				  			{
				  				if (ficheMeteo.BaSingSe=='🌧️' || ficheMeteo.BaSingSe=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Omashu))
				  			{
				  				if (ficheMeteo.Omashu=='🌧️' || ficheMeteo.Omashu=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Marais))
				  			{
				  				if (ficheMeteo.Marais=='🌧️' || ficheMeteo.Marais=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Desert))
				  			{
				  				if (ficheMeteo.Desert=='🌧️' || ficheMeteo.Desert=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleOr))
				  			{
				  				if (ficheMeteo.TempleOr=='🌧️' || ficheMeteo.TempleOr=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.IleKyoshi))
				  			{
				  				if (ficheMeteo.IleKyoshi=='🌧️' || ficheMeteo.IleKyoshi=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleBor))
				  			{
				  				if (ficheMeteo.TempleBor=='🌧️' || ficheMeteo.TempleBor=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.PoleSud))
				  			{
				  				if (ficheMeteo.PoleSud=='🌧️' || ficheMeteo.PoleSud=='🌨️')
				  				{
				  					var BonusMeteo = Number(1)
				  				}	
				  				else
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			if (message.createdAt.getHours()>= 16 || message.createdAt.getHours()<= 3)
				  			{
				  				if (ficheMeteo.Nuit=='🌕')
				  				{
				  					BonusMeteo = BonusMeteo + Number(2);
				  				}
				  				if (ficheMeteo.Nuit=='🌔' || ficheMeteo.Nuit=='🌖')
				  				{
				  					BonusMeteo = BonusMeteo + Number(1);
				  				}
				  				if (ficheMeteo.Nuit=='🌑')
				  				{
				  					BonusMeteo = BonusMeteo + Number(-2);
				  				}
				  				if (ficheMeteo.Nuit=='🌒' || ficheMeteo.Nuit=='🌘')
				  				{
				  					BonusMeteo = BonusMeteo + Number(-1);
				  				}
				  			}
				  		}
				  		if (message.member.roles.cache.has(auth.RoleRP.Feu))
				  		{
				  			if (message.member.roles.cache.has(auth.RoleRP.PoleNord))
				  			{
				  				if (ficheMeteo.PoleNord=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.PoleNord=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.PoleNord=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleAus))
				  			{
				  				if (ficheMeteo.TempleAus=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.TempleAus=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.TempleAus=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.NationFeu))
				  			{
				  				if (ficheMeteo.NationFeu=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.NationFeu=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.NationFeu=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleOcc))
				  			{
				  				if (ficheMeteo.TempleOcc=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.TempleOcc=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.TempleOcc=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.BaSingSe))
				  			{
				  				if (ficheMeteo.BaSingSe=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.BaSingSe=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.BaSingSe=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Omashu))
				  			{
				  				if (ficheMeteo.Omashu=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.Omashu=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.Omashu=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Marais))
				  			{
				  				if (ficheMeteo.Marais=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.Marais=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.Marais=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.Desert))
				  			{
				  				if (ficheMeteo.Desert=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.Desert=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.Desert=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleOr))
				  			{
				  				if (ficheMeteo.TempleOr=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.TempleOr=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.TempleOr=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.IleKyoshi))
				  			{
				  				if (ficheMeteo.IleKyoshi=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.IleKyoshi=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.IleKyoshi=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.TempleBor))
				  			{
				  				if (ficheMeteo.TempleBor=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.TempleBor=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.TempleBor=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  			else if (message.member.roles.cache.has(auth.RoleRP.PoleSud))
				  			{
				  				if (ficheMeteo.PoleSud=='🌨️')
				  				{
				  					var BonusMeteo = Number(-2)
				  				}
				  				else if (ficheMeteo.PoleSud=='🌧️')
				  				{
				  					var BonusMeteo = Number(-1)
				  				}
				  				else if (ficheMeteo.PoleSud=='☀️')
				  				{
				  					var BonusMeteo = Number(+1)
				  				}
				  				else 
				  				{
				  					var BonusMeteo = Number(0)
				  				}
				  			}
				  		}
				  		if (message.member.roles.cache.has(auth.RoleRP.Eau) || message.member.roles.cache.has(auth.RoleRP.Feu))
				  		{
				  			if(!tableauDeMot[2])
				  			{
				  				console.log("Pas de bonus de lieu")
					  			var ValRoll= ValRand + Number(bonusAttaque)+ Number(BonusMeteo);
								if (ValRoll<=10)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus maitrise) + " +BonusMeteo+ " (bonus/malus Meteo) = " + ValRoll + " \rTu n'as pas su utiliser ta maitrise efficacement, meme si ton score est plus haut que ton adversaire, tu ne lui fera pas de degat");
								}
								else
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus maitrise) + " +BonusMeteo+ " (bonus/malus Meteo) = " + ValRoll +" \rL'utilisation de ta maitrise est une reussite");
								}
				  			}
				  			else
				  			{
				  				console.log("bonus de lieu 0 "+tableauDeMot[2])
				  				var BonusLieu = Number(tableauDeMot[2])
				  				var ValRoll= ValRand + Number(bonusAttaque)+ Number(BonusMeteo)+ Number(BonusLieu);
								if (ValRoll<=10)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus maitrise) + " +BonusMeteo+ " (bonus/malus Meteo) + " +BonusLieu+ " (bonus/malus Lieu/Contexte) = " + ValRoll + " \rTu n'as pas su utiliser ta maitrise efficacement, meme si ton score est plus haut que ton adversaire, tu ne lui fera pas de degat");
								}
								else
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus maitrise) + " +BonusMeteo+ " (bonus/malus Meteo) + " +BonusLieu+ " (bonus/malus Lieu/Contexte) = " + ValRoll +" \rL'utilisation de ta maitrise est une reussite");
								}
				  			}
				  				
						}
						if (message.member.roles.cache.has(auth.RoleRP.Terre) || message.member.roles.cache.has(auth.RoleRP.Air))
				  		{
				  			if(!tableauDeMot[2])
				  			{
				  				console.log("Pas de bonus de lieu")
					  			var ValRoll= ValRand + Number(bonusAttaque)
								if (ValRoll<=10)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus maitrise) = " + ValRoll + " \rTu n'as pas su utiliser ta maitrise efficacement, meme si ton score est plus haut que ton adversaire, tu ne lui feras pas de degat");
								}
								else
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus maitrise) = " + ValRoll +" \rL'utilisation de ta maitrise est une reussite, si ton score est plus haut que ton adversaire tu l'emportes");
								}
				  			}
				  			else
				  			{
				  				console.log("bonnus de lieu = "+tableauDeMot[2])
				  				var BonusLieu = Number(tableauDeMot[2])
				  				var ValRoll= ValRand + Number(bonusAttaque) + Number(BonusLieu)
								if (ValRoll<=10)
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus maitrise) + "+ BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll + " \rTu n'as pas su utiliser ta maitrise efficacement, meme si ton score est plus haut que ton adversaire, tu ne lui feras pas de degat");
								}
								else
								{
									message.reply(" Ton attaque est de " +ValRand+ " (roll) + "+ bonusAttaque + " (bonus maitrise) + "+ BonusLieu + " (bonus/malus Lieu/Contexte) = " + ValRoll +" \rL'utilisation de ta maitrise est une reussite, si ton score est plus haut que ton adversaire tu l'emportes");
								}
				  			}
				  			
						}	
						break;
						case "force" :
						console.log("roll d'attaque d'opposition")
						var Nombre = Number(fiche.Competence.Force)
						var ValRoll = Rand(20) + Number(Nombre);
						if (ValRoll<=5)
						{
							message.reply(" Ton roll de Force est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}else if (ValRoll<=10)
						{
							message.reply(" Ton roll de Force est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll<=15)
						{
							message.reply(" Ton roll de Force est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll>=16)
						{
							message.reply(" Ton roll de Force est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						break;
						case "constitution" :
						var Nombre = Number(fiche.Competence.Constitution)
						var ValRoll = Rand(20) + Number(Nombre);
						if (ValRoll<=5)
						{
							message.reply(" Ton roll de Constitution est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}else if (ValRoll<=10)
						{
							message.reply(" Ton roll de Constitution est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll<=15)
						{
							message.reply(" Ton roll de Constitution est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll>=16)
						{
							message.reply(" Ton roll de Constitution est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						break;
						case "charisme" :
						var Nombre = Number(fiche.Competence.Charisme);
						var ValRoll = Rand(20)+ Number(Nombre);
						if (ValRoll<=5)
						{
							message.reply(" Ton roll de Charisme est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}else if (ValRoll<=10)
						{
							message.reply(" Ton roll de Charisme est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll<=15)
						{
							message.reply(" Ton roll de Charisme est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll>=16)
						{
							message.reply(" Ton roll de Charisme est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						break;
						case "intelligence" :
						var Nombre = Number(fiche.Competence.Intelligence);
						var ValRoll = Rand(20)+ Number(Nombre);
						if (ValRoll<=5)
						{
							message.reply(" Ton roll d'intelligence est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}else if (ValRoll<=10)
						{
							message.reply(" Ton roll d'intelligence est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll<=15)
						{
							message.reply(" Ton roll d'intelligence est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll>=16)
						{
							message.reply(" Ton roll d'intelligence est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						break;
						case "sagesse" :
						var Nombre = Number(fiche.Competence.Sagesse);
						var ValRoll = Rand(20)+ Number(Nombre);
						if (ValRoll<=5)
						{
							message.reply(" Ton roll de sagesse est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}else if (ValRoll<=10)
						{
							message.reply(" Ton roll de sagesse est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll<=15)
						{
							message.reply(" Ton roll de sagesse est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll>=16)
						{
							message.reply(" Ton roll de sagesse est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						break;
						case "dexterite" :
						var Nombre = Number(fiche.Competence.Dexterite);
						var ValRoll = Rand(20)+ Number(Nombre);
						if (ValRoll<=5)
						{
							message.reply(" Ton roll de dexterite est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}else if (ValRoll<=10)
						{
							message.reply(" Ton roll de dexterite est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll<=15)
						{
							message.reply(" Ton roll de dexterite est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						else if (ValRoll>=16)
						{
							message.reply(" Ton roll de dexterite est de " +ValRoll+ ", si ton roll est plus haut que ton adversaire tu l'emportes");
						}
						break;
						default:
						break;
					}			
			}
	}

	//LES ROLLS DE DEGATS
	if (message.channel.id==auth.Salon.Jet && petitMessage.startsWith(prefixDegat) && message.member.roles.cache.has(auth.RoleRP.RolePlay))
	{
		message.channel.send(" Tu fais " + Rand(5) + " degats a ton adversaire. Si la constitution de ton adversaire est entre 11 et 15, tes degats sont reduits de 1 ")
	}

	//Commande de roll basique
	if  (message.channel.id==auth.Salon.CommandeBotAll && petitMessage.startsWith(prefixRollBasique))
	{
		var chiffre = message.content.split('d');
		console.log(chiffre);
		console.log(chiffre[1]);
		console.log(chiffre[2]);
		var nombreTirage = chiffre[1].split(' ');
		console.log(nombreTirage[1])
		if (chiffre[2]=='' || chiffre[1]=='')
		{
			message.reply("Il manque le chiffre")
		}
		else
		{
			console.log("je fais le tirage "+nombreTirage[1]);
			switch (Number(nombreTirage[1]))
					{	
					case 1 : var chiffreFinal = Rand(chiffre[2]);
					console.log(chiffreFinal);
					message.reply("Tu as roll " +chiffreFinal);
					break;
					case 2 : message.reply("Tu as roll " +Rand(chiffre[2])+ " , " + Rand(chiffre[2]));
					break;
					case 3 : message.reply("Tu as roll " +Rand(chiffre[2])+ " , " + Rand(chiffre[2])+" , " + Rand(chiffre[2]));
					break;
					case 4 : message.reply("Tu as roll " +Rand(chiffre[2])+ " , " + Rand(chiffre[2])+" , " + Rand(chiffre[2])+" , " + Rand(chiffre[2]));
					break;
					case 5 : message.reply("Tu as roll " +Rand(chiffre[2])+ " , " + Rand(chiffre[2])+" , " + Rand(chiffre[2])+" , " + Rand(chiffre[2])+" , " + Rand(chiffre[2]));
					break;
					default:
					break;
				}
				
		}
	}

	//Commande du tableau des levels
	if ((message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin) && petitMessage.startsWith(prefixLevel) && message.member.roles.cache.has(auth.RoleRP.RolePlay))
	{
	    var fichesCollect = await FichePerso.find({});
		var numberFiche = fichesCollect.length;	
		var ficheCollectZ0 = await FichePerso.findOne({_id: fichesCollect[0]._id});
		var TableauAllXp = [];
			for (var z = 0; z < numberFiche; z++) 
			{	
				console.log("nom n°"+(z+1)+" : "+fichesCollect[z].Username);
				var ficheCollectZ = await FichePerso.findOne({_id: fichesCollect[z]._id});
				var ValueXPz = ficheCollectZ.NiveauXP;
				var Usernamez = ficheCollectZ.Username;
				var UsernamePrenom = ficheCollectZ.Identite.Prenom;
				var UsernameNom = ficheCollectZ.Identite.Nom;
				//TableauAllXp.push([Usernamez,ValueXPz])
				TableauAllXp.push([UsernamePrenom,UsernameNom,ValueXPz])
	        }
		console.log(TableauAllXp)
		var TableauFinal = TableauAllXp.sort(([a, b], [c, d]) => a - c || d - b);
		console.log(TableauFinal)
		var tailletableau = TableauFinal.length;
		var texte = "";
			for (var z = 0; z < numberFiche; z++) 
			{
				//texte = texte+TableauFinal[z][0]+ " : " + TableauFinal[z][1] + " Xp \r";
				texte = texte+TableauFinal[z][0]+texte+TableauFinal[z][1]+ " : " + TableauFinal[z][2] + " Xp \r";
			}
		const exampleEmbed = new Discord.MessageEmbed()
	            .setColor('#16EF0E')
	            .setTitle("Tableau de l'XP par odre decroissant")
	            .setDescription(texte)
	            message.channel.send(exampleEmbed);
	}

	//Commande de check la meteo
	if ((message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin) && petitMessage.startsWith(prefixWhatWeather) && message.member.roles.cache.has(auth.RoleRP.RolePlay))
	{
		var ficheMeteo = await Weather.findOne({_id: "152579868"});
		if (message.member.roles.cache.has(auth.RoleRP.PoleNord))
		{
			message.reply("Temps au pole nord : " +ficheMeteo.PoleNord)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.TempleAus))
		{
			message.reply("Temps au temple austral : " +ficheMeteo.TempleAus)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.NationFeu))
		{
			message.reply("Temps sur la nation du feu : " +ficheMeteo.NationFeu)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.TempleOcc))
		{
			message.reply("Temps au temple occidental : " +ficheMeteo.TempleOcc)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.BaSingSe))
		{
			message.reply("Temps sur la capitale Ba Sing Se : " +ficheMeteo.BaSingSe)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.Omashu))
		{
			message.reply("Temps a Omashu : " +ficheMeteo.Omashu)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.Marais))
		{
			message.reply("Temps dans la region des marais : " +ficheMeteo.Marais)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.Desert))
		{
			message.reply("Temps dans le desert de Si Wong : " +ficheMeteo.Desert)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.TempleOr))
		{
			message.reply("Temps au temple oriental :" +ficheMeteo.TempleOr)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.IleKyoshi))
		{
			message.reply("Temps sur l'ile de Kyoshi : " +ficheMeteo.IleKyoshi)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.TempleBor))
		{
			message.reply("Temps au temple boreal : " +ficheMeteo.TempleBor)
		}
		else if (message.member.roles.cache.has(auth.RoleRP.PoleSud))
		{
			message.reply("Temps au pole sud : " +ficheMeteo.PoleSud)
		}
	}

	//Commande d'ajout de competence
	if ((message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin) && petitMessage.startsWith(prefixAjoutCompetence) && message.member.roles.cache.has(auth.RoleRP.RolePlay))
	{
		var fiche = await FichePerso.findOne({_id: message.author.id}); 
		var argumentUpdate = message.content.split(' ').slice(1);
		var ValueToAdd = message.content.split(' ').slice(2).join(' ');
		console.log(argumentUpdate)
		console.log(argumentUpdate[0])
		console.log(ValueToAdd)
		if (ValueToAdd > fiche.GainCompetence)
		{
			message.reply("Tu n'as plus/pas assez de points a distribuer");
		}
		else
		{	
			switch (argumentUpdate[0]) 
			{
			case "force" : var NewForce = fiche.Competence.Force + Number(ValueToAdd);
			console.log(NewForce);
			await FichePerso.findOneAndUpdate({_id: message.author.id},{'Competence.Force' : NewForce, GainCompetence : fiche.GainCompetence - Number(ValueToAdd) }); 
			message.channel.send("Competence force update")
			break;
			case "constitution" : await FichePerso.findOneAndUpdate({_id: message.author.id},{'Competence.Constitution' : fiche.Competence.Constitution + Number(ValueToAdd),GainCompetence : fiche.GainCompetence - Number(ValueToAdd)}); 
			message.channel.send("Competence constitution update")
			break;
			case "charisme" : await FichePerso.findOneAndUpdate({_id: message.author.id},{'Competence.Charisme' : fiche.Competence.Charisme + Number(ValueToAdd),GainCompetence : fiche.GainCompetence - Number(ValueToAdd)}); 
			message.channel.send("Competence charisme update")
			break;
			case "intelligence" : await FichePerso.findOneAndUpdate({_id: message.author.id},{'Competence.Intelligence' : fiche.Competence.Intelligence + Number(ValueToAdd),GainCompetence : fiche.GainCompetence - Number(ValueToAdd)}); 
			message.channel.send("Competence intelligence update")
			break;
			case "sagesse" : await FichePerso.findOneAndUpdate({_id: message.author.id},{'Competence.Sagesse' : fiche.Competence.Sagesse + Number(ValueToAdd), GainCompetence : fiche.GainCompetence - Number(ValueToAdd)}); 
			message.channel.send("Competence sagesse update")
			break;
			case "dexterite" : await FichePerso.findOneAndUpdate({_id: message.author.id},{'Competence.Dexterite' : fiche.Competence.Dexterite + Number(ValueToAdd),GainCompetence : fiche.GainCompetence - Number(ValueToAdd)}); 
			message.channel.send("Competence dexterite update")
			break;
			default:
			break;
			}
			var fiche = await FichePerso.findOne({_id: message.author.id}); 
			const listeQualite=fiche.Qualite;
			const listeFaiblesse=fiche.Faiblesse;			
			const exampleEmbed = new Discord.MessageEmbed()
	            .setColor('#16EF0E')
	            .setTitle("Fiche de " +fiche.Username)
	            .setDescription(`Nom : `+fiche.Identite.Nom+`
	                         Prenom : `+fiche.Identite.Prenom+`
	                         Age: `+fiche.Identite.Age+`
	                         Metier : `+fiche.Identite.Metier+`
	                         Niveau de Maitrise : `+fiche.NiveauDeMaitrise+`
	                         Niveau XP : `+fiche.NiveauXP+`
	                         Point de Competence : `+fiche.GainCompetence+`
	                         Faiblesse : `+listeFaiblesse[0]+`, `+listeFaiblesse[1])
	            .addFields(
	                { name : `Qualite 1`, value : listeQualite[0], inline : true},
	                { name : `Qualite 2`, value : listeQualite[1], inline : true},
	                { name : `Defaut 1`, value : fiche.Defaut, inline : true}
	            )
	            .addFields(
	                { name : `Force`, value : fiche.Competence.Force, inline : true},
	                { name : `Constitution`, value : fiche.Competence.Constitution, inline : true},
	                { name : `Charisme`, value : fiche.Competence.Charisme, inline : true}
	            )
	            .addFields(
	                { name : `Intelligence`, value : fiche.Competence.Intelligence, inline : true},
	                { name : `Sagesse`, value : fiche.Competence.Sagesse, inline : true},
	                { name : `Dexterite`, value : fiche.Competence.Dexterite, inline : true}
	            )
	            .setThumbnail(message.author.avatarURL())
	            message.channel.send(exampleEmbed);
		}
	}

	//Commande pour retirer TOUTE l'XP a un joueur PAR UN ADMIN
	if ((message.channel.id==auth.Salon.Jet || message.channel.id==auth.Salon.SalonBotAdmin) && message.member.roles.cache.has(auth.RoleRP.RoleStaff) && petitMessage.startsWith(prefixresetXP))
	{
		const taggedUser = message.mentions.users.first();
		const argsNumber = message.content.split(' ').slice(2); // All arguments behind the command name with the prefix
		var Quantity = argsNumber.join(' '); // Amount of Joker
			if (!Quantity) Quantity=0;
			if (isNaN(Quantity)) Quantity=0;
			if (!taggedUser) return message.author.send("Vous n'avez pas saisi de pseudo à chercher.").then(msg => msg.delete({ timeout: 10000 }));
        	if (isNaN(taggedUser)) return message.author.send("Le paramètre que vous avez saisi n'est pas un pseudo.").then(msg => msg.delete({ timeout: 10000 }));
		var fiche = await FichePerso.findOne({_id: taggedUser.id}); 
		await FichePerso.findOneAndUpdate({_id: taggedUser.id},{NiveauXP: 0});
		client.channels.cache.get(auth.Salon.SalonBotAdmin).send("<@"+taggedUser.id+"> a ete remise a 0");
	}

});

function createJobList() 
{
	const JobList = new ListeMetier ({
	_id: "15257987",
    Souverain : 500,
    Princesse : 350,
    Pretresse : 200,
    AgentSecret : 500,
    Probender : 200,
    Soldat : 300,
    Commercant : 300,
    Ministre : 400,
    Mafieux : 200,
    Journaliste : 200,
    Artiste : 200,
    Moine : 200,
    CouteauSuisse : 150,
    Jobless : 0,
	time: Date()
	});
JobList.save().then(result => console.log(result)).catch(err => console.log(err));
}

function createWeather()
{
	const Meteo = new Weather ({
    _id: "152579868",
    PoleNord : '🌨️',
    TempleAus : '🌨️',
    NationFeu : '🌨️',
    TempleOcc : '🌨️',
    BaSingSe : '🌨️',
    Omashu : '🌨️',
    Marais : '🌨️',
    Desert : '🌨️',
    TempleOr : '🌨️',
    IleKyoshi : '🌨️',
    TempleBor : '🌨️',
    PoleSud : '🌨️',
    Nuit : '🌑',
    CounterLune : 0,
    time: Date()
	});
	Meteo.save().then(result => console.log(result)).catch(err => console.log(err));

}


function createBoutique() 
{
	const Boutique = new BoutiqueMaitrise ({
	_id: "15257986",
	Maitrise2 : "2 000 XP",
	Maitrise3 : "3 000 XP",
	Maitrise4 : "4 000 XP",
	Maitrise5 : "5 000 XP",
	Maitrise6 : "6 000 XP",
	Maitrise7 : "7 000 XP",
	Maitrise8 : "8 000 XP",
	Maitrise9 : "9 000 XP",
	Maitrise10 : "10 000 XP",
	Maitrise11 : "11 000 XP",
	Maitrise12 : "12 000 XP",
	Maitrise13 : "13 000 XP",
	Maitrise14 : "14 000 XP",
	Maitrise15 : "15 000 XP",
	Maitrise16 : "16 000 XP",
	Maitrise17 : "17 000 XP",
	Maitrise18 : "18 000 XP",
	Maitrise19 : "19 000 XP",
	Maitrise20 : "20 000 XP",
	time: Date()
	});
Boutique.save().then(result => console.log(result)).catch(err => console.log(err));
}

function createFichePerso(message,Niveau) {

    const Identity = new FichePerso({
    _id: message.author.id,
    Username: message.author.username,
    Identite :{
        Nom : "Nom",
        Prenom : "Prenom",
        Age : 0, 
        Sexe : "Sexe",
        Metier : "Metier",
        Categorie : "Categorie"
    },
    GainCompetence : 0,
    NiveauDeMaitrise : Niveau,
    NiveauXP : 0,
    Qualite : ["Qualite1","Qualite2"],
    Defaut : "Defaut1",
    Faiblesse :["Faiblesse1","Faiblesse2"],
    Competence :{
    	Force : 0,
    	Constitution : 0,
        Charisme : 0, 
        Intelligence : 0, 
        Sagesse : 0, 
        Dexterite : 0
    },
    LienFichePerso : "Lien",
    time: Date()
    });

Identity.save().then(result => console.log(result)).catch(err => console.log(err));

}

function Rand(valeur){
    return Math.floor(Math.random() * valeur +1);
}