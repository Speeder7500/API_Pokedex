/**
 * Serveur Backend Pokedex
 */

// Définition de l'emplacement des fichier bases de données
const POKEDEX_SRC = "./DATA/pokedex.json";
const ITEMS_SRC = "./DATA/items.json";

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
    res.sendFile(path.join(__dirname, '../FRONTEND/index.html'));
});


/**
 * Création de la route pour voir tout les pokemons
 * @ returns {void}
 */
app.get('/tousLesPokemon', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            res.status(500).send('Erreur serveur');
            return;
        }
        // Convertion du json en objet js
        const pokedex = JSON.parse(data);

        // Ajout des images aux pokémons
        pokedex.forEach(pokemon => {
            let ImgPokemon;
            // création du chemin de l'image
            // ajouter un préfixe 0 ou 00 si besoin
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
 * @ returns {void}
 */
app.get('/hasard', (req, res) => {
    // Lire le fichier JSON contenant le pokedex
    fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            res.status(500).send('Erreur serveur');
            return;
        }

        // Convertion du json en objet js
        const pokedex = JSON.parse(data);
        const minId = 0;
        const maxId = pokedex.length - 1;
        console.log(maxId);
        // Choix d'un id au hasard
        const randomIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        const randomPokemon = pokedex[randomIndex];

        // création du chemin de l'image
        // ajouter un préfixe 0 ou 00 si besoin
        if (randomPokemon.id < 100 && randomPokemon.id >= 10) {
            randomPokemon.image = `${IMAGES_SRC}/0${randomPokemon.id}.png`;
        }
        else if (randomPokemon.id < 10) {
            randomPokemon.image = `${IMAGES_SRC}/00${randomPokemon.id}.png`;
        }
        else {
            randomPokemon.image = `${IMAGES_SRC}/${randomPokemon.id}.png`;
        }
        //Affichage du pokemon corrspondant à l'id précédent.
        res.json(randomPokemon);
    });
});

/**
 * Création de la route du combat
 * @ returns {void}
 */
