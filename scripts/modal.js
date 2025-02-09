// scripts/modal.js
export function openModal(bodyContent, footerContent = "") {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalFooter = document.getElementById('modalFooter');
  modalBody.innerHTML = bodyContent;
  modalFooter.innerHTML = footerContent;
  modal.classList.remove('hidden');
  gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.5 });
}

export function closeModal(callback) {
  const modal = document.getElementById('modal');
  gsap.to(modal, { opacity: 0, duration: 0.5, onComplete: () => {
    modal.classList.add('hidden');
    if (callback) callback();
  }});
}
