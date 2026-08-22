(function () {
  function mount(target, {
    currentStep = 1,
    labels = ["Select instrument", "Add request details", "Confirm contact information", "Review and submit"],
    ariaLabel = "Support ticket progress",
    firstStepProgress = "0px",
  } = {}) {
    if (!target) return undefined;
    const list = document.createElement("ol");
    list.className = "iss-steps";
    if (labels.length === 5) list.classList.add("iss-steps--five");
    list.setAttribute("aria-label", ariaLabel);
    const progress = currentStep === 1
      ? firstStepProgress
      : `calc(${((currentStep - 1) / labels.length) * 100}% - 18px)`;
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
