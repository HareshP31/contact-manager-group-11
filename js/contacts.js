let searchTimeout = null;
const DEBOUNCE_DELAY = 300;
let currentPage = 0;
const CONTACTS_PER_PAGE = 10;

document.addEventListener('DOMContentLoaded', function () {
    readCookie();
    fetchContacts(currentPage);
    updatePageIndicator();

    const searchInput = document.getElementById('searchText');
    searchInput.addEventListener('input', handleSearchInput);

    const toggleButton = document.getElementById('toggleFormButton');
    toggleButton.addEventListener('click', toggleAddContactForm);
});

function handleSearchInput() {
    // Clear any pending timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Set a new timeout
    searchTimeout = setTimeout(() => {
        const searchValue = document.getElementById('searchText').value.trim();
        if (searchValue === '') {
            fetchContacts(); // Show all contacts when search is empty
        } else {
            searchContacts();
        }
    }, DEBOUNCE_DELAY);
}

function fetchContacts(page = 0) {
    const userId = getUserIdFromCookie();
    if (!userId) {
        alert("You must be logged in.");
        return;
    }

    const offset = page * CONTACTS_PER_PAGE;

    const payload = JSON.stringify({
        id: userId,
        limit: CONTACTS_PER_PAGE,
        offset: offset
    });

    // fetch API
    fetch("https://meowmanager4331.xyz/LAMPAPI/FetchContacts.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: payload
    })
    .then(response => {
        if (response.status === 204) {
            return [];
        }
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.text();
    })
    .then(text => {
        if (!text) return [];
        return JSON.parse(text);
    })
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            populateContactsTable(data);
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        populateContactsTable([]);
    });
}

function getUserIdFromCookie() {
    let userId = -1;
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let tokens = cookie.split("=");
        if (tokens.length !== 2) continue;
        if (tokens[0] === "userId") {
            userId = parseInt(tokens[1]);
            break;
        }
    }
    return userId >= 0 ? userId : null;
}

function populateContactsTable(contacts) {
    const tbody = document.getElementById("contactsTableBody");
    tbody.innerHTML = "";

    if (!contacts.length) {
        tbody.innerHTML = "<tr><td colspan='6'>No contacts found.</td></tr>";
        return;
    }

    // Create table
    for (const c of contacts) {
        const row = document.createElement("tr");
        row.id = "row" + c.ID;
        row.innerHTML = `
            <td id="first${c.ID}">${c.FirstName}</td>
            <td id="last${c.ID}">${c.LastName}</td>
            <td id="phone${c.ID}">${c.Phone}</td>
            <td id="email${c.ID}">${c.Email}</td>
            <td id="options-row">
                <button class="buttons" id="edit${c.ID}">Edit</button>
                <button class="buttons" id="save${c.ID}" style="display:none;">Save</button>
                <button class="buttons" id="cancel${c.ID}" style="display:none;">Cancel</button>
                <button class="buttons" id="delete${c.ID}">Delete</button>
            </td>
            
               
        `;
        tbody.appendChild(row);

        // Wire up buttons
        document.getElementById("edit"   + c.ID).onclick = () => editRow(c);
        document.getElementById("save"   + c.ID).onclick = () => saveRow(c);
        document.getElementById("cancel" + c.ID).onclick = () => cancelRow(c);
        document.getElementById("delete" + c.ID).onclick = () => deleteContact(c);
    }
}


function editRow(contact) {
    const id = contact.ID;

    // toggle buttons
    document.getElementById("edit"   + id).style.display = "none";
    document.getElementById("save"   + id).style.display = "inline-block";
    document.getElementById("cancel" + id).style.display = "inline-block";

    // Lets user edit contact's info
    const firstName = document.getElementById("first" + id),
          lastName = document.getElementById("last"  + id),
          phone = document.getElementById("phone" + id),
          email = document.getElementById("email" + id);

    firstName.innerHTML = `<input class="editText" type="text" id="first_in${id}" value="${contact.FirstName}">`;
    lastName.innerHTML = `<input class="editText" type="text" id="last_in${id}"  value="${contact.LastName}">`;
    phone.innerHTML = `<input class="editText" type="text" id="phone_in${id}" value="${contact.Phone}">`;
    email.innerHTML = `<input class="editText" type="text" id="email_in${id}" value="${contact.Email}">`;
}

function saveRow(contact) {
    const id = contact.ID;
    const updated = {
        ID:        id,
        FirstName: document.getElementById("first_in" + id).value.trim(),
        LastName:  document.getElementById("last_in"  + id).value.trim(),
        Phone:     document.getElementById("phone_in" + id).value.trim(),
        Email:     document.getElementById("email_in" + id).value.trim()
    };

        if (updated.FirstName === "" || updated.LastName === "" || updated.Phone === "" || updated.Email === "") {
        document.getElementById("saveError").innerHTML = "ERROR: Please fill in all fields.";
        return;
    }

    const nameCheck = /^[a-zA-Z\s\-']+$/;
    if (!nameCheck.test(updated.FirstName) || !nameCheck.test(updated.LastName)) {
        document.getElementById("saveError").innerHTML = "ERROR: Names can only contain letters, spaces, hyphens, or apostrophes.";
        return;
    }


    const phoneCheck = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneCheck.test(updated.Phone)) {
        document.getElementById("saveError").innerHTML = "ERROR: Phone must be in the format 123-456-7890.";
        return;
}


    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailCheck.test(updated.Email)) {
        document.getElementById("saveError").innerHTML = "ERROR: Invalid email format.";
        return;
    }

    
    const userId = getUserIdFromCookie();
    fetch("https://meowmanager4331.xyz/LAMPAPI/EditContact.php", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
            id: userId,
            contactID: updated.ID,
            firstName: updated.FirstName,
            lastName:  updated.LastName,
            phone:     updated.Phone,
            email:     updated.Email
        })
    })
    .then(res => res.json())
    .then(resData => {
        if (resData.error) {
            alert("Error: " + resData.error);
        } else {
            document.getElementById("saveError").innerHTML = null;
            Object.assign(contact, updated);
            cancelRow(contact, true);
        }
    })
    .catch(err => console.error("Update failed:", err));
}

