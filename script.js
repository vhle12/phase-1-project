/*
POKÉMON FILTER
// user should be able to filter our pokemon that fit within certain criteria submitted by the user
// provide a name text box for user to search by name
// provide type drop down menu the displays all pokemon types. if user selects only type then website should display all pokemon with that type.
// after submitting the user should see the image of the pokemon and its name that fits the criteria of their submission
// when user hovers over the image the website should display the pokemon's type(s), ability(s), height, weight, and base experience
// when clicking on the image the website should play audio of the cries.latest from the database
// alert() is a method used to create a pop up screen on browser
    // alert is not good in the DisplayByType function
// innerHTML returns the html content of an element allows you to interact with
*/

// Function to fetch and display Pokemon data based on user input (name or type)
function filterPokemon() {
    const pokemonName = document.querySelector('#pokemon-name').value.toLowerCase();
    const selectedType = document.querySelector('#type').value.toLowerCase();

    if (pokemonName) {
        fetchPokemonByName(pokemonName);
    } else if (selectedType) {
        fetchPokemonByType(selectedType);
    } else {
        alert('Please enter a Pokemon name or select a type.');
    }
}

// Fetching data from name list in data base
function fetchPokemonByName(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            displayByName(data);
        })
        .catch(error => {
            console.log('Error:', error);
            alert('Pokemon not found!');
        });
}

//Fetching data from type list in data base
function fetchPokemonByType(selectedType) {
    fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
        .then(response => response.json())
        .then(data => {
            displayByType(data.pokemon);
        })
        .catch(error => {
            console.log('Error:', error);
            alert('Failed to fetch Pokemon of this type.');
        });
}

//function to for individual pokemon
function displayByName(pokemonData) {
    const pokemonContainer = document.getElementById('pokemon-container');
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('card');
    pokemonCard.innerHTML = `
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" />
        <p>${pokemonData.name}</p>
    `;

    pokemonCard.addEventListener('mouseover', () => {
        alert(`
            Type(s): ${pokemonData.types.map(nameOfType => nameOfType.type.name).join(", ")}
            Abilities: ${pokemonData.abilities.map(nameOfAbility => nameOfAbility.ability.name).join(", ")}
            Height: ${pokemonData.height}
            Weight: ${pokemonData.weight}
            Base Experience: ${pokemonData.base_experience}
        `);
    });
    pokemonContainer.appendChild(pokemonCard);
    console.log(pokemonData.types[0].type.name)
}

// function for listing multiple pokemon
function displayByType(listData) {
    const pokemonContainer = document.getElementById('pokemon-container');
    listData.forEach(pokemon => {
        /*
        The reason for fetching the Pokémon details again within the displayByType function rather than reusing the fetchPokemonByType 
        function is due to the structure of the API response. The fetchPokemonByType function fetches a list of Pokémon based on their type, 
        but it may not include all the detailed information needed to display each Pokémon (such as their sprites, abilities, height, weight, etc.).
        */
        fetch(pokemon.pokemon.url)
            .then(response => response.json())
            .then(data => {
                const pokemonCard = document.createElement('div');
                pokemonCard.classList.add('card');

                pokemonCard.innerHTML = `
                    <img src="${data.sprites.front_default}" alt="${data.name}" />
                    <p>${data.name}</p>
                `;

                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.innerHTML = `
                    <p>Type(s): ${data.types.map(typeName => typeName.type.name).join(", ")}</p>
                    <p>Abilities: ${data.abilities.map(abilityName => abilityName.ability.name).join(", ")}</p>
                    <p>Height: ${data.height}</p>
                    <p>Weight: ${data.weight}</p>
                    <p>Base Experience: ${data.base_experience}</p>
                `;
                //event listener for hovering
                pokemonCard.addEventListener('mouseover', () => {
                    tooltip.style.display = 'block';
                });
                pokemonCard.addEventListener('mouseout', () => {
                    tooltip.style.display = 'none';
                });

                //event listener for playing audio
                pokemonCard.addEventListener('click', () => {
                    playPokemonCry(data.cries.legacy);
                });

                pokemonCard.appendChild(tooltip);
                pokemonContainer.appendChild(pokemonCard);
            })
            .catch(error => {
                console.log('Error:', error);
                alert('Failed to fetch Pokemon details.');
            });
    });
}

//function to play pokemon cry
function playPokemonCry(cryUrl) {
    const audio = new Audio(cryUrl);
    audio.play();
}

// function for Dark Mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
}
document.addEventListener('keydown', function(event) {
    if (event.key === "\\") {
        toggleMode();
    }
});

//function to refresh page when clicking the Pokemon title image
document.addEventListener('DOMContentLoaded', function() {
    const titleImage = document.querySelector('#titleImage');
    titleImage.addEventListener('click', function() {
        location.reload();
    });
});
