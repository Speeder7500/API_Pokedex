let endpoint = '/hasard';

fetch(endpoint)
    .then(
        function (response) {
            if (response.status == 200) {
                response.json()
                    .then(
                        function (dataPokemon) {
                            let divPokemon = document.getElementById('pokemonHasard');
                            divPokemon.appendChild(rdmPokemon(dataPokemon));
                        }
                    )
            } else {
                console.log('Status de la réponse: ' + response.status);
            }
        }
    );

function rdmPokemon(data){
    // définition des variables
    let id = data.id;
    let nom = data.name.french;
    let image = data.image;
    let type = data.type;
    let hp = data.base.HP;
    let attack = data.base.Attack;
    let defense = data.base.Defense;
    let speed = data.base.Speed;

    if (id < 100 && id >= 10) {
        id = `0${data.id}`;
    }
    else if (id < 10) {
        id = `00${data.id}`;
    }

    let para = document.createElement('p');
    para.innerHTML = `<strong>ID :</strong> ${id} <br>
                      <strong>Nom :</strong> ${nom} <br>
                      <strong>Type :</strong> ${type.join(', ')} <br>
                      <strong>HP :</strong> ${hp} <br>
                      <strong>Attack :</strong> ${attack} <br>
                      <strong>Defense :</strong> ${defense} <br>
                      <strong>Speed :</strong> ${speed} <br>`;
                          
    let img = document.createElement('img');
    img.src = image;
    img.width = 200;
    img.height = 200;
    para.appendChild(img);
    
    return para;
}