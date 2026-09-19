// Payment Link de Stripe en MODO REAL para el pago completo de $697 USD.
const STRIPE_LINK = "https://buy.stripe.com/fZu5kvbm6gyj5uZ3tJ73G05";

// URL de tu Google Apps Script (Implementar > Nueva implementación > Aplicación web).
const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxCOH7l9Jm8ANwemjeffM8H0Fnk7MTtaOWDo6Qt88DM-G_lvfpizSpmeb4rLx99K16D/exec";

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
    const stripeUrl = `${STRIPE_LINK}?${params.toString()}`;

    function goToStripe() {
      window.location.href = stripeUrl;
    }

    if (SHEETS_WEBHOOK_URL.startsWith("PEGA_AQUI")) {
      goToStripe();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Guardando tu inscripción...";

    // Con mode:"no-cors" no podemos leer la respuesta de Apps Script, pero la fila
    // igual se guarda en el Sheet. Por eso redirigimos apenas se envía la solicitud,
    // con un pequeño margen por si la red está lenta.
    fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ fullName, email, phone, city, plan: "full" })
    }).catch(() => {}).finally(goToStripe);

    setTimeout(goToStripe, 2500);
  });
});
