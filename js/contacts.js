let searchTimeout = null;
const DEBOUNCE_DELAY = 300;

document.addEventListener('DOMContentLoaded', function () {
    readCookie();
    fetchContacts();

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

function fetchContacts() {
    const userId = getUserIdFromCookie();
    if (!userId) {
        alert("You must be logged in.");
        return;
    }

    const payload = JSON.stringify({
        id: userId,
        limit: 10
    });

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
    const tableBody = document.getElementById("contactsTableBody");
    tableBody.innerHTML = "";

    if (contacts.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4'>No contacts found.</td></tr>";
        return;
    }

    for (const contact of contacts) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${contact.FirstName}</td>
            <td>${contact.LastName}</td>
            <td>${contact.Phone}</td>
            <td>${contact.Email}</td>
        `;

        tableBody.appendChild(row);
    }
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
        document.getElementById("registerResult").innerHTML = "Please fill in all fields.";
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
            alert("Contact added successfully!");
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

function searchContacts() {
    const srch = document.getElementById("searchText").value.trim();
    const userId = getUserIdFromCookie();
    
    if (!userId) {
        alert("You must be logged in.");
        return;
    }

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
            
            //REMOVED LASTNAME SEARCH FOR NOW
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
}