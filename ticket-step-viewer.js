(function () {
  const labels = ["Select instrument", "Add request details", "Confirm contact information", "Review and submit"];

  function mount(target, { currentStep = 1 } = {}) {
    if (!target) return undefined;
    const list = document.createElement("ol");
    list.className = "iss-steps";
    list.setAttribute("aria-label", "Support ticket progress");
    const progress = currentStep === 1 ? "0px" : `${[0, 300, 600, 900][currentStep - 1] - 18}px`;
    list.style.setProperty("--ticket-step-progress", progress);
    labels.forEach((label, index) => {
      const step = index + 1;
      const item = document.createElement("li");
      if (step < currentStep) item.classList.add("is-complete");
      if (step === currentStep) {
        item.classList.add("is-current");
        item.setAttribute("aria-current", "step");
      }
      item.innerHTML = `<span>${step}</span><strong>${label}</strong>`;
      list.append(item);
    });
    target.replaceWith(list);
    return list;
  }

  window.TicketStepViewer = Object.freeze({ mount });
})();
