// URL de tu Google Apps Script (Implementar > Nueva implementación > Aplicación web).
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCOH7l9Jm8ANwemjeffM8H0Fnk7MTtaOWDo6Qt88DM-G_lvfpizSpmeb4rLx99K16D/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const submitBtn = document.getElementById("submit-btn");
  const originalBtnText = submitBtn.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();

    if (!fullName || !email || !phone || !city) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Preparando tu pago...";

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, city })
      });
      const data = await res.json();

      if (data.status === "ok" && data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No pudimos iniciar tu pago. Por favor intenta de nuevo o escríbenos por WhatsApp.");
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    } catch (err) {
      alert("Hubo un problema de conexión. Por favor intenta de nuevo o escríbenos por WhatsApp.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
});
