import validate from "./validate.js";
import { getUsersHandler, addUserHandler, updateUserHandler, deleteUserHandler } from "./request.js";

const showModalBtn = document.getElementById("show-modal-btn");
const modal = document.querySelector(".modal");
const form = document.querySelector(".form");

app();

function app() {
    getUsersHandler(render);
    showModalBtn.addEventListener("click", function () {
        modal.classList.add("show");
        form.onsubmit = function (e) {
            e.preventDefault();
            addUser();
        };
    });

    const closeModalBtn = document.getElementById("close-modal-btn");
    closeModalBtn.addEventListener("click", function () {
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
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "Edit";
    editBtn.classList.add("btn", "btn-primary");
    editBtn.addEventListener("click", () => editUser(user.id));
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "Delete";
    delBtn.classList.add("btn", "btn-danger");
    delBtn.addEventListener("click", () => deleteUserHandler(user.id));
    cell5.append(editBtn, delBtn);
}

function addUser() {
    const formInputs = getFormInputs();
    console.log(formInputs);

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
