const START_KEY = "starting-weight";
const END_KEY = "ending-weight";
const THIRTY_FIVE_KEY = "include-35";
const DISABLED_CLASS = "is-disabled";
let testing = false;

/**
 * @type HTMLTableElement
 */
const TABLE = document.getElementById("result-table");
/**
 * @type HTMLButtonElement
 */
const DIALOG_BUTTON = document.getElementById("dialog-button");
/**
 * @type HTMLFormElement
 */
const FORM = document.getElementById("settings-form");
/**
 * @type HTMLInputElement 
 * */
const MIN_INPUT = FORM.querySelector("#min");
/**
 * @type HTMLInputElement 
 * */
const MAX_INPUT = FORM.querySelector("#max");
/**
 * @type HTMLButtonElement
 */
const SAVE_BUTTON = document.getElementById("save-settings");
/**
 * @type HTMLInputElement
 */
const INCLUDE_35 = document.getElementById("include-35");

DIALOG_BUTTON.addEventListener("click", () => {
    console.log("clicked settings");
    MIN_INPUT.value = +(localStorage.getItem(START_KEY) || 45);
    MAX_INPUT.value = +(localStorage.getItem(END_KEY) || 45);
    console.log("updated input");
    document.getElementById('dialog-default').showModal();
    console.log("modal shown");
});

SAVE_BUTTON.addEventListener("click", () => {
    let form_data = new FormData(FORM);
    let new_min = form_data.get("min");
    if (new_min) {
        localStorage.setItem(START_KEY, new_min);
    }
    let new_max = form_data.get("max");
    if (new_max) {
        localStorage.setItem(END_KEY, new_max);
    }
    let include_35 = form_data.get(THIRTY_FIVE_KEY);
    if (include_35) {
        localStorage.setItem(THIRTY_FIVE_KEY, true);
    } else {
        localStorage.setItem(THIRTY_FIVE_KEY, false);
    }
    clear_table();
    setup_initial();
});

function clear_table() {
    let body = TABLE.querySelector("tbody");
    while (body.hasChildNodes()) {
        body.removeChild(body.firstChild);
    }
}

function setup_initial() {
    let start = +(localStorage.getItem(START_KEY) || 45);
    localStorage.setItem(START_KEY, start);
    let end = +(localStorage.getItem(END_KEY) || 225);
    localStorage.setItem(END_KEY, end);
    let body = TABLE.querySelector("tbody");
    for (let i=start; i<=end; i+=5) {
        body.appendChild(generate_row(i));
    }
}

function generate_row(weight) {
    let tr = document.createElement("tr");
    tr.appendChild(generate_weight_cell(weight));
    tr.appendChild(generate_plate_cell(weight));
    tr.dataset.weight = weight;
    return tr;
}

function generate_weight_cell(weight) {
    let ret = document.createElement("td");
    ret.appendChild(document.createTextNode(weight));
    ret.classList.add("total-weight");
    return ret;
}

function generate_plate_cell(weight) {
    let ret = document.createElement("td");
    ret.classList.add("plates-per-side");
    let include_35 = JSON.parse(localStorage.getItem(THIRTY_FIVE_KEY));
    if (weight <= 45) {
        return ret;
    }
    let side = []
    let minus_bar = weight - 45;
    let target = minus_bar / 2;
    let forty_fives = [];
    while (target >= 45) {
        forty_fives.push(45);
        target -= 45;
    }
    switch (forty_fives.length) {
        case 0:
            break;
        case 1:
            side.push("45");
            break;
        default:
            side.push(`(45x${forty_fives.length})`);
            break;
    }
    while (include_35 && target >= 35) {
        side.push(35);
        target -= 35;
    }
    while (target >= 25) {
        side.push(25);
        target -= 25;
    }
    while (target >= 10) {
        side.push(10);
        target -= 10;
    }
    while (target >= 5) {
        side.push(5);
        target -= 5;
    }
    while (target >= 2.5) {
        side.push(2.5);
        target -= 2.5
    }
    while (target >= 1.25) {
        side.push(1.25);
        target -= 1.25;
    }
    if (!target == 0) {
        console.warn("missing weights", target);
    }
    let content = side.join("+");
    if (testing) {
        let comb = eval(content.replace("x", "*"));
        let test = (comb * 2) + 45;
        console.log("Test", test, "Target", weight);
        if (weight != (comb * 2)+45) {
            throw new Error(`${comp}*2+45 != ${weight}`);
        }
    }
    ret.appendChild(document.createTextNode(content));
    return ret;
}

setup_initial();
