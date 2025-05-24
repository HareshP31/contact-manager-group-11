
function addContacts() {
    const userId = getUserIdFromCookie();
    if (!userId) {
        alert("You must be logged in.");
        return;
    }

    // Collect input values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    // Makes all fields required
    if (!firstName || !lastName || !phone || !email) {
        alert("All fields are required.");
        return;
    }

    const payload = JSON.stringify({
        UserID: userId,
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email
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
            fetchContacts(); // Refresh the list
        }
    })
    .catch(error => {
        console.error("Add contact error:", error);
    });

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";

}
