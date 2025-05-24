// const urlBase = 'https://meowmanager4331.xyz/LAMPAPI';
// const extension = 'php';

// document.addEventListener('DOMContentLoaded', function() {
//     readCookie();
//     fetchContacts();
// });

// function readCookie() {
//     let userId = -1;
//     const cookies = document.cookie.split(";");
//     for (let cookie of cookies) {
//         const [key, value] = cookie.trim().split("=");
//         if (key === "userId") {
//             userId = parseInt(value);
//         } else if (key === "firstName") {
//             document.getElementById("userName").textContent = "Logged in as " + value;
//         }
//     }

//     if (userId < 0) {
//         window.location.href = "index.html";
//     }
//     return userId;
// }

// // function FetchContacts() {
// //     const userId = readCookie();
// //     const payload = JSON.stringify({ id: userId, limit: 100 });

// //     fetch(`${urlBase}/FetchContacts.${extension}`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: payload
// //     })
// //     .then(res => res.text())
// //     .then(text => text ? JSON.parse(text) : [])
// //     .then(data => populateContactsTable(data))
// //     .catch(err => console.error("Fetch error:", err));
// // }

// function populateContactsTable(contacts) {
//     const tableBody = document.getElementById("contactsTableBody");
//     tableBody.innerHTML = "";

//     if (!contacts.length) {
//         tableBody.innerHTML = "<tr><td colspan='5'>No contacts found.</td></tr>";
//         return;
//     }

//     for (const contact of contacts) {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td><input type="text" value="${contact.FirstName}" id="fn-${contact.ID}"></td>
//             <td><input type="text" value="${contact.LastName}" id="ln-${contact.ID}"></td>
//             <td><input type="text" value="${contact.Phone}" id="ph-${contact.ID}"></td>
//             <td><input type="text" value="${contact.Email}" id="em-${contact.ID}"></td>
//             <td>
//                 <button onclick="updateContact(${contact.ID})">Save</button>
//                 <button onclick="deleteContact(${contact.ID})">Delete</button>
//             </td>`;
//         tableBody.appendChild(row);
//     }
// }

// function addContact() {
//     const userId = readCookie();
//     const newContact = {
//         userId,
//         firstName: document.getElementById("firstName").value,
//         lastName: document.getElementById("lastName").value,
//         phone: document.getElementById("phone").value,
//         email: document.getElementById("email").value
//     };

//     fetch(`${urlBase}/AddContact.${extension}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newContact)
//     })
//     .then(res => res.text())
//     .then(() => fetchContacts());
// }

// function EditContact(id) {
//     const updated = {
//         id,
//         firstName: document.getElementById(`fn-${id}`).value,
//         lastName: document.getElementById(`ln-${id}`).value,
//         phone: document.getElementById(`ph-${id}`).value,
//         email: document.getElementById(`em-${id}`).value
//     };

//     fetch(`${urlBase}/EditContact.${extension}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updated)
//     })
//     .then(() => fetchContacts());
// }

// function RemoveContact(id) {
//     fetch(`${urlBase}/RemoveContact.${extension}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id })
//     })
//     .then(() => fetchContacts());
// }

// // function doLogout() {
// //     document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
// //     document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
// //     document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
// //     window.location.href = "index.html";
// // }