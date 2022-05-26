const apiUrl = "https://api-d.thesoftwarehouse.tech/api/i-users/";

export function getUsersHandler(render) {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((responseData) => {
            render(responseData.data);
        });
}

export function addUserHandler(userData, render) {
    const httpConfig = {
        method: "POST",
        body: JSON.stringify({
            data: { ...userData },
        }),
        headers: { "Content-Type": "application/json" },
    };
    fetch(apiUrl, httpConfig)
        .then((response) => response.json())
        .then((user) => {
            render(user.data);
        });
}

export function updateUserHandler(id, userData, selectedRow) {
    const httpConfig = {
        method: "PUT",
        body: JSON.stringify({
            data: {
                ...userData,
            },
        }),
        headers: { "Content-Type": "application/json" },
    };
    fetch(apiUrl + id, httpConfig)
        .then((response) => response.json())
        .then((responseData) => {
            selectedRow.cells[0].innerHTML = responseData.data.attributes.username;
            selectedRow.cells[1].innerHTML = responseData.data.attributes.email;
            selectedRow.cells[2].innerHTML = responseData.data.attributes.firstName;
            selectedRow.cells[3].innerHTML = responseData.data.attributes.lastName;
        });
}

export function deleteUserHandler(id) {
    const httpConfig = {
        method: "DELETE",
    };
    fetch(apiUrl + id, httpConfig).then(() => {
        const delRow = document.querySelector(".user-" + id);
        delRow.remove();
    });
}
