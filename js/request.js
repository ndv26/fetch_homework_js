const apiUrl = "https://api-d.thesoftwarehouse.tech/api/i-users/";

export async function getUsersHandler(render) {
    try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error.message || "Something went wrong!");
        }
        render(responseData?.data);
    } catch (error) {
        alert(error.message);
    }
}

export async function addUserHandler(formInputs, addNewRow) {
    const httpConfig = {
        method: "POST",
        body: JSON.stringify({
            data: { ...formInputs },
        }),
        headers: { "Content-Type": "application/json" },
    };

    try {
        const response = await fetch(apiUrl, httpConfig);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error.message || "Something went wrong!");
        }

        addNewRow(responseData?.data);
    } catch (error) {
        alert(error.message);
    }
}

export async function updateUserHandler(id, formInputs, selectedRow) {
    const httpConfig = {
        method: "PUT",
        body: JSON.stringify({
            data: {
                ...formInputs,
            },
        }),
        headers: { "Content-Type": "application/json" },
    };

    try {
        const response = await fetch(apiUrl + id, httpConfig);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error.message || "Something went wrong!");
        }
        selectedRow.cells[0].innerHTML = responseData?.data?.attributes?.username;
        selectedRow.cells[1].innerHTML = responseData?.data?.attributes?.email;
        selectedRow.cells[2].innerHTML = responseData?.data?.attributes?.firstName;
        selectedRow.cells[3].innerHTML = responseData?.data?.attributes?.lastName;
    } catch (error) {
        alert(error.message);
    }
}

export async function deleteUserHandler(id) {
    const httpConfig = {
        method: "DELETE",
    };

    try {
        const response = await fetch(apiUrl + id, httpConfig);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error.message || "Something went wrong!");
        }
        const delRow = document.querySelector(".user-" + id);
        delRow.remove();
    } catch (error) {
        alert(error.message);
    }
}
