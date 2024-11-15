'use strict';

const LANGUAGES = {
    "cs": "CZECH",
    "de": "GERMAN",
    "en": "ENGLISH",
    "es": "SPANISH",
    "eu": "BASQUE",
    "fr": "FRENCH",
    "gl": "GALICIAN",
    "hu": "HUNGARIAN",
    "it": "ITALIAN",
    "lt": "LITHUANIAN",
    "pl": "POLISH",
    "sv": "SWEDISH",
}

const categories = ["all", "neutral", "chuck"]
const numbers = [1,2,3,4,5,6,7,8,9,10,"all"]


const BASE_URL = "https://moseli01.pythonanywhere.com/api/v1/jokes"
//const BASE_URL = "http://localhost:5000/api/v1/jokes"


async function getData(inputField) {
    /*
    * get from input fields
    * retrieve from API
    */
    let id = document.getElementById("selId").value;
    if (id != ""){
        var url = `${BASE_URL}/${id}`;
    }
    else{
        let num = document.getElementById("selNum").value;
        if (num != null && num != "all"){
            var lang = document.getElementById("selLang").value;
            var category = document.getElementById("selCat").value;
            var url = `${BASE_URL}/${lang}/${category}/${num}`;
        }
        else {
            var lang = document.getElementById("selLang").value;
            var category = document.getElementById("selCat").value;
            var url = `${BASE_URL}/${lang}/${category}`;
        }
    }
    console.log(url);
    let data = await fetch(url)
        .then(response => response.json())
        .catch(error => console.error(error));

    return data;
}


async function displayJokes(){
    let jokes = await getData();
    let display = document.getElementById("jokes");
    display.innerHTML="";
    let id = document.getElementById("selId").value;
    if (jokes["jokes"] == undefined){
        let alert = document.createElement("article");
        alert.classList.add("notification");
        alert.innerHTML=jokes["error"];
        display.appendChild(alert);
    }
    else{
        if (id != ""){
            let joke = document.createElement("article");
            joke.classList.add("notification");
            joke.innerHTML=jokes["jokes"];
            display.appendChild(joke);
        }
        else{
            for (let j of jokes["jokes"]){
                let joke = document.createElement("article");
                joke.classList.add("notification");
                joke.innerHTML=j;
                display.appendChild(joke);
            }
        }
    }
}


function populate(id, options){
    let input = document.getElementById(id);
    for (let opt of options){
        let currentOption = document.createElement("option");
        currentOption.value=opt;
        currentOption.innerHTML=opt;
        input.appendChild(currentOption);
    }
}

function populateLang(id){
    let input = document.getElementById(id);
    for (let opt in LANGUAGES){
        let currentOption = document.createElement("option");
        currentOption.value=opt;
        let langName = String(LANGUAGES[opt]).charAt(0) + String(LANGUAGES[opt]).toLowerCase().slice(1);
        console.log(langName);
        currentOption.innerHTML= langName;

        input.appendChild(currentOption);
    }
}

window.onload = function (){   

    populateLang("selLang");
    populate("selCat", categories);
    populate("selNum", numbers);
    
}