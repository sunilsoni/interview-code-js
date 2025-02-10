document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const mobileInput = document.getElementById("mobile");
    const emailInput = document.getElementById("email");
    const submitButton = document.getElementById("submit");
    const errorDiv = document.getElementById("error");
    const summaryTable = document.getElementById("summaryTable").getElementsByTagName('tbody')[0];

    function validateName(name) {
        return /^[A-Za-z ]{1,20}$/.test(name);
    }

    function validateMobile(mobile) {
        return /^[0-9]{10}$/.test(mobile);
    }

    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9.]{1,9}@[a-zA-Z]{2,20}\.[a-zA-Z]{2,10}$/;
        return emailRegex.test(email);
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
    }

    function hideError() {
        errorDiv.style.display = "none";
    }

    function clearForm() {
        nameInput.value = "";
        mobileInput.value = "";
        emailInput.value = "";
    }

    function addToTable(name, mobile, email) {
        const newRow = summaryTable.insertRow();
        newRow.insertCell(0).textContent = name;
        newRow.insertCell(1).textContent = mobile;
        newRow.insertCell(2).textContent = email;
    }

    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        const mobile = mobileInput.value.trim();
        const email = emailInput.value.trim();

        if (!name || !mobile || !email) {
            showError("All fields are required!");
            return;
        }

        if (!validateName(name)) {
            showError("Invalid Name: Only letters & spaces, max 20 chars");
            return;
        }

        if (!validateMobile(mobile)) {
            showError("Invalid Mobile: Must be exactly 10 digits");
            return;
        }

        if (!validateEmail(email)) {
            showError("Invalid Email: Must follow the required format");
            return;
        }

        hideError();
        addToTable(name, mobile, email);
        clearForm();
    });
});
