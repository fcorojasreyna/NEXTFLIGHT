// Payment Links de Stripe (modo prueba). Generados por setup_stripe.ps1 desde stripe_config.json.
// Cuando pases a modo real, reemplaza estas dos URLs por los Payment Links de tu cuenta live.
const STRIPE_LINKS = {
  full: "https://buy.stripe.com/test_28E6ozbm6ci35uZfcr73G00",        // Pago completo $697 USD
  installment: "https://buy.stripe.com/test_dRm7sD9dYeqb0aF1lB73G01"  // 2 pagos de $349 USD (primera cuota)
};

// URL de tu Google Apps Script (Implementar > Nueva implementación > Aplicación web).
// Reemplaza este placeholder por la URL que termina en /exec. Mientras diga "PEGA_AQUI...",
// el formulario NO intentará guardar en Sheets y solo redirigirá a Stripe.
const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxCOH7l9Jm8ANwemjeffM8H0Fnk7MTtaOWDo6Qt88DM-G_lvfpizSpmeb4rLx99K16D/exec";

document.addEventListener("DOMContentLoaded", () => {
  const planOptions = document.querySelectorAll(".plan-option");
  const radios = document.querySelectorAll('input[name="plan"]');

  function syncPlanStyles() {
    planOptions.forEach((opt) => {
      const input = opt.querySelector("input");
      opt.classList.toggle("is-selected", input.checked);
    });
  }
  radios.forEach((r) => r.addEventListener("change", syncPlanStyles));
  syncPlanStyles();

  planOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      const input = opt.querySelector("input");
      input.checked = true;
      syncPlanStyles();
    });
  });

  const form = document.getElementById("checkout-form");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();
    const selectedPlan = document.querySelector('input[name="plan"]:checked').value;

    if (!fullName || !email || !phone || !city) return;

    const baseUrl = STRIPE_LINKS[selectedPlan];
    const params = new URLSearchParams({
      prefilled_email: email,
      client_reference_id: fullName
    });
    const stripeUrl = `${baseUrl}?${params.toString()}`;

    function goToStripe() {
      window.location.href = stripeUrl;
    }

    if (SHEETS_WEBHOOK_URL.startsWith("PEGA_AQUI")) {
      // Todavia no se conecto Google Sheets: se va directo a Stripe.
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
      body: JSON.stringify({ fullName, email, phone, city, plan: selectedPlan })
    }).catch(() => {}).finally(goToStripe);

    setTimeout(goToStripe, 2500);
  });
});
