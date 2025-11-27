// static/js/report.js

(function () {
  const workerUrl = "https://github-wiki.vpkkombatmarn.workers.dev";

  let floatingBtn, popup;

  document.addEventListener("DOMContentLoaded", () => {
    floatingBtn = document.getElementById("report-floating-button");
    popup = document.getElementById("report-popup");

    const sendBtn = document.getElementById("report-popup-send");
    const cancelBtn = document.getElementById("report-popup-cancel");

    sendBtn.onclick = sendReport;
    cancelBtn.onclick = hidePopup;

    document.addEventListener("mouseup", handleSelection);
  });

    function handleSelection(e) {
    if (popup.contains(e.target) || floatingBtn.contains(e.target)) {
        return;
    }

    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (!text) {
        floatingBtn.style.display = "none";
        hidePopup();
        return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();

    floatingBtn.style.left = window.scrollX + rect.left + "px";
    floatingBtn.style.top = window.scrollY + rect.top - 35 + "px";
    floatingBtn.style.display = "block";

    floatingBtn.onclick = () => openPopup(text, rect);
    }


  function openPopup(selectionText, rect) {
    const sel = document.getElementById("report-popup-selection");
    const comment = document.getElementById("report-popup-comment");
    const email = document.getElementById("report-popup-email");
    const status = document.getElementById("report-popup-status");

    sel.textContent = selectionText;
    comment.value = "";
    email.value = "";
    status.style.display = "none";

    popup.style.left = window.scrollX + rect.left + "px";
    popup.style.top = window.scrollY + rect.bottom + 10 + "px";

    popup.style.display = "block";
    floatingBtn.style.display = "none";
  }

  function hidePopup() {
    popup.style.display = "none";
  }

  async function sendReport() {
    const sel = document.getElementById("report-popup-selection").textContent;
    const comment = document.getElementById("report-popup-comment").value.trim();
    const email = document.getElementById("report-popup-email").value.trim();
    const status = document.getElementById("report-popup-status");

    if (!comment) {
      status.style.display = "block";
      status.style.color = "#c00";
      status.textContent = "Опишите проблему.";
      return;
    }

    status.style.display = "block";
    status.style.color = "#000";
    status.textContent = "Отправка…";

    const payload = {
      selection: sel,
      comment,
      email: email || null,
      page: window.location.pathname,
      url: window.location.href
    };

    try {
      const res = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        status.style.color = "#c00";
        status.textContent = "Ошибка при отправке.";
        return;
      }

      status.style.color = "#080";
      status.textContent = "Готово!";

      setTimeout(hidePopup, 1200);
    } catch {
      status.style.color = "#c00";
      status.textContent = "Ошибка сети.";
    }
  }
})();
