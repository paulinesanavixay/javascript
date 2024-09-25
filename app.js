const registerForm = document.querySelector("#register-form");

// Listener soumission du formulaire
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault(); 

  // Récup la data du form
  const formData = new FormData(registerForm);
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_password");

  // Sélection des éléments du  spinner
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");
  const spinner = document.getElementById("loading-spinner");

  // Réinitialisation des messages d'erreur et de succès
  errorMessage.style.display = "none";
  successMessage.style.display = "none";

  // mdp
  if (password.length < 8 || password !== confirmPassword) {
    errorMessage.textContent = "The passwords do not match or are too short.";
    errorMessage.style.display = "block";
    return;
  }

  spinner.style.display = "block";

  try {
    const res = await fetch("http://localhost:8000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    // Cacher le spinner après la réponse de l'API
    spinner.style.display = "none";

    // Vérification de la réponse de l'API
    if (!res.ok) {
      const data = await res.json();
      errorMessage.textContent = data.message || "An error occurred during registration.";
      errorMessage.style.display = "block";
      return;
    }

    // Enregistrement réussi, récupération du token
    const data = await res.json();
    localStorage.setItem("JWT_TOKEN", data.token);

    // Affichage du message de succès
    successMessage.textContent = "Registration successful! You will be redirected...";
    successMessage.style.display = "block";

    
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000); 

  } catch (err) {
    console.error("Error:", err);
    errorMessage.textContent = "Connection error. Please try again later.";
    errorMessage.style.display = "block";
    spinner.style.display = "none";
  }
});
