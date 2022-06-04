import validate from "./validate.js";
import { sendRequest } from "./request.js";
import { getInputElements } from "./utils.js";

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

        if (e.target.dataset.action === "edit") {
            const userData = JSON.parse(e.target.dataset.user);
            editUserHandler(userData);
        }

        if (e.target.dataset.action === "delete" && e.target.dataset.id) {
            const id = e.target.dataset.id;
            const deleteConfirmation = confirm("Are you sure you want to delete?");
            if (deleteConfirmation) {
                deleteUserHandler(id);
            }
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

function editUserHandler(userData) {
    modal.classList.add("show");
    document.querySelector(".submit-btn").innerHTML = "Save";
    const inputElements = getInputElements();
    inputElements.forEach((input) => {
        input.value = userData.attributes[input.id] || "";
    });

    form.onsubmit = async function (e) {
        e.preventDefault();
        const formInputs = getFormInputs();
        if (formInputs) {
            try {
                const data = await sendRequest(apiUrl + userData.id, {
                    method: "PUT",
                    body: formInputs,
                });
                editUser(data);
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
        await fetch(apiUrl + id, { method: "DELETE" });
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
    cell5.innerHTML = `<button data-action='edit' data-user=${JSON.stringify(
        user
    )} class='btn btn-primary'>Edit</button>
    <button data-action='delete' data-id=${user.id} class='btn btn-danger'>Delete</button>`;
}

function editUser(data) {
    const selectedRow = document.querySelector(".user-" + data.id);
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
    const inputElements = getInputElements();
    const [username, email, firstName, lastName, password] = inputElements.map((input) => input.value);

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
    const inputElements = getInputElements();
    inputElements.forEach((input) => (input.value = ""));
}
