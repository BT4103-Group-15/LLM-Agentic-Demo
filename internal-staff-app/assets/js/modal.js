function showModal(message) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon"></div>
            <div class="modal-message">${message}</div>
            <button class="modal-button" onclick="closeModal(this)">Okay</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal(button) {
    button.closest('.modal-overlay').remove();
}