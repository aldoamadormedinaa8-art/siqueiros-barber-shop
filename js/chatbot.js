// ======= CHATBOT =======
const toggle = document.getElementById('chatbotToggle');
const window_ = document.getElementById('chatbotWindow');
const chatIcon = document.getElementById('chatIcon');
const closeIcon = document.getElementById('closeIcon');
const badge = document.getElementById('chatBadge');
const messages = document.getElementById('chatMessages');
const input = document.getElementById('chatInput');
const sendBtn = document.getElementById('chatSend');
const closeBtnChat = document.getElementById('chatbotCloseBtn');

function openChat() {
  window_.classList.add('open');
  chatIcon.style.display = 'none';
  closeIcon.style.display = 'block';
  badge.style.display = 'none';
  setTimeout(() => input.focus(), 300);
}
function closeChat() {
  window_.classList.remove('open');
  chatIcon.style.display = 'block';
  closeIcon.style.display = 'none';
}
toggle.addEventListener('click', () => window_.classList.contains('open') ? closeChat() : openChat());
closeBtnChat.addEventListener('click', closeChat);

function addMessage(text, type = 'bot') {
  const div = document.createElement('div');
  div.className = type === 'bot' ? 'bot-message' : 'user-message';
  div.innerHTML = `<p>${text}</p>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function botReply(text) {
  setTimeout(() => {
    addMessage(text, 'bot');
  }, 600);
}

const responses = {
  horario: () => `⏰ <strong>Nuestros horarios son:</strong><br>
    Lun–Sáb: 9:00 AM – 8:00 PM<br>
    Domingo: 10:00 AM – 5:00 PM<br><br>
    ¿Te gustaría reservar una cita? 😊`,

  precio: () => `💰 <strong>Precios:</strong><br>
    • Corte Básico: $100 MXN<br>
    • Corte + Barba: $180 MXN<br>
    • Corte + Diseño: $180 MXN<br>
    • Afeitado Clásico: $120 MXN<br>
    • Corte Niño: $80 MXN<br>
    • Paquete Completo: $300 MXN<br><br>
    <em>Solo 30% de anticipo para reservar en línea.</em>`,

  ubicacion: () => `📍 Estamos en <strong>San José del Valle, Nayarit</strong>.<br><br>
    ¿Necesitas indicaciones? Escríbenos por WhatsApp: <strong>+52 322 318 0206</strong>`,

  reservar: () => `📅 Puedes reservar tu cita de dos formas:<br><br>
    1️⃣ <a href="#booking" style="color:var(--gold);font-weight:700;">Reserva en línea aquí</a> con anticipo del 30%<br>
    2️⃣ Escríbenos por <a href="https://wa.me/523223180206" target="_blank" style="color:#25D366;font-weight:700;">WhatsApp</a><br><br>
    ¡Tu lugar queda asegurado! ✅`,

  whatsapp: () => `📱 Nuestro WhatsApp es <strong>+52 322 318 0206</strong><br><br>
    <a href="https://wa.me/523223180206?text=Hola%2C%20quisiera%20informes%20de%20sus%20servicios." target="_blank" style="color:#25D366;font-weight:700;">👉 Toca aquí para chatear</a>`,

  servicio: () => `✂️ <strong>Nuestros servicios:</strong><br>
    • Cortes de todo tipo (fade, undercut, edgar...)<br>
    • Arreglo y perfilado de barba<br>
    • Diseños personalizados<br>
    • Afeitado clásico con navaja<br>
    • Cortes para niños<br><br>
    Ver <a href="#menu" style="color:var(--gold);font-weight:700;">menú completo de 20 estilos →</a>`,

  gracias: () => `¡Con mucho gusto! 😊 Estamos para servirte. ¿Hay algo más en lo que pueda ayudarte?`,

  hola: () => `¡Hola! 👋 Bienvenido a <strong>Siqueiros Barber Shop</strong>. ¿En qué te puedo ayudar hoy?`,

  default: () => `No encontré respuesta exacta para eso. 😅<br><br>
    Puedo ayudarte con:<br>
    ⏰ <strong>Horarios</strong> | 💰 <strong>Precios</strong> | 📍 <strong>Ubicación</strong> | 📅 <strong>Reservas</strong><br><br>
    O contáctanos en <a href="https://wa.me/523223180206" target="_blank" style="color:#25D366;font-weight:700;">WhatsApp</a>`,
};

function getResponse(msg) {
  const m = msg.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (/hola|buenas|buenos|hey|hi|salud/.test(m)) return responses.hola();
  if (/horario|hora|abre|cierra|cuando|schedule|time/.test(m)) return responses.horario();
  if (/precio|costo|cuanto|tarifa|vale|cobr|pag/.test(m)) return responses.precio();
  if (/ubic|donde|direccion|lugar|maps|mapa|san jose/.test(m)) return responses.ubicacion();
  if (/reserv|cita|apartar|agendar|book/.test(m)) return responses.reservar();
  if (/whatsapp|what|telefono|numero|llamar|contacto/.test(m)) return responses.whatsapp();
  if (/servicio|ofrece|hacen|corte|barba|diseño|fade|estilo/.test(m)) return responses.servicio();
  if (/gracia|thank|perfecto|genial|excelente|listo/.test(m)) return responses.gracias();
  return responses.default();
}

function handleSend() {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  input.value = '';
  // remove quick replies after first message
  const qr = document.getElementById('quickReplies');
  if (qr) qr.remove();
  botReply(getResponse(text));
}

sendBtn.addEventListener('click', handleSend);
input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

// Quick replies
document.querySelectorAll('.quick-reply').forEach(btn => {
  btn.addEventListener('click', () => {
    const msg = btn.dataset.msg;
    addMessage(msg, 'user');
    btn.closest('.chat-quick-replies').remove();
    botReply(getResponse(msg));
  });
});
