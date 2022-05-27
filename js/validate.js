export default function validate(validateInput) {
    let isValid = true;
    if (validateInput.isRequired) {
        isValid = isValid && validateInput.value.toString().trim().length !== 0;
    }
    if (validateInput.isEmail) {
        isValid = isValid && validateInput.value.toString().trim().includes("@");
    }
    if (validateInput.minLength) {
        isValid = isValid && validateInput.value.toString().trim().length >= validateInput.minLength;
    }
    return isValid;
}
