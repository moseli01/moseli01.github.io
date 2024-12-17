'use strict';

var current_username = null;
var page_state = "home";
var current_list = null;

function displayList(items, name) {
    showForm("view-list");
    const listContainer = document.getElementById("list-item-grid");
    listContainer.innerHTML = '';
    document.getElementById("list-name-view").innerHTML=name;
    
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('box');
        itemElement.innerHTML = `
        <article class="media">
        <div class="media-left">
            <img src="${item.image_link}" alt="${item.name}" style="width: 120px;">
        </div>
        <div class="media-content">
            <h3 class="title">${item.name}</h3>
            <p>${item.description}</p>
            <p>Points: ${item.points}</p>

            <div class="control">
            <label class="radio">
                <input type="radio" name="answer" class="button myradio-up vote-up" data-id="${item.id}" value="Upvote">
                <span>Upvote</span>
            </label>
            <label class="radio">
                <input type="radio" name="answer" class="button myradio-down vote-down" data-id="${item.id}" value="Downvote"/>
                <span class="lbl-down">Downvote</span>
            </label>
            </div>
            <div id="item-${item.id}"></div>
            

        </div>
        </article>
        `;
        listContainer.appendChild(itemElement);
    });
}

function displayEditList(items, name) {
    const listContainer = document.getElementById("edit-list-grid");
    listContainer.innerHTML = '';
    document.getElementById("list-name-edit").innerHTML=name;

    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('box');
        itemElement.innerHTML = `
        <article class="media">
        <div class="media-left">
            <img src="${item.image_link}" alt="${item.name}" style="width: 120px;">
        </div>
        <div class="media-content">
            <h3 class="title">${item.name}</h3>
            <p>${item.description}</p>
            <p>Points: ${item.points}</p>

            <button class="button is-danger " data-id="${item.id}" onclick="deleteItem(${item.id})">Delete</button>
        </div>
        </article>
            `;
        listContainer.appendChild(itemElement);
    });
}

// Show forms for login/signup
function showForm(formType) {
    if (formType === 'login') {
        sessionStorage.setItem("page_state", "login");
        document.getElementById("signup-container").style.display = "none";
        document.getElementById("login-container").style.display = "block";
        document.getElementById("new-list-container").style.display = "none";
        document.getElementById("add-item-container").style.display = "none";
        document.getElementById("home-page-container").style.display = "none";
        document.getElementById("profile-container").style.display = "none";
        document.getElementById("edit-list-container").style.display = "none";
        document.getElementById("view-list-container").style.display = "none";

    } else if (formType === 'signup') {
        sessionStorage.setItem("page_state", "signup");
        document.getElementById("signup-container").style.display = "block";
        document.getElementById("login-container").style.display = "none";
        document.getElementById("new-list-container").style.display = "none";
        document.getElementById("add-item-container").style.display = "none";
        document.getElementById("home-page-container").style.display = "none";
        document.getElementById("profile-container").style.display = "none";
        document.getElementById("edit-list-container").style.display = "none";
        document.getElementById("view-list-container").style.display = "none";

    } else if (formType === 'none') {
        document.getElementById("signup-container").style.display = "none";
        document.getElementById("login-container").style.display = "none";
        document.getElementById("new-list-container").style.display = "none";
        document.getElementById("add-item-container").style.display = "none";
        document.getElementById("profile-container").style.display = "none";
        document.getElementById("home-page-container").style.display = "none";
        document.getElementById("profile-container").style.display = "none";
        document.getElementById("edit-list-container").style.display = "none";
        document.getElementById("view-list-container").style.display = "none";
        

    } else if (formType == 'create-list'){
        sessionStorage.setItem("page_state", "createlist");

        document.getElementById("signup-container").style.display = "none";
        document.getElementById("login-container").style.display = "none";
        document.getElementById("new-list-container").style.display = "block";
        document.getElementById("add-item-container").style.display = "none";
        document.getElementById("home-page-container").style.display = "none";
        document.getElementById("profile-container").style.display = "none";
        document.getElementById("edit-list-container").style.display = "none";
        document.getElementById("view-list-container").style.display = "none";

    } else if (formType == 'add-item'){
        document.getElementById("signup-container").style.display = "none";
        document.getElementById("login-container").style.display = "none";
        document.getElementById("new-list-container").style.display = "none";
        document.getElementById("add-item-container").style.display = "block";
        document.getElementById("home-page-container").style.display = "none";
        document.getElementById("profile-container").style.display = "none";
        document.getElementById("view-list-container").style.display = "none";
        document.getElementById("edit-list-container").style.display = "inherit";


    } else if (formType == "home"){
        sessionStorage.setItem("page_state", "home");
        loadLists();
        document.getElementById("signup-container").style.display = "none";
        document.getElementById("login-container").style.display = "none";
        document.getElementById("new-list-container").style.display = "none";
        document.getElementById("add-item-container").style.display = "none";
        document.getElementById("home-page-container").style.display = "inherit";
        document.getElementById("profile-container").style.display = "none";
        document.getElementById("edit-list-container").style.display = "none";
        document.getElementById("view-list-container").style.display = "none";

    } else if (formType == "view-list"){
        sessionStorage.setItem("page_state", "viewlist");

        document.getElementById("signup-container").style.display = "none";
        document.getElementById("login-container").style.display = "none";
        document.getElementById("new-list-container").style.display = "none";
        document.getElementById("add-item-container").style.display = "none";
        document.getElementById("home-page-container").style.display = "none";
        document.getElementById("profile-container").style.display = "none";
        document.getElementById("edit-list-container").style.display = "none";
        document.getElementById("view-list-container").style.display = "inherit";

    }
}

function updateView(){
    if (current_username != null){
        document.getElementById("logoutbtn").style.display = "inherit";
        document.getElementById("loginbtn").style.display = "none";
        document.getElementById("signupbtn").style.display = "none";
        document.getElementById("profilebtn").style.display = "inherit";
        document.getElementById("create-logged-in").style.display = "inherit";
        document.getElementById("create-logged-out").style.display = "none";

    }else{
        document.getElementById("logoutbtn").style.display = "none";
        document.getElementById("loginbtn").style.display = "inherit";
        document.getElementById("signupbtn").style.display = "inherit";
        document.getElementById("profilebtn").style.display = "none";
        document.getElementById("create-logged-in").style.display = "none";
        document.getElementById("create-logged-out").style.display = "inherit";

    }
}

function showUser(username, lists){
    sessionStorage.setItem("page_state", "profile");

    document.getElementById("home-page-container").style.display = "none";
    document.getElementById("profile-container").style.display = "inherit";
    document.getElementById("this_username").innerHTML = `Welcome ${username}!`;
    
    const listContainer = document.getElementById("user-lists");
    listContainer.innerHTML = '';

    lists.forEach(list => {
        const listElement = document.createElement('div');
        listElement.classList.add('box');
        listElement.innerHTML = `
            <h3 class="subtitle">${list.name}</h3>
            <p>${list.author}</p>
            <button class="button is-link" data-id="${list.id}" onclick="editList(${list.id})">Edit</button>
            <button class="button is-link" data-id="${list.id}" onclick="deleteList(${list.id})" >Delete</button>

        `;
        listContainer.appendChild(listElement);
    });

}

function displayPage(state){
    if (state=="home"){
        showForm("home");
    }else if (state == "profile"){
        profile();
    }else if (state == "login"){
        showForm("login");
    }else if (state == "signup"){
        showForm("signup");
    }else if (state == "createlist"){
        showForm("createlist");
    }else if (state == "viewlist"){
        loadItems(current_list["id"]);
    }else if (state == "add-item"){
        profile();
        //editList(current_list["id"]);
    }
}

window.onload = function() {
    showForm('home');
    current_username = sessionStorage.getItem("current_username");
    page_state = sessionStorage.getItem("page_state");
    current_list = sessionStorage.getItem("current_list");
    updateView();
    displayPage(page_state);
    checkCookie();
}
