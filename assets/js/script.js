// Variables
const URL_API = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";
let contentCards = document.getElementById("contentCards");
let contentPagination = document.getElementById("contentPagination");

// Consumir API Datos
const getListPokemons = (url_api) => {
    return fetch(url_api)
    .then((response) => response.json())
    .then((json) => {
        let data_result = json['results'];
        let data_info = json;
        let collectionPokemons = [];

        if (data_result.length > 0) {
            data_result.forEach((val, key) => {
                getDataPokemon(val.url, (res_cb) => {
                    let object_pokemon_res = res_cb;
                    let info_pokemon = {
                        'name': val.name, 
                        'url': val.url, 
                        ...object_pokemon_res
                    }
                    collectionPokemons.push(info_pokemon);
                    if (collectionPokemons.length === data_result.length) {
                        assignData(collectionPokemons);
                    }
                });
            });
        } else {
            collectionPokemons = [];
        }
        getPagination(data_info);
    })
    .catch((error) => {
    });
}
const getDataPokemon = (url_api_pokemon, cb) => {
    return fetch(url_api_pokemon)
    .then((response) => response.json())
    .then((json) => {
        let data_pokemon = json
        if (data_pokemon) {
            cb(data_pokemon);
        } else {
            cb(false);
        }
    })
    .catch((error) => {
    });
}


// Llena cards de personajes
const assignData = (data_result) => {
    let contentResponse = '';
    if (data_result.length > 0) {
        data_result.forEach(element => {
            contentResponse += `
                 <div class="col">
                    <div class="row p-0 m-0 bg-light" style="border: 1px solid #f4f4f4; border-radius: 10px;">
                        <div class="col p-0 m-0 text-center">
                            <img src="` + element.sprites.other["official-artwork"].front_default + `" width="200px" alt="" style="border-radius: 10px;">
                        </div>
                        <div class="col p-2 m-0">
                            <h2 class="fw-bold">` + capitalizeText(element.name) + `</h2>
                            <h3>#: ` + element.id + `</h3>
                            <small>Tipo: </small>
                            <br>`;
                            element.types.forEach((valType) => {
                                contentResponse += `<span class="badge rounded-pill bg-primary">` + capitalizeText(valType.type.name) + `</span>&nbsp;`;
                            });
            contentResponse += `
                            <br>
                            <small>Altura: <strong>` + element.height + ` Mt</strong></small><br>
                            <small>Peso: <strong>` + element.weight + ` Kg</strong></small><br>
                        </div>
                    </div>
                </div>`;
        });    
    } else {
        contentResponse += '';
    }
    
    contentCards.innerHTML = contentResponse;
}
// Paginacion
const getPagination = (data_info) => {
    let prevDisabled = (data_info.previous == null) ? "disabled" : "";
    let nextDisabled = (data_info.next == null) ? "disabled" : "";

    let htmlPagination = "";
    // htmlPagination += "Previous";
    // htmlPagination += "Next"
    let url_prev = (data_info.previous == null) ? null : data_info.previous;
    let url_next = (data_info.next == null) ? null : data_info.next;
    htmlPagination += `
    <ul class="pagination justify-content-center">
        <li class="page-item ` + prevDisabled + `" onclick="getListPokemons('` + url_prev + `')">
            <a class="page-link" href="#" tabindex="-1">Previous</a>
        </li>
        &nbsp;
        &nbsp;
        <li class="page-item ` + nextDisabled + `" onclick="getListPokemons('` + url_next + `')">
            <a class="page-link" href="#">Next</a>
        </li>
    </ul>`;
    contentPagination.innerHTML = htmlPagination;

}

// Funciones de utilidad
function capitalizeText(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Invocar API
getListPokemons(URL_API);