app.get('/combat', (req, res) => {
    // Lire le fichier JSON contenant le pokedex
    fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            res.status(500).send('Erreur serveur');
            return;
        }

        // Convertion du json en objet js
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
 * @ returns {void}
 */
app.get('/pokemon/:data', (req, res) => {
    // Récupération de la donnée (id ou nom)
    const Data = (req.params.data);
    console.log(Data);
    if (/^\d+$/.test(Data)) { // vérification si c'est un nombre entier positif
        fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            // Parser le fichier JSON en tableau JavaScript
            const pokedex = JSON.parse(data);
            const pokemon = pokedex[Data - 1];

            if (pokemon) {
                // création du chemin de l'image
                // ajouter un préfixe 0 ou 00 si besoin
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
                // Ajouter le chemin de l'image au Pokémon
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
                // création du chemin de l'image
                let ImgPokemon;
                console.log(pokemon);
                // ajouter un préfixe 0 ou 00 si besoin
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
                // Ajouter le chemin de l'image au Pokémon
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


/**
 * Création de la route permettant de trouver des pokémons par leur type
 * @ returns {void}
 */
app.get('/type/:type', (req, res) => {
    /**
     * Dictionnaire de traduction français -> anglais pour les types
     */
    const typeTranslations = {
        'normal': 'Normal',
        'combat': 'Fighting',
        'vol': 'Flying',
        'poison': 'Poison',
        'sol': 'Ground',
        'roche': 'Rock',
        'insecte': 'Bug',
        'spectre': 'Ghost',
        'acier': 'Steel',
        'feu': 'Fire',
        'eau': 'Water',
        'plante': 'Grass',
        'electrique': 'Electric',
        'psy': 'Psychic',
        'glace': 'Ice',
        'dragon': 'Dragon',
        'tenebres': 'Dark',
        'fee': 'Fairy',
    };
    // Lire le fichier JSON contenant le pokedex
    fs.readFile(POKEDEX_SRC, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            res.status(500).send('Erreur serveur');
            return;
        }
        const type = req.params.type;
        // Vérification si c'est une chaîne de caractère (lettres Unicode uniquement)
        if (/^\p{L}+$/u.test(type)) {
            // Mettre la première lettre en majuscule et le reste en minuscules
            const typeSearch = Array.from(type);
            const typeFormatted = typeSearch.length
                ? typeSearch[0].toUpperCase() + typeSearch.slice(1).join('').toLowerCase()
                : '';

            // Vérifier si c'est un type français et le convertir en anglais
            let typeEnglish = typeTranslations[typeFormatted.toLowerCase()] || typeFormatted;
            console.log(`Type recherché (français): ${typeFormatted}, Type anglais: ${typeEnglish}`);

            if (typeEnglish === undefined) {
                res.status(400).send('Type de pokémon inexistant');
                return;
            }

            // Filtrer les pokémons par type incluant la recherche
            const pokedex = JSON.parse(data);
            const pokemonsType = pokedex.filter(pokemon => pokemon.type.includes(typeEnglish));
            if (pokemonsType.length === 0) {
                res.status(400).send('Aucun pokémon trouvé pour ce type les types existants sont : ' + Object.keys(typeTranslations).join(', '));
                return;
            }

            // Ajout des images aux pokémons trouvés
            pokemonsType.forEach(pokemon => {
                let ImgPokemon;
                // création du chemin de l'image
                // ajouter un préfixe 0 ou 00 si besoin
                if (pokemon.id < 100 && pokemon.id >= 10) {
                    ImgPokemon = `${IMAGES_SRC}/0${pokemon.id}.png`;
                }
                else if (pokemon.id < 10) {
                    ImgPokemon = `${IMAGES_SRC}/00${pokemon.id}.png`;
                }
                else {
                    ImgPokemon = `${IMAGES_SRC}/${pokemon.id}.png`;
                }
                // Ajouter le chemin de l'image au Pokémon
                pokemon.image = ImgPokemon;
            });

            res.json(pokemonsType);
        }
        else {
            res.status(400).send('Veuillez entrer uniquement des lettres pour le type de pokémon.');
        }
    })
});

app.get('/tousLesItems', (req, res) => {
    // Lire le fichier JSON contenant
    fs.readFile(ITEMS_SRC, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            res.status(500).send('Erreur serveur');
            return;
        }
        // Convertion du json en objet js
        const items = JSON.parse(data);

        // Renvoyer le contenu de la source
        res.json(items);
    });
})

/**
 * Dictionnaire de traduction français -> anglais pour les items
 */
const itemsTranslations = {
    'potion': 'Potion',
    'antidote': 'Antidote',
    'soin brûlure': 'Burn Heal',
    'soin gel': 'Ice Heal',
    'réveil': 'Awakening',
    'soin paralysie': 'Paralyze Heal',
    'restauration': 'Full Restore',
    'potion max': 'Max Potion',
    'potion super': 'Hyper Potion',
    'super potion': 'Super Potion',
    'soins complets': 'Full Heal',
    'rappel': 'Revive',
    'rappel max': 'Max Revive',
    'eau fraîche': 'Fresh Water',
    'limonade': 'Soda Pop',
    'lait': 'Lemonade',
    'lait meumeu': 'Moomoo Milk',
    'poudre énergie': 'Energy Powder',
    'racine énergie': 'Energy Root',
    'poudre soin': 'Heal Powder',
    'herbe réveil': 'Revival Herb',
    'éther': 'Ether',
    'éther max': 'Max Ether',
    'élixir': 'Elixir',
    'élixir max': 'Max Elixir',
    'miel miel': 'Lava Cookie',
    'jus baie': 'Berry Juice',
    'cendre sacrée': 'Sacred Ash',
    'augmentation hp': 'HP Up',
    'protéine': 'Protein',
    'fer': 'Iron',
    'carbos': 'Carbos',
    'calcium': 'Calcium',
    'bonbon rare': 'Rare Candy',
    'montée pp': 'PP Up',
    'zinc': 'Zinc',
    'pp max': 'PP Max',
    'gâteau ancien': 'Old Gateau',
    'écran spéc': 'Guard Spec.',
    'coup critique': 'Dire Hit',
    'attaque+': 'X Attack',
    'défense+': 'X Defense',
    'vitesse+': 'X Speed',
    'précision+': 'X Accuracy',
    'spa+': 'X Sp. Atk',
    'spd+': 'X Sp. Def'
};

app.get('/item/:data', (req, res) => {
    // Récupération de la donnée (id ou nom)
    const Data = (req.params.data);
    console.log(Data);
    if (/^\d+$/.test(Data)) { // vérification si c'est un nombre entier positif
        fs.readFile(ITEMS_SRC, 'utf-8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            // Parser le fichier JSON en tableau JavaScript
            const items = JSON.parse(data);
            const item = items.find(i => i.id === parseInt(Data));

            if (item) {
                res.json(item);
            } else {
                res.status(400).send('Item non trouvé')
            }
        });
    } else if (/^\p{L}+(\s\p{L}+)*$/u.test(Data)) {// Vérification si c'est une chaîne de caractère (lettres Unicode et espaces)
        // Lire le fichier JSON contenant les items
        fs.readFile(ITEMS_SRC, 'utf-8', (err, data) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            // Normaliser la saisie pour gérer correctement les caractères Unicode
            // Traiter chaque mot séparément pour maintenir les espaces
            const words = Data.trim().split(/\s+/);
            const nom = words.map(word => {
                const chars = Array.from(word);
                return chars.length
                    ? chars[0].toUpperCase() + chars.slice(1).join('').toLowerCase()
                    : '';
            }).join(' ');

            // Vérifier si c'est un item français et le convertir en anglais
            let itemEnglish = itemsTranslations[nom.toLowerCase()] || nom;
            console.log(`Item recherché (français): ${nom}, Item anglais: ${itemEnglish}`);

            // Parser le fichier JSON en tableau JavaScript
            const items = JSON.parse(data);

            // Rechercher l'Item dans le tableau en comparant les noms anglais
            const item = items.find(i => {
                if (!i || !i.name) return false;
                const itemName = i.name.english || '';
                return itemName === itemEnglish;
            });

            // Si trouvé, renvoyer l'Item, sinon 400
            if (item) {
                res.json(item);
            } else {
                res.status(400).send('Item non trouvé')
            }
        });
    } else {
        res.end('Veuillez entrer uniquement des lettres ou des nombres superieur a 1.');
    }
});

app.use(express.static(path.join(__dirname, '../FRONTEND')));