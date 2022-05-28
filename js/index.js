import validate from "./validate.js";
import { getUsersHandler, addUserHandler, updateUserHandler, deleteUserHandler } from "./request.js";

const table = document.getElementById("table");
const modal = document.querySelector(".modal");
const form = document.querySelector(".form");

app();

function app() {
    getUsersHandler(render);
    table.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            if (e.target.dataset.action === "add") {
                modal.classList.add("show");
                form.onsubmit = (e) => {
                    e.preventDefault();
                    addUser();
                };
            }

            if (e.target.dataset.action === "edit" && e.target.dataset.id) {
                const id = e.target.dataset.id;
                editUser(id);
            }

            if (e.target.dataset.action === "delete" && e.target.dataset.id) {
                const id = e.target.dataset.id;
                deleteUserHandler(id);
            }
        } else {
            return;
        }
    });

    const closeModalBtn = document.getElementById("close-modal-btn");
    closeModalBtn.addEventListener("click", () => {
        modal.classList.remove("show");
        clearForm();
    });
}

function render(users) {
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

function addUser() {
    const formInputs = getFormInputs();

    if (formInputs) {
        addUserHandler(formInputs, addNewRow);
        clearForm();
        modal.classList.remove("show");
    }
}

function editUser(id) {
    const selectedRow = document.querySelector(".user-" + id);
    modal.classList.add("show");
    document.getElementById("username").value = selectedRow.cells[0].innerHTML;
    document.getElementById("email").value = selectedRow.cells[1].innerHTML;
    document.getElementById("first-name").value = selectedRow.cells[2].innerHTML;
    document.getElementById("last-name").value = selectedRow.cells[3].innerHTML;
    document.querySelector(".submit-btn").innerHTML = "Save";
    form.onsubmit = function (e) {
        e.preventDefault();

        const formInputs = getFormInputs();
        if (formInputs) {
            updateUserHandler(id, formInputs, selectedRow);
            clearForm();
            modal.classList.remove("show");
        }
    };
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
