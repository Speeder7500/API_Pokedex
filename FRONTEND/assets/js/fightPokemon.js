let endpoint = "/combat";

// rendre ces variables accessibles au gestionnaire de clic
let pokemon1;
let pokemon2;

fetch(endpoint)
    .then(
        function (response) {
            if (response.status == 200) {
                response.json()
                    .then(
                        function (datas) {
                            pokemon1 = datas.pokemon1;
                            pokemon2 = datas.pokemon2;
                            let firstPokemon = document.getElementById('firstPokemon');
                            let secondPokemon = document.getElementById('secondPokemon');
                            firstPokemon.appendChild(fightPokemon(pokemon1));
                            secondPokemon.appendChild(fightPokemon(pokemon2));
                        }
                    )
            } else {
                console.log('Status de la réponse: ' + response.status);
            }
        }
    );

function fightPokemon(dataPokemon) {
    // définition des variables
    let id = dataPokemon.id;
    let nom = dataPokemon.name.french;
    let image = dataPokemon.image;
    let pv = dataPokemon.base.HP;
    let attack = dataPokemon.base.Attack;
    let defense = dataPokemon.base.Defense;

    // mise en forme de l'id pour l'image

    if (id < 100 && id >= 10) {
        id = `0${dataPokemon.id}`;
    }
    else if (id < 10) {
        id = `00${dataPokemon.id}`;
    }

    let ligne = document.createElement('tr');

    let colId = document.createElement('td');
    let colNom = document.createElement('td');
    let colImg = document.createElement('td');
    let colPV = document.createElement('td');
    let colAttack = document.createElement('td');
    let colDefense = document.createElement('td');

    let img = document.createElement('img');
    img.src = image;
    img.width = 50;
    img.height = 50;

    colImg.appendChild(img);
    ligne.appendChild(colImg);

    colId.textContent = id;
    colNom.textContent = nom;
    colPV.textContent = pv;
    colAttack.textContent = attack;
    colDefense.textContent = defense;

    ligne.appendChild(colId);
    ligne.appendChild(colNom);
    ligne.appendChild(colImg);
    ligne.appendChild(colPV);
    ligne.appendChild(colAttack);
    ligne.appendChild(colDefense);

    return ligne;
}

const fightButton = document.getElementById('startFightButton');
fightButton.addEventListener('click', function() {
    if (confirm("Voulez-vous vraiment lancer le combat entre ces deux pokémons ?")) {
        let fightResult = fight(pokemon1, pokemon2);
        let fightResultDiv = document.getElementById('fightResult');
        fightResultDiv.textContent = fightResult;
        renderFightControls();
    } else {
        alert("Le combat a été annulé.");
    }
});

function renderFightControls() {
    // évite doublons
    const existing = document.getElementById('fightControls');
    if (existing) return;

    const container = document.createElement('div');
    container.id = 'fightControls';
    container.style.marginTop = '8px';

    const newBtn = document.createElement('button');
    newBtn.id = 'newFightButton';
    newBtn.textContent = 'Nouveau combat';
    newBtn.addEventListener('click', function() {
        fetch(endpoint)
            .then(res => {
                if (res.status === 200) return res.json();
                throw new Error('Erreur réponse ' + res.status);
            })
            .then(datas => {
                pokemon1 = datas.pokemon1;
                pokemon2 = datas.pokemon2;
                updatePokemonDisplay();
                const fightResultDiv = document.getElementById('fightResult');
                fightResultDiv.textContent = '';
                // retirer les contrôles existants pour être prêt pour un nouveau résultat
                const controls = document.getElementById('fightControls');
                if (controls) controls.remove();
                // lancer automatiquement le nouveau combat et afficher le résultat
                const fightResult = fight(pokemon1, pokemon2);
                fightResultDiv.textContent = fightResult;
                // recréer les contrôles pour ce nouveau résultat
                renderFightControls();
            })
            .catch(err => console.error(err));
    });

    container.appendChild(newBtn);

    const fightResultDiv = document.getElementById('fightResult');
    if (fightResultDiv && fightResultDiv.parentNode) {
        fightResultDiv.parentNode.appendChild(container);
    } else {
        document.body.appendChild(container);
    }
}

function updatePokemonDisplay() {
    const firstPokemon = document.getElementById('firstPokemon');
    const secondPokemon = document.getElementById('secondPokemon');
    if (firstPokemon) {
        firstPokemon.innerHTML = '';
        firstPokemon.appendChild(fightPokemon(pokemon1));
    }
    if (secondPokemon) {
        secondPokemon.innerHTML = '';
        secondPokemon.appendChild(fightPokemon(pokemon2));
    }
}

function fight(pokemon1, pokemon2) {
    // Récupération des points de vie de chaque pokémons
    let pvPokemon1 = parseInt(pokemon1.base.HP);
    let pvPokemon2 = parseInt(pokemon2.base.HP);
    let attackPokemon1 = parseInt(pokemon1.base.Attack);
    let attackPokemon2 = parseInt(pokemon2.base.Attack);
    let defensePokemon1 = parseInt(pokemon1.base.Defense);
    let defensePokemon2 = parseInt(pokemon2.base.Defense);

    // Boucle de combat jusqu'a ce qu'un des pokémons n'ait plus de vie
    while (pvPokemon1 > 0 && pvPokemon2 > 0) {
        // le pokemon1 attaque le pokemon2
        pvPokemon2 = Math.max(0, pvPokemon2 - Math.max(0, attackPokemon1 - defensePokemon2));
        if (pvPokemon2 <= 0) {
            return(`${pokemon1.name.french} a gagné le combat !`);
        }
        // le pokemon2 attaque le pokemon1
        pvPokemon1 = Math.max(0, pvPokemon1 - Math.max(0, attackPokemon2 - defensePokemon1));
        if (pvPokemon1 <= 0){
            return(`${pokemon2.name.french} a gagné le combat !`);
        }
    }
}