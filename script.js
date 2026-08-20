(() => {
  "use strict";

  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const year = document.getElementById("year");

  // Tema claro / oscuro
  const savedTheme = localStorage.getItem("erik-portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (icon) {
      icon.textContent = theme === "dark" ? "☀" : "☾";
    }

    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
      );
    }

    localStorage.setItem("erik-portfolio-theme", theme);
  }

  applyTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Formulario de contacto
  if (form && status) {
    const submitButton = form.querySelector('button[type="submit"]');
    const endpoint = "https://formsubmit.co/ajax/erikportero45@gmail.com";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const honey = form.querySelector('[name="_honey"]')?.value || "";

      // Los bots suelen rellenar campos ocultos.
      if (honey) {
        form.reset();
        return;
      }

      const originalText = submitButton ? submitButton.textContent : "Enviar mensaje ↗";

      try {
        status.className = "form-status is-sending";
        status.textContent = "Enviando mensaje...";

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Enviando...";
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `Nuevo contacto desde el portafolio — ${name}`,
            _template: "table"
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "No se pudo completar el envío.");
        }

        status.className = "form-status is-success";
        status.textContent = "¡Mensaje enviado correctamente! Gracias por contactarme.";
        form.reset();
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        status.className = "form-status is-error";
        status.textContent = "No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme a erikportero45@gmail.com.";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
