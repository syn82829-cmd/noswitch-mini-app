const tg = window.Telegram.WebApp;

function initTelegram() {
  tg.expand();
  tg.ready();

  // Автоматически ставим аватарку пользователя Telegram
  const user = tg.initDataUnsafe?.user;
  if (user?.photo_url) {
    const avatar = document.getElementById('user-avatar');
    avatar.innerHTML = `<img src="${user.photo_url}" alt="avatar">`;
  } else {
    // Заглушка, если нет фото
    document.getElementById('user-avatar').innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-gray-400 to-black flex items-center justify-center text-white text-xl font-bold">
        ${user?.first_name?.[0] || 'N'}
      </div>`;
  }
}

function switchTab(index) {
  document.querySelectorAll('.nav-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });

  const messages = ['👥 Друзья', '🎁 Бонусы', '👤 Профили'];
  tg.showAlert(messages[index]);
}

function openProfile() {
  tg.showAlert('Открываем профиль (скоро будет личный кабинет)');
}

async function createVpnAccount() {
  const statusEl = document.getElementById('status');
  statusEl.textContent = '⏳ Подключаюсь к серверу...';

  try {
    const res = await fetch('https://noswitch-backend.onrender.com/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId: tg.initDataUnsafe?.user?.id || 123456,
        username: tg.initDataUnsafe?.user?.username || 'test'
      })
    });
    const data = await res.json();
    statusEl.innerHTML = `✅ ${data.message}`;
    tg.showAlert('Аккаунт VPN создан!');
  } catch (e) {
    statusEl.textContent = '❌ Ошибка соединения';
  }
}

function buySubscription() {
  tg.showAlert('Платёж через Telegram Stars будет здесь (скоро)');
}

function showHowItWorks() {
  tg.showAlert('VPN всегда включён\nРоссийские сервисы идут напрямую\nЗаблокированные — через туннель');
}

// Инициализация
initTelegram();

const user = tg.initDataUnsafe?.user;
document.getElementById('status').innerHTML = `
  Привет, ${user?.first_name || 'друг'}!<br>
  Готов к NoSwitch?
`;
