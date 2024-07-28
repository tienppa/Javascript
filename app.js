import Dinosaur from "./model/Dinosaur.js";

// common
function readFile(path = "dino.json") {
    return new Promise((resolve, reject) => {
        fetch(path)
            .then(response => response.text())
            .then(data => {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Create Dino Objects
function getDino(data, human) {
    return data['Dinos'].map((x) => {
        const { species, weight, height, diet, where, when, fact } = x;
        const dinosaur = new Dinosaur(species, weight, height, diet, where, when, fact);
        dinosaur.compare(human);
        return dinosaur;
    })
}

// Create Human Object
function getHuman() {
    const dietEl = document.querySelector("select");

    const inputEl = document.querySelectorAll('input');
    const [name, feet, inches, weight] = inputEl;

    const _feet = Number(feet.value) || undefined;
    const _inches = Number(inches.value) || undefined;
    return {
        name: name.value || '',
        feet: _feet,
        inches: _inches,
        weight: Number(weight.value) || undefined,
        diet: dietEl.value || '',
        height: _feet * 12 + _inches
    }
}

// Generate Tiles for each Dino in Array
function generateTile(list, human) {
    // list dino without human
    list.forEach(x => {
        if (x.species === "Pigeon") {
            x.title = x.fact;
            return;
        }

        const randomIndex = Math.floor(Math.random() * 6);

        switch (randomIndex) {
            case 0:
                x.title = x.dietDescription;
                break;
            case 1:
                x.title = x.fact;
                break;
            case 2:
                x.title = `${x.species} is ${x.height} ${x.heightRatio > 1 ? "taller" : "shorter"
                    } than ${human.height}.`;
                break;
            case 3:
                x.title = `${x.species} is ${x.weight} ${x.weightRatio > 1 ? "heavier" : "lighter"
                    } than ${human.weight}.`;
                break;
            case 4:
                x.title = `${x.species} existed during the ${x.when} period.`;
                break;
            default:
                x.title = `${x.species} lived in ${x.where}.`;
        }
    })
}

// Add tiles to DOM
function generateGrid(human, dinos) {
    const grid = document.querySelector("#grid");

    const list = dinos.slice(0, 4);
    list.push(human);
    list.push(...dinos.slice(4));


    const tiles = list.map(({ species, name, weight, height, diet, where, when, fact, title }) => {
        const imageSrc = `images/${species?.toLowerCase() || "human"}.png`;
        const factStyle = fact ? '' : 'display: none';

        return `
      <div class="grid-item">
        <h3>${species || name}</h3>
        <img src="${imageSrc}">
        <p style="${factStyle}">${title || ''}</p>
      </div>
    `;
    }).join('');

    grid.innerHTML = tiles;
}

// Remove form from screen
function clear() {
    const form = document.querySelector('form');
    if (form) form.reset();

    const validation = document.querySelector('.errors');
    if (validation) validation.innerHTML = '';

    const container = document.querySelector("#grid");
    container.innerHTML = "";
}


function validateForm(person) {
    let invalid = true;

    const errorEl = document.querySelector(".errors");

    const { name: n, feet: f, inches: i, weight: w } = person;

    if (!n || !n.trim()) {
        errorEl.innerHTML = `<p>Please enter your Name</p>`;
    } else if (!f) {
        errorEl.innerHTML = `<p>Please enter your Feet</p>`;
    } else if (!i) {
        errorEl.innerHTML = `<p>Please enter your Inches</p>`;
    } else if (!w) {
        errorEl.innerHTML = `<p>Please enter your Weight</p>`;
    } else {
        invalid = false;
    }
    return invalid;
}

function hiddenElement(id) {
    if (!id) {
        return;
    }

    const el = document.querySelector(id);
    if (el) {
        el.style.display = 'none';
    }
}

function displayElement(id, display) {
    if (!id) {
        return;
    }

    const el = document.querySelector(id);
    if (el) {
        el.style.display = display ? display : 'block';
    }
}

let data = [];

function handleSubmit() {
    const human = getHuman();

    const invalid = validateForm(human);

    if (!invalid) {
        const dino = getDino(data, human);

        generateTile(dino, human);
        // hide form 
        hiddenElement('#dino-compare');
        // display grid
        generateGrid(human, dino);

        displayElement('#start-over', 'flex');
    } else {
        const container = document.querySelector(".errors");
        container.innerHTML = `<span class="error">Please complete all fields</span>`;
    }
}

function handleStartOver() {
    clear();
    hiddenElement('#start-over');
    displayElement('#dino-compare');
}

// Use IIFE to get human data from form
(async function () {
    data = await readFile();

    const compareBtn = document.getElementById('btn');
    const startOver = document.getElementById('start-over');
    // On button click, prepare and display infographic
    compareBtn.addEventListener('click', handleSubmit)

    startOver.addEventListener('click', handleStartOver)
})();
