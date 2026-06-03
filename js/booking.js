// ======= BOOKING MODAL =======
const modal = document.getElementById('bookingModal');
const openBtns = document.querySelectorAll('#openBookingBtn, .btn-reservar');
const closeModalBtn = document.getElementById('closeModal');

// State
let selectedService = '';
let selectedPrice = 0;
let selectedDate = '';
let selectedTime = '';
let clientName = '';
let clientPhone = '';
let clientNote = '';

// Open modal
function openModal(service = '', price = 0) {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (service && price) {
    selectedService = service;
    selectedPrice = price;
    // Pre-select in radio list
    document.querySelectorAll('input[name="service"]').forEach(r => {
      if (r.value === service) {
        r.checked = true;
        r.closest('.service-option').classList.add('selected');
      }
    });
    document.getElementById('step1Next').disabled = false;
  }
  showStep(1);
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  resetForm();
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// Open from hero/booking section button
document.getElementById('openBookingBtn').addEventListener('click', () => openModal());

// Open from menu "Reservar" buttons
document.querySelectorAll('.btn-reservar').forEach(btn => {
  btn.addEventListener('click', () => {
    const svc = btn.dataset.service;
    const price = parseInt(btn.dataset.price);
    openModal(svc, price);
  });
});

// ---- Steps ----
function showStep(n) {
  [1, 2, 3, 4].forEach(i => {
    document.getElementById(`modalStep${i}`).style.display = i === n ? 'block' : 'none';
    const dot = document.getElementById(`step-dot-${i}`);
    dot.classList.remove('active', 'done');
    if (i === n) dot.classList.add('active');
    if (i < n) dot.classList.add('done');
  });
}

// Step 1: service selection
document.querySelectorAll('input[name="service"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
    radio.closest('.service-option').classList.add('selected');
    selectedService = radio.value;
    selectedPrice = parseInt(radio.dataset.price);
    document.getElementById('step1Next').disabled = false;
  });
});

document.getElementById('step1Next').addEventListener('click', () => {
  if (!selectedService) return;
  showStep(2);
});

// Step 2: date/time
const today = new Date().toISOString().split('T')[0];
document.getElementById('bookingDate').min = today;

document.getElementById('step2Next').addEventListener('click', () => {
  selectedDate = document.getElementById('bookingDate').value;
  selectedTime = document.getElementById('bookingTime').value;
  if (!selectedDate) { alert('Por favor selecciona una fecha.'); return; }
  if (!selectedTime) { alert('Por favor selecciona una hora.'); return; }
  showStep(3);
});
document.getElementById('step2Back').addEventListener('click', () => showStep(1));

// Step 3: contact info
document.getElementById('step3Next').addEventListener('click', () => {
  clientName = document.getElementById('bookingName').value.trim();
  clientPhone = document.getElementById('bookingPhone').value.trim();
  clientNote = document.getElementById('bookingNote').value.trim();
  if (!clientName) { alert('Por favor ingresa tu nombre.'); return; }
  if (!clientPhone) { alert('Por favor ingresa tu número de WhatsApp.'); return; }
  fillPaymentSummary();
  showStep(4);
});
document.getElementById('step3Back').addEventListener('click', () => showStep(2));

// Step 4: payment
document.getElementById('step4Back').addEventListener('click', () => showStep(3));

function fillPaymentSummary() {
  const deposit = Math.ceil(selectedPrice * 0.3);
  const rest = selectedPrice - deposit;
  document.getElementById('payService').textContent = selectedService;
  document.getElementById('payTotal').textContent = `$${selectedPrice} MXN`;
  document.getElementById('payDeposit').textContent = `$${deposit} MXN`;
  document.getElementById('payRest').textContent = `$${rest} MXN`;
}

document.getElementById('confirmBooking').addEventListener('click', () => {
  const deposit = Math.ceil(selectedPrice * 0.3);
  const dateFormatted = formatDate(selectedDate);
  const msg = `¡Hola Siqueiros Barber Shop! 👋

Quisiera reservar mi cita con los siguientes datos:

✂️ *Servicio:* ${selectedService}
📅 *Fecha:* ${dateFormatted}
⏰ *Hora:* ${selectedTime}
👤 *Nombre:* ${clientName}
📱 *WhatsApp:* ${clientPhone}
${clientNote ? `📝 *Detalles:* ${clientNote}\n` : ''}
💰 *Total:* $${selectedPrice} MXN
💳 *Anticipo (30%):* $${deposit} MXN

Por favor indíquenme cómo realizar el pago del anticipo. ¡Gracias!`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/523223180206?text=${encoded}`, '_blank');
  closeModal();
  showConfirmationToast();
});

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function resetForm() {
  selectedService = '';
  selectedPrice = 0;
  selectedDate = '';
  selectedTime = '';
  clientName = '';
  clientPhone = '';
  clientNote = '';
  document.querySelectorAll('input[name="service"]').forEach(r => r.checked = false);
  document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
  document.getElementById('step1Next').disabled = true;
  document.getElementById('bookingDate').value = '';
  document.getElementById('bookingTime').value = '';
  document.getElementById('bookingName').value = '';
  document.getElementById('bookingPhone').value = '';
  document.getElementById('bookingNote').value = '';
}

function showConfirmationToast() {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
    background:#25D366; color:#fff; padding:1rem 2rem;
    border-radius:50px; font-weight:700; font-size:0.9rem;
    z-index:9999; box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation: toastIn 0.4s ease;
  `;
  toast.innerHTML = '✅ ¡Reserva enviada! Revisa tu WhatsApp.';
  const style = document.createElement('style');
  style.textContent = '@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }';
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Keyboard close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});
