import "./style.css";

const registerButton = document.getElementById(
  "registerButton"
) as HTMLButtonElement;

const backButton = document.getElementById("backButton") as HTMLButtonElement;

const registrationForm = document.getElementById(
  "registrationForm"
) as HTMLDivElement;
const emailField = document.getElementById("email") as HTMLInputElement;
const passwordField = document.getElementById("password") as HTMLInputElement;
const confirmPasswordField = document.getElementById(
  "confirmPassword"
) as HTMLInputElement;
const successDiv = document.getElementById("successMessage") as HTMLDivElement;
const errorDiv = document.getElementById("errorMessage") as HTMLDivElement;

//error function
const showError = (message: string) => {
  const errorDiv = document.getElementById("errorMessage") as HTMLDivElement;
  errorDiv.innerHTML = message;
  errorDiv.style.display = "block";
};

//show Form function
const showForm = () => {
  registrationForm.style.display = "block";
  successDiv.style.display = "none";
  emailField.value = "";
  passwordField.value = "";
  confirmPasswordField.value = "";
  errorDiv.style.display = "none";
};

const registerFunction = () => {
  const email = emailField.value.trim();
  const password = passwordField.value.trim();
  const confirmPassword = confirmPasswordField.value.trim();

  let isValid = true;
  let errorMessage = "";

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  //validate email
  if (!isValidEmail) {
    emailField.classList.add("error");
    isValid = false;
    errorMessage += "Invalid email address";
  } else {
    emailField.classList.remove("error");
    emailField.classList.add("success");
  }

  //validate password
  if (password.length < 5) {
    passwordField.classList.add("error");
    isValid = false;
    errorMessage += "Password must be at least 5 characters long";
  } else {
    passwordField.classList.remove("error");
    passwordField.classList.add("success");
  }

  //validate password confirmation
  if (password !== confirmPassword) {
    confirmPasswordField.classList.add("error");
    isValid = false;
    errorMessage += "Password and confirmation do not match";
  } else {
    confirmPasswordField.classList.remove("error");
    confirmPasswordField.classList.add("success");
  }

  if (isValid) {
    const formData = {
      email,
      password,
      confirmPassword,
    };

    fetch("/ap/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        registrationForm.style.display = "none";

        successDiv.style.display = "block";
      })
      .catch((error) => {
        console.error("There was a problem with the registration:", error);
        showError(
          "There was a problem with the registration. Please try again later."
        );
      });
  } else {
    showError(errorMessage);
  }
};

registerButton.addEventListener("clic", registerFunction);
backButton.addEventListener("click", showForm);
