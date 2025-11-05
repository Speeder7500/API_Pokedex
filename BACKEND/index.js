/**
 * Serveur Backend Pokedex
 */

// Définition de l'emplacement des fichier bases de données
const POKEDEX_SRC = "./DATA/pokedex.json";

// Définition de l'emplacement des images (chemin côté client)
const IMAGES_SRC = "/FILES/images";

// Définition du port
const PORT = 5001;

/**
 * Lancer un serveur express sur un port défini
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

// Servir les images statiques pour que les chemins renvoyés au client soient accessibles
app.use('/FILES/images', express.static(path.join(__dirname, 'FILES', 'images')));

// Lancement du serveur et attendre
app.listen(
    PORT,
    '172.16.195.254',
    () => {
        console.log(`Server Pokedex is listening on ${PORT}`);
    }
)

/**
 * Route par défaut qui renvoie vers une page html
*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname , '../FRONTEND/index.html'));
});
    

/**
 * Création de la route pour voir tout les pokemons
 */
app.get('/tous', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            res.status(500).send('Erreur serveur');
            return;
        }
        // Convertion du json en objet js
        const pokedex = JSON.parse(data);

        pokedex.forEach(pokemon => {
            let ImgPokemon;
            if (pokemon.id < 100 && pokemon.id >= 10) {
                ImgPokemon = `${IMAGES_SRC}/0${pokemon.id}.png`;
            }
            else if (pokemon.id < 10) {
                ImgPokemon = `${IMAGES_SRC}/00${pokemon.id}.png`;
            }
            else {
                ImgPokemon = `${IMAGES_SRC}/${pokemon.id}.png`;
            }
            pokemon.image = ImgPokemon;
        });

        // Renvoyer le contenu de la source
        res.json(pokedex);
    });
});

/**
 * Création de la route du hasard
 */
app.get('/hasard', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            res.status(500).send('Erreur serveur');
            return;
        }

        const pokedex = JSON.parse(data);
        const minId = 0;
        const maxId = pokedex.length - 1;
        console.log(maxId);
        // Choix d'un id au hasard
        const randomIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        const randomPokemon = pokedex[randomIndex];
        //Affichage du pokemon corrspondant à l'id précédent.
        res.json(randomPokemon);
    });
});

/**
 * Création de la route du combat
 */
app.get('/combat', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            res.status(500).send('Erreur serveur');
            return;
        }

        const pokedex = JSON.parse(data);
        const minId = 0;
        const maxId = pokedex.length - 1;
        
        // Choix de deux id au hasard
        let rdmIndex1 = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        let rdmPokemon1 = pokedex[rdmIndex1];

        let rdmIndex2 = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        while (rdmIndex2 === rdmIndex1) { // Assurer que les deux pokémons sont différents
            rdmIndex2 = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        }
        let rdmPokemon2 = pokedex[rdmIndex2];

        //Affichage des deux pokémons pour le combat
        res.json({ pokemon1: rdmPokemon1, pokemon2: rdmPokemon2 });
    });
});


/**
 * Création de la route permettant de trouver un pokemon par son id
 */
app.get('/pokemon/:data', (req, res) => {
    const Data = (req.params.data);
    console.log(Data);
    if (/^\d+$/.test(Data)) { // vérification si c'est un nombre entier positif
        fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            const pokedex = JSON.parse(data);
            const pokemon = pokedex[Data -1];

            if (pokemon) {
                let ImgPokemon;
                console.log(pokemon);
                if (pokemon.id < 100 && pokemon.id >= 10) {
                    ImgPokemon = `${IMAGES_SRC}/0${pokemon.id}.png`;
                    console.log(ImgPokemon);
                }
                else if (pokemon.id < 10) {
                    ImgPokemon = `${IMAGES_SRC}/00${pokemon.id}.png`;
                    console.log(ImgPokemon);
                }
                else {
                    ImgPokemon = `${IMAGES_SRC}/${pokemon.id}.png`;
                    console.log(ImgPokemon);
                }
                pokemon.image = ImgPokemon;
                res.json(pokemon);
            } else {
                res.status(400).send('Pokémon non trouvé')
            }
        });
    } else if (/^\p{L}+$/u.test(Data)) {// Vérification si c'est une chaîne de caractère (lettres Unicode uniquement)
        // Lire le fichier JSON contenant le pokedex
        fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            // Normaliser la saisie pour gérer correctement les caractères Unicode
            // - on utilise Array.from pour manipuler correctement les caractères Unicode
            const chars = Array.from(Data);

            // Capitaliser : première lettre en majuscule, le reste en minuscules
            // Exemple : "pikachu" -> "Pikachu", "ÉLODIE" -> "Élodie"
            const nom = chars.length
                ? chars[0].toUpperCase() + chars.slice(1).join('').toLowerCase()
                : '';

            // Parser le fichier JSON en tableau JavaScript
            const pokedex = JSON.parse(data);

            // Rechercher le Pokémon dans le tableau en comparant les noms
            // On compare `name.english` et `name.french`
            const pokemon = pokedex.find(p => {
                if (!p || !p.name) return false;
                const names = [p.name.english, p.name.french].filter(Boolean);
                return names.some(n => n === nom);
            });

            // Si trouvé, renvoyer le Pokémon, sinon 400
            if (pokemon) {
                let ImgPokemon;
                console.log(pokemon);
                if (pokemon.id < 100 && pokemon.id >= 10) {
                    ImgPokemon = `${IMAGES_SRC}/0${pokemon.id}.png`;
                    console.log(ImgPokemon);
                }
                else if (pokemon.id < 10) {
                    ImgPokemon = `${IMAGES_SRC}/00${pokemon.id}.png`;
                    console.log(ImgPokemon);
                }
                else {
                    ImgPokemon = `${IMAGES_SRC}/${pokemon.id}.png`;
                    console.log(ImgPokemon);
                }
                pokemon.image = ImgPokemon;
                res.json(pokemon);
            } else {
                res.status(400).send('Pokémon non trouvé')
            }
        });
    } else {
        res.end('Veuillez entrer uniquement des lettres ou des nombres superieur a 1.');
    }
});

app.use(express.static(path.join(__dirname, '../FRONTEND')));