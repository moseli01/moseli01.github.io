'use strict';



//const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://moseli01.pythonanywhere.com/";

// Handle Sign-Up form submission
document.getElementById("signup-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials:"include",
        mode: "cors"
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert(data.message || "User  signed up successfully!");
            showForm('login');
        })
        .catch(error => console.error('Error:', error.message));
});

// Handle Login form submission
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    await fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials:"include",
        mode: "cors"
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data == "Please check your login details and try again."){
                alert(data.message || data);

            }else{
                username = data["user"];
                alert(data.message || `Welcome ${username}!`);

                current_username = username;
                sessionStorage.setItem("current_username",`${current_username}`);
                updateView();
            }

        })
        .catch(error => console.error('Error:', error.message));
    profile();
});

// Handle Create List form submission
document.getElementById("new-list-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const listTitle = document.getElementById("list-title").value;

    await fetch(`${BASE_URL}/list`, {
        method: "POST",
        body: JSON.stringify({ title: listTitle, username: current_username}),
        headers: {
            "Content-Type": "application/json",
        },
        credentials:"include",
        mode: "cors"
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert(data.message || "List created successfully!");
            current_list = data.list_id;
            sessionStorage.setItem("current_list", current_list);
            showForm('add-item');
            document.getElementById('list-name').textContent = listTitle; 
        })
        .catch(error => console.error('Error:', error.message));

});

// Handle Add Item form submission
document.getElementById("new-item-form").addEventListener("submit", async function(event) {
    event.preventDefault();


    const name = document.getElementById("name").value;
    const imageLink = document.getElementById("image_link").value;
    const description = document.getElementById("description").value;
    //get list id from api?
    const list_id = current_list;
    document.getElementById("name").value="";
    document.getElementById("image_link").value="";
    document.getElementById("description").value="";

    await fetch(`${BASE_URL}/item/${list_id}`, {
        method: "POST",
        body: JSON.stringify({ list_id: list_id, name, image_link: imageLink, description }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert(data.message || "Item added successfully!");
            editList(list_id);
        })
        .catch(error => console.error('Error:', error.message));


});

// Handle Edit List form submission
document.getElementById("edit-list-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const new_title = document.getElementById("edit-list-title").value;
    const list_id = current_list;
    document.getElementById("edit-list-title").value="";

    await fetch(`${BASE_URL}/list/${list_id}`, {
        method: "PUT",
        body: JSON.stringify({ title: new_title }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials:"include",
        mode: "cors"
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            editList(list_id); 
        })
        .catch(error => console.error('Error:', error.message));
});


// Load list of items from the API
function loadItems(listId) {
    fetch(`${BASE_URL}/list/${listId}`,  {credentials:"include", mode:"cors"})
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            const list = new List(data.id, data.name, data.author);
            console.log(list);

            data.items.forEach(itemData => {
                const item = new Item(itemData.id, itemData.list_id, itemData.name, itemData.points, itemData.description, itemData.image_link);
                list.addItem(item);
                list.sortItems();
            });
            sessionStorage.setItem("current_list", data.id)
            displayList(list.items, list.name);
        })
        .catch(error => console.error('Error:', error.message));
}

// Load all lists from the server and display them on the home page
function loadLists() {
    fetch(`${BASE_URL}/lists`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const listGrid = document.getElementById('list-grid');
            listGrid.innerHTML = '';
            console.log(data);
            const lists=data.lists;
            const images = data.images;
            var i = 0;
            console.log(lists);
            if (lists && lists.length > 0) {
                lists.forEach(list => {
                    if (i < 20){
                        const listItem = document.createElement('div');
                        listItem.classList.add('column', 'box');

                        listItem.innerHTML = `
                            <article class="media">
                                <div class="media-left">
                                    <img src="${images[i].image_link}" style='width: 120px;'> 
                                </div>
                                <div class="media-right">
                                    <h3 class="title is-4 list-link" onclick="loadItems(${list.id})" >${list.name}</h3>
                                    <p>Created by: ${list.author}</p>
                                    <button class="button is-warning" onclick="loadItems(${list.id})">Vote Now!</button>
                                </div>
                            </article>
                        `;
                        //<button class="button is-info" onclick="showEditForm(${list.id}, '${list.name}')">Edit List</button>
                        i++;
                        listGrid.appendChild(listItem);
                    }
                    
                });
            } else {
                listGrid.innerHTML = '<p>No lists available.</p>';
            }
        })
        .catch(error => console.error('Error loading lists:', error));
}

