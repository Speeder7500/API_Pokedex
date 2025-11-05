// définition du endpoint
let endpoint = '/tous';

fetch(endpoint)
    .then(
        function (response) {
            if (response.status == 200) {
                response.json()
                    .then(
                        function (datas) {
                            let tabUser = document.getElementById('userLines');
                            datas.forEach(
                                function (pokemon) {
                                    tabUser.appendChild(allPokemon(pokemon));
                                }
                            )
                        }
                    )
            } else {
                console.log('Status de la réponse: ' + response.status);
            }
        }
    );

function allPokemon(dataPokemon){
    // définition des variables
    let id = dataPokemon.id;
    let nom = dataPokemon.name.french;

    if (id < 100 && id >= 10) {
        id = `0${dataPokemon.id}`;
    }
    else if (id < 10) {
        id = `00${dataPokemon.id}`;
    }
    // création de la ligne
    let ligne = document.createElement('tr');

    // création des colonnes
    let colId = document.createElement('td');
    let colNom = document.createElement('td');
    let colImg = document.createElement('td');

    let img = document.createElement('img');
    img.src = dataPokemon.image;
    img.width = 50;
    img.height = 50;
    
    colImg.appendChild(img);
    ligne.appendChild(colImg);

    // ajout des valeurs aux colonnes
    colId.textContent = id;
    colNom.textContent = nom;

    // ajout des colonnes à la ligne
    ligne.appendChild(colId);
    ligne.appendChild(colNom);
    ligne.appendChild(colImg);

    return ligne;
}