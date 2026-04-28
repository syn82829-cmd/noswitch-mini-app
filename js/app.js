const tg = window.Telegram.WebApp;
const BACKEND_URL = 'https://noswitch-backend.onrender.com';

// Инициализация Telegram
function initTelegram() {
  tg.expand();
  tg.ready();

  // Подставляем аватарку пользователя
  const user = tg.initDataUnsafe?.user;
  if (user?.photo_url) {
    const avatarEl = document.getElementById('user-avatar');
    avatarEl.innerHTML = `<img src="${user.photo_url}" alt="avatar">`;
  } else if (user?.first_name) {
    const avatarEl = document.getElementById('user-avatar');
    avatarEl.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-gray-400 to-black flex items-center justify-center text-white text-xl font-bold">
        ${user.first_name[0]}
      </div>`;
  }
}

// === ОПЛАТА ЧЕРЕЗ CRYPTOBOT ===
async function createInvoice() {
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = '⏳ Создаём ссылку на оплату...';

  try {
    const res = await fetch(`${BACKEND_URL}/create-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 250,
        description: 'Подписка NoSwitch VPN — 1 месяц'
      })
    });

    const data = await res.json();

    if (data.success && data.invoice_url) {
      statusEl.innerHTML = '✅ Ссылка на оплату создана!';
      tg.openLink(data.invoice_url);        // открывает оплату в новой вкладке
      // tg.showAlert('Перейдите по ссылке для оплаты');
    } else {
      throw new Error('Не удалось создать инвойс');
    }
  } catch (e) {
    console.error(e);
    statusEl.innerHTML = '❌ Ошибка при создании оплаты';
    tg.showAlert('Не удалось создать ссылку на оплату. Попробуйте позже.');
  }
}

// === ТЕСТОВАЯ ФУНКЦИЯ (для отладки) ===
async function createVpnAccount() {
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = '⏳ Создаём тестовый аккаунт...';

  try {
    const res = await fetch(`${BACKEND_URL}/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await res.json();
    statusEl.innerHTML = `✅ ${data.message}`;
    tg.showAlert('Тестовый аккаунт создан!');
  } catch (e) {
    statusEl.innerHTML = '❌ Ошибка';
  }
}

function showHowItWorks() {
  tg.showAlert('VPN всегда включён\nSplit-tunneling: российские сервисы идут напрямую, а Telegram, YouTube, Instagram — через VPN');
}

function switchTab(index) {
  document.querySelectorAll('.nav-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

function openProfile() {
  tg.showAlert('Личный кабинет будет здесь (скоро)');
}

// Запуск всего
initTelegram();

const user = tg.initDataUnsafe?.user;
document.getElementById('status').innerHTML = `
  Привет, ${user?.first_name || 'друг'}!<br>
  Готов к NoSwitch?
`;