// Show the edit form for a specific list
function showEditForm(listId, listName) {
    document.getElementById("edit-list-id").value = listId;
    document.getElementById("edit-list-title").value = listName;
    document.getElementById("edit-list-container").style.display = "block";
}

// Handle voting (upvote/downvote)
document.addEventListener("click", async function(event) {
    if (event.target.classList.contains("vote-up") || event.target.classList.contains("vote-down")) {
        const itemId = event.target.getAttribute("data-id");
        const vote = event.target.classList.contains("vote-up");
        const current_ip = sessionStorage.getItem("current_ip");
        
        current_list= sessionStorage.getItem("current_list")
        await fetch(`${BASE_URL}/vote`, {
            method: "POST",
            body: JSON.stringify({ item_id: itemId, vote: vote, list_id: current_list, username: current_username, ip: current_ip }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            mode: "cors"
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log(data);
                loadItems(current_list);
                //const vote_msg = document.createElement("p");
                //vote_msg.innerHTML=data;
                //const add_to = document.getElementById(`item-${itemId}`);
                //add_to.appendChild(vote_msg);
            })
            .catch(error => console.error('Error:', error.message));
    }
});


// Load list of items from the API
async function logout() {
    current_username = null;
    sessionStorage.removeItem("current_username");
    
    await fetch(`${BASE_URL}/logout`, {method:"POST", credentials:"include", mode:"cors"})
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error:', error.message));
    
    updateView();
    displayPage("home");
}



function profile() {
    username = current_username;
    fetch(`${BASE_URL}/profile/${username}`, {
            method: "GET",
            credentials : "include",
            mode : "cors"
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);

            showForm("none");
            showUser(username, data.lists);
        })
        .catch(error => console.error('Error:', error.message));

}

function deleteList(list_id){
    fetch(`${BASE_URL}/del/${list_id}`, {method:"POST", credentials:"include", mode:"cors"})
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);

            profile()
        })
        .catch(error => console.error('Error:', error.message));
}

function deleteItem(item_id){
    fetch(`${BASE_URL}/delitem/${item_id}`, {method:"POST", credentials:"include", mode:"cors"})
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            editList(sessionStorage.getItem("current_list"));

        })
        .catch(error => console.error('Error:', error.message));
}

function editList(list_id){
    sessionStorage.setItem("page_state", "add-item");
    current_list = list_id;
    sessionStorage.setItem("current_list", `${list_id}`);
    console.log(list_id);
    loadItemsEdit(list_id);
    document.getElementById("edit-list-container").style.display = "inherit";
    showForm("add-item");

}
// Load list of items from the API to edit
function loadItemsEdit(listId) {
    fetch(`${BASE_URL}/list/${listId}`,  {credentials:"include", mode:"cors"})
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Validate the data structure before proceeding
            if (!data.items || !Array.isArray(data.items)) {
                console.error("Invalid data structure:", data);
                return;
            }
            const list = new List(listId, data.name, data.author);
            console.log(list);

            data.items.forEach(itemData => {
                const item = new Item(itemData.id, itemData.list_id, itemData.name, itemData.points, itemData.description, itemData.image_link);
                list.addItem(item);
            });
            displayEditList(list.items, list.name);
        })
        .catch(error => console.error('Error:', error.message));
}


document.addEventListener("DOMContentLoaded", function() {
    // Fetch the IP address from the API
    fetch("https://ipinfo.io/json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },

        mode: "cors"
    }) 
        .then(response => response.json())
        .then(data => {
            // Display the IP address on the screen
            sessionStorage.setItem("current-ip", data.ip)
        })
        .catch(error => {
            console.error("Error fetching IP address:", error);

        });
});