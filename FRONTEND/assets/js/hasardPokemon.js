let endpoint = '/hasard';

fetch(endpoint)
    .then(
        function (response) {
            if (response.status == 200) {
                response.json()
                    .then(
                        function (data) {
                            let contenu = document.getElementById('pokemonHasard');
                            contenu.appendChild(randomPokemon(data));
                        }
                    );
            } else {
                console.log('Status de la réponse: ' + response.status);
            }
        }
    );

function randomPokemon(dataPokemon) {
    let pokemonHasard = document.getElementById('pokemonHasard');
    let id = dataPokemon.id;
    let nom = dataPokemon.name.french;
    let image = dataPokemon.image;
    let type = dataPokemon.type;
    let vie = dataPokemon.base.HP;
    let attaque = dataPokemon.base.Attack;
    let defense = dataPokemon.base.Defense;
    let attaqueSpe = dataPokemon.base['Sp. Attack'];
    let defenseSpe = dataPokemon.base['Sp. Defense'];
    let vitesse = dataPokemon.base.Speed;

    let titre = document.createElement('h2');
    titre.innerText = "Voici votre pokemon choisit au hasard !";

    let img = document.createElement('img');
    img.src = image;
    img.width = 200;
    img.height = 200;
    contenu.appendChild(img);

    let para = document.createElement('p');
    para.innerHTML = `<strong>ID :</strong> ${id} <br>
                      <strong>Nom :</strong> ${nom} <br>
                      <strong>Type :</strong> ${type.join(', ')} <br>
                      <strong>Vie :</strong> ${vie} <br>
                      <strong>Attaque :</strong> ${attaque} <br>
                      <strong>Défense :</strong> ${defense} <br>
                      <strong>Attaque Spéciale :</strong> ${attaqueSpe} <br>
                      <strong>Défense Spéciale :</strong> ${defenseSpe} <br>
                      <strong>Vitesse :</strong> ${vitesse} <br>`;

    pokemonHasard.appendChild(titre);
    pokemonHasard.appendChild(para);
    


    return pokemonHasard;
}