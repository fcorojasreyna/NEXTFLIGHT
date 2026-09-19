// Payment Link de Stripe en MODO REAL para el pago completo de $697 USD.
const STRIPE_LINK = "https://buy.stripe.com/fZu5kvbm6gyj5uZ3tJ73G05";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();

    if (!fullName || !email || !phone || !city) return;

    const params = new URLSearchParams({
      prefilled_email: email,
      client_reference_id: fullName
    });

    window.location.href = `${STRIPE_LINK}?${params.toString()}`;
  });
});
