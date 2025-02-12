// scripts/modal.js

/**
 * Åbner modal-vinduet med angivet body- og footer-indhold.
 * @param {string} bodyContent - HTML-indhold til modal-body.
 * @param {string} footerContent - HTML-indhold til modal-footer.
 * @param {Function} [callback] - Eventuel callback-funktion, der kaldes efter modal er åbnet.
 */
function openModal(bodyContent, footerContent, callback) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalFooter = document.getElementById('modalFooter');
  
  modalBody.innerHTML = bodyContent;
  modalFooter.innerHTML = footerContent;
  modal.classList.remove('hidden');
  
  if (callback && typeof callback === 'function') {
    callback();
  }
}

/**
 * Lukker modal-vinduet og kalder evt. en callback.
 * @param {Function} [callback] - Callback-funktion, der kaldes efter modal er lukket.
 */
function closeModal(callback) {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  
  if (callback && typeof callback === 'function') {
    callback();
  }
}

// Tilføj event listener til krydset (modalClose) så modal lukkes ved klik.
document.getElementById('modalClose').addEventListener('click', () => {
  closeModal();
});

export { openModal, closeModal };
