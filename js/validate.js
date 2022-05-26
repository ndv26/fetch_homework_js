export default function validate(validateInput) {
    let isValid = true;
    if (validateInput.required) {
        isValid =
            isValid && validateInput.value.toString().trim().length !== 0;
    }
    if (validateInput.minLength) {
        isValid = isValid && validateInput.value.toString().trim().length >= validateInput.minLength;
    }
    return isValid;
}