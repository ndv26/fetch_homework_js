const idConfig = ["username", "email", "firstName", "lastName", "password"];

export function getInputElements() {
    const inputElements = idConfig.map((id) => {
        return document.getElementById(id);
    });
    return inputElements;
}
