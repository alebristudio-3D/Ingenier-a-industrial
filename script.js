(function () {
  "use strict";

  const PROGRAM_SLUG = "ingenieria-industrial";
  const PROGRAM_NAME = "Ingeniería Industrial";
  const WHATSAPP_NUMBER = "5212223606438";

  function encodeMessage(message) {
    return encodeURIComponent(message);
  }

  function buildWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeMessage(message)}`;
  }

  function trackWhatsApp(origin) {
    if (typeof window.gtag === "function") {
      window.gtag("event", "click_whatsapp", {
        programa: PROGRAM_SLUG,
        origen: origin || "sin-origen"
      });
    }
  }

  function setupWhatsAppLinks() {
    const links = document.querySelectorAll(".js-wa-link");

    links.forEach((link) => {
      const message = link.dataset.message;
      const origin = link.dataset.origin || "whatsapp-link";

      if (message) {
        link.href = buildWhatsAppUrl(message);
      }

      link.addEventListener("click", () => {
        trackWhatsApp(origin);
      });
    });
  }

  function setupTabs() {
    const tabsWrapper = document.querySelector("[data-tabs]");
    if (!tabsWrapper) return;

    const tabButtons = Array.from(tabsWrapper.querySelectorAll("[data-tab]"));
    const panels = Array.from(tabsWrapper.querySelectorAll(".dasc-panel"));

    function activateTab(button) {
      const targetId = button.dataset.tab;
      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      tabButtons.forEach((tab) => {
        const isActive = tab === button;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      panels.forEach((panel) => {
        const isActive = panel === targetPanel;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    }

    tabButtons.forEach((button, index) => {
      button.addEventListener("click", () => activateTab(button));

      button.addEventListener("keydown", (event) => {
        const key = event.key;
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) return;

        event.preventDefault();

        let nextIndex = index;
        if (key === "ArrowRight") nextIndex = (index + 1) % tabButtons.length;
        if (key === "ArrowLeft") nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        if (key === "Home") nextIndex = 0;
        if (key === "End") nextIndex = tabButtons.length - 1;

        tabButtons[nextIndex].focus();
        activateTab(tabButtons[nextIndex]);
      });
    });
  }

  function setupLeadForm() {
    const form = document.getElementById("leadForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const nombre = String(formData.get("nombre") || "").trim();
      const correo = String(formData.get("correo") || "").trim();
      const celular = String(formData.get("celular") || "").trim();
      const mensaje = String(formData.get("mensaje") || "").trim();

      const whatsappMessage = [
        `Hola, quiero informes de ${PROGRAM_NAME} 🌐🎯.`,
        "",
        `Nombre: ${nombre}`,
        `Correo: ${correo}`,
        `Celular: ${celular}`,
        mensaje ? `Mensaje: ${mensaje}` : "Mensaje: Quiero conocer costos, horarios, becas y proceso de inscripción."
      ].join("\n");

      trackWhatsApp("formulario");
      window.open(buildWhatsAppUrl(whatsappMessage), "_blank", "noopener");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupWhatsAppLinks();
    setupTabs();
    setupLeadForm();
  });
})();
