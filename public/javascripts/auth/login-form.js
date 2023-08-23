window.addEventListener("DOMContentLoaded", () => {
  resetPassword();
});

const resetPassword = () => {
  const forgottenPassword = document.querySelector("#forgot-password");
  forgottenPassword.addEventListener("click", async () => {
    try {
      const { value: email } = await Swal.fire({
        title: "Entrez votre email",
        input: "email",
        inputLabel: "Your email address",
        inputPlaceholder: "example@email.com",
      });

      if (email) {
        Swal.fire(`Entered email: ${email}`);
        try {
          const response = await axios.post("/users/forgotten-password", {
            email,
          });
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Vous avez reçu un email avec les instructions",
          });
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Une erreur est survenue, vérifier l'email",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};