function cancelRow(contact, silent = false) {
    const id = contact.ID;

    // Restore the old contact
    document.getElementById("first" + id).innerText = contact.FirstName;
    document.getElementById("last"  + id).innerText = contact.LastName;
    document.getElementById("phone" + id).innerText = contact.Phone;
    document.getElementById("email" + id).innerText = contact.Email;

    // toggle buttons
    document.getElementById("edit"   + id).style.display = "inline-block";
    document.getElementById("save"   + id).style.display = "none";
    document.getElementById("cancel" + id).style.display = "none";

   document.getElementById("saveError").innerHTML = null;
}


function deleteContact(contact) {
    if (!confirm(`Delete "${contact.FirstName} ${contact.LastName}"?`)) return;

    const userId = getUserIdFromCookie();
    fetch("https://meowmanager4331.xyz/LAMPAPI/RemoveContact.php", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ id: userId, contactID: contact.ID })
    })
    .then(res => res.json())
    .then(resData => {
        if (resData.error) {
            alert("Error: " + resData.error);
        } else {
            fetchContacts();
        }
    })
    .catch(err => console.error("Delete failed:", err));
}

function addContacts() {
    const userId = getUserIdFromCookie();
    if (!userId) {
        alert("You must be logged in.");
        return;
    }

   
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    
    if (firstName === "" || lastName === "" || phone === "" || email === "") {
        document.getElementById("registerResult").innerHTML = "ERROR: Please fill in all fields.";
        return;
    }

    const nameCheck = /^[a-zA-Z\s\-']+$/;
    if (!nameCheck.test(firstName) || !nameCheck.test(lastName)) {
        document.getElementById("registerResult").innerHTML = "ERROR: Names can only contain letters, spaces, -, or '.";
        return;
    }


    const phoneCheck = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneCheck.test(phone)) {
        document.getElementById("registerResult").innerHTML = "ERROR: Phone must be in the format 123-456-7890.";
        return;
}


    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailCheck.test(email)) {
        document.getElementById("registerResult").innerHTML = "ERROR: Invalid email format.";
        return;
    }

    const payload = JSON.stringify({
        id: userId,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    });

    fetch("https://meowmanager4331.xyz/LAMPAPI/AddContact.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: payload
    })
    .then(response => response.text())
    .then(text => {
        const data = JSON.parse(text);
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            fetchContacts();
        }
    })
    .catch(error => {
        console.error("Add contact error:", error);
    });

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";

    toggleAddContactForm();
}

// search with first or last name
function searchContacts() {
    const srch = document.getElementById("searchText").value.trim();
    const userId = getUserIdFromCookie();
    
    if (!userId) {
        alert("You must be logged in.");
        return;
    }

    let flag = 0;
    let payload = { id: userId };

    if (srch.includes("@")) {
        payload.email = srch;
    } else if (/^[\d\-\+\(\)\s]+$/.test(srch)) {
        payload.phone = srch;
    } else {
        const words = srch.split(" ").filter(word => word.trim() !== "");
        if (words.length === 2) {
            payload.firstName = words[0];
            payload.lastName = words[1];
        } else {
            payload.firstName = srch;
            flag = 1;
        }
    }

    fetch("https://meowmanager4331.xyz/LAMPAPI/SearchContacts.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if ((response.status === 204) && flag == 1) {
            payload.firstName = null;
            lastNameCheck()
        }
        if (response.status === 204) {
            populateContactsTable([]);
            return;
        }
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.text();
    })
    .then(text => {
        if (!text) return [];
        return JSON.parse(text);
    })
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            populateContactsTable(data);
        }
    })
    .catch(error => {
        console.error("Search error:", error);
    });
}

function toggleAddContactForm() {
    const formContainer = document.getElementById('addContactFormContainer');
    const toggleButton = document.getElementById('toggleFormButton');
    
    if (formContainer.style.display === 'none') {
        formContainer.style.display = 'block';
        toggleButton.textContent = 'Hide Add Contact Form';
    } else {
        formContainer.style.display = 'none';
        toggleButton.textContent = 'Show Add Contact Form';
    }
    document.getElementById("registerResult").innerHTML = null;
}

// for last name search
function lastNameCheck(){
    const srch = document.getElementById("searchText").value.trim();
    const userId = getUserIdFromCookie();
    
    if (!userId) {
        alert("You must be logged in.");
        return;
    }

    const payload = {
        id: userId,
        lastName: srch
    };

    fetch("https://meowmanager4331.xyz/LAMPAPI/SearchContacts.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.status === 204) {
            populateContactsTable([]);
            return;
        }
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.text();
    })
    .then(text => {
        if (!text) return [];
        return JSON.parse(text);
    })
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            populateContactsTable(data);
        }
    })
    .catch(error => {
        console.error("Search error:", error);
    });
}

function nextPage() {
    currentPage++;
    fetchContacts(currentPage);
    updatePageIndicator();
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        fetchContacts(currentPage);
        updatePageIndicator();
    }
}

function updatePageIndicator() {
    document.getElementById("pageIndicator").textContent = `Page ${currentPage + 1}`;
}
