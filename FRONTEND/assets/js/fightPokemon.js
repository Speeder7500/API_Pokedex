let endpoint = "/combat";

fetch(endpoint)
    .then(
        function (response) {
            if (response.status == 200) {
                response.json()
                    .then(
                        function (datas) {
                            let pokemon1 = datas.pokemon1;
                            let pokemon2 = datas.pokemon2;
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

    let img = document.createElement('img');
    img.src = image;
    img.width = 50;
    img.height = 50;

    colImg.appendChild(img);
    ligne.appendChild(colImg);

    colId.textContent = id;
    colNom.textContent = nom;

    ligne.appendChild(colId);
    ligne.appendChild(colNom);
    ligne.appendChild(colImg);

    return ligne;
}