import validate from "./validate.js";
import { sendRequest } from "./request.js";

const apiUrl = "https://api-d.thesoftwarehouse.tech/api/i-users/";

const table = document.getElementById("table");
const modal = document.querySelector(".modal");
const form = document.querySelector(".form");

app();

function app() {
    getUsersHandler();
    table.addEventListener("click", (e) => {
        if (e.target.dataset.action === "add") {
            modal.classList.add("show");
            form.onsubmit = (e) => {
                e.preventDefault();
                addUserHandler();
            };
        }

        if (e.target.dataset.action === "edit" && e.target.dataset.id) {
            const id = e.target.dataset.id;
            editUserHandler(id);
        }

        if (e.target.dataset.action === "delete" && e.target.dataset.id) {
            const id = e.target.dataset.id;
            deleteUserHandler(id);
        }
    });

    const closeModalBtn = document.getElementById("close-modal-btn");
    closeModalBtn.addEventListener("click", () => {
        modal.classList.remove("show");
        clearForm();
    });
}

async function getUsersHandler() {
    try {
        const data = await sendRequest(apiUrl);
        renderUsers(data);
    } catch (error) {
        alert(error.message);
    }
}

async function addUserHandler() {
    const formInputs = getFormInputs();

    if (formInputs) {
        try {
            const data = await sendRequest(apiUrl, {
                method: "POST",
                body: formInputs,
            });
            addNewRow(data);
            clearForm();
            modal.classList.remove("show");
        } catch (error) {
            alert(error.message);
        }
    }
}

function editUserHandler(id) {
    const selectedRow = document.querySelector(".user-" + id);
    modal.classList.add("show");
    document.querySelector(".submit-btn").innerHTML = "Save";
    document.getElementById("username").value = selectedRow.cells[0].innerHTML;
    document.getElementById("email").value = selectedRow.cells[1].innerHTML;
    document.getElementById("first-name").value = selectedRow.cells[2].innerHTML;
    document.getElementById("last-name").value = selectedRow.cells[3].innerHTML;

    form.onsubmit = async function (e) {
        e.preventDefault();
        const formInputs = getFormInputs();
        if (formInputs) {
            try {
                const data = await sendRequest(apiUrl + id, {
                    method: "PUT",
                    body: formInputs,
                });
                editUser(data, selectedRow);
                clearForm();
                modal.classList.remove("show");
            } catch (error) {
                alert(error.message);
            }
        }
    };
}

async function deleteUserHandler(id) {
    try {
        const data = await fetch(apiUrl + id, { method: "DELETE" });
        deleteUser(id);
    } catch (error) {
        alert(error.message);
    }
}

function renderUsers(users) {
    users.forEach((user) => {
        addNewRow(user);
    });
}

function addNewRow(user) {
    const tbody = document.querySelector("tbody");
    const newRow = tbody.insertRow(tbody.length);
    newRow.className = "user-" + user.id;
    const cell1 = newRow.insertCell(0);
    cell1.innerHTML = user.attributes.username;
    const cell2 = newRow.insertCell(1);
    cell2.innerHTML = user.attributes.email;
    const cell3 = newRow.insertCell(2);
    cell3.innerHTML = user.attributes.firstName;
    const cell4 = newRow.insertCell(3);
    cell4.innerHTML = user.attributes.lastName;
    const cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<button data-action='edit' data-id=${user.id} class='btn btn-primary'>Edit</button>
    <button data-action='delete' data-id=${user.id} class='btn btn-danger'>Delete</button>`;
}

function editUser(data, selectedRow) {
    selectedRow.cells[0].innerHTML = data.attributes.username;
    selectedRow.cells[1].innerHTML = data.attributes.email;
    selectedRow.cells[2].innerHTML = data.attributes.firstName;
    selectedRow.cells[3].innerHTML = data.attributes.lastName;
}

function deleteUser(id) {
    const delRow = document.querySelector(".user-" + id);
    delRow.remove();
}

function getFormInputs() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const password = document.getElementById("password").value;

    const usernameConfig = {
        value: username,
        isRequired: true,
    };
    const emailConfig = {
        value: email,
        isRequired: true,
        isEmail: true,
    };
    const firstNameConfig = {
        value: firstName,
        isRequired: true,
    };
    const lastNameConfig = {
        value: lastName,
        isRequired: true,
    };
    const passwordConfig = {
        value: password,
        isRequired: true,
        minLength: 8,
    };

    if (
        !validate(usernameConfig) ||
        !validate(emailConfig) ||
        !validate(firstNameConfig) ||
        !validate(lastNameConfig) ||
        !validate(passwordConfig)
    ) {
        alert("Invalid inputs! Please try again.");
        return;
    } else {
        return {
            username,
            email,
            firstName,
            lastName,
            password,
        };
    }
}

function clearForm() {
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("first-name").value = "";
    document.getElementById("last-name").value = "";
    document.getElementById("password").value = "";
}
