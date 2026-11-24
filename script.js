// ==================== НАСТРОЙКИ TELEGRAM ====================
const TG_BOT_TOKEN = "ТВОЙ_ТОКЕН_БОТА";
const TG_CHAT_ID = "ТВОЙ_CHAT_ID";

async function sendTelegram(text) {
  if (TG_BOT_TOKEN.includes("ТВОЙ")) return;
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: "HTML" }),
    });
  } catch (e) {
    console.warn("TG error:", e);
  }
}

// ==================== ЗВЁЗДЫ ====================
const starsEl = document.getElementById("stars");
if (starsEl) {
  for (let i = 0; i < 120; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = Math.random() * 2.5 + 1;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    starsEl.appendChild(s);
  }
}

// ==================== ЭЛЕМЕНТЫ ====================
const envelopeScreen = document.getElementById("envelopeScreen");
const envelope = document.getElementById("envelope");
const loveScreen = document.getElementById("loveScreen");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const loveBtn = document.getElementById("loveBtn");
const finalMessage = document.getElementById("finalMessage");
const closeBtn = document.getElementById("closeBtn");
const yesBtn = document.getElementById("yesBtn");
const heartsBg = document.getElementById("heartsBg");
const textContainer = document.getElementById("text-container");
const flowerBtn = document.getElementById("flowerBtn");
const complimentBox = document.getElementById("complimentBox");

let opened = false;

// ==================== КНОПКА МУЗЫКИ ====================
if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicBtn.classList.remove("muted");
      musicBtn.textContent = "🎵";
    } else {
      bgMusic.pause();
      musicBtn.classList.add("muted");
      musicBtn.textContent = "🔇";
    }
  });
}

// ==================== ОТКРЫТИЕ КОНВЕРТА ====================
if (envelope) {
  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;

    envelope.classList.add("open");

    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => {
      document.body.addEventListener(
        "click",
        () => bgMusic.play().catch(() => {}),
        { once: true },
      );
    });

    const now = new Date().toLocaleString("ru-RU");
    sendTelegram(
      `💌 <b>Сальмина открыла конверт!</b>\n\n` +
        `🕒 Время: ${now}\n` +
        `👀 Она увидела твоё признание 💖`,
    );

    setTimeout(() => {
      envelopeScreen.classList.add("hidden");
      loveScreen.classList.add("show");
      startHearts();
      setTimeout(typewriterEffect, 1000);
    }, 1200);
  });
}

// ==================== ПЕЧАТНАЯ МАШИНКА ====================
function typewriterEffect() {
  const btn = document.getElementById("loveBtn");
  const signature = document.getElementById("signature");

  // Разбиваем текст на кусочки, чтобы выделить слово "естественно"
  const textParts = [
    {
      text: "Иногда для начала чего-то красивого не нужны особенные поводы — достаточно одного искреннего желания. Сегодня моё желание — подарить тебе немного радости и, если позволишь, сделать первый шаг навстречу знакомству. А дальше пусть всё происходит ",
      type: "text",
    },
    { text: "естественно", type: "highlight" },
    { text: ".", type: "text" },
  ];

  let partIndex = 0;
  let charIndex = 0;

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  textContainer.appendChild(cursor);

  function typeChar() {
    if (partIndex >= textParts.length) {
      cursor.remove();
      setTimeout(() => {
        if (signature) signature.style.opacity = 1;
        if (btn) btn.classList.add("visible");
      }, 500);
      return;
    }

    const currentPart = textParts[partIndex];
    const fullText = currentPart.text;

    if (charIndex < fullText.length) {
      const char = fullText.charAt(charIndex);

      // Если это часть highlight, создаем span
      if (currentPart.type === "highlight" && charIndex === 0) {
        const span = document.createElement("span");
        span.className = "secret-word";
        span.id = "secretWord";
        cursor.parentNode.insertBefore(span, cursor);
        span.appendChild(document.createTextNode(""));
      }

      if (currentPart.type === "highlight") {
        const span = document.getElementById("secretWord");
        if (span) span.textContent += char;
      } else {
        cursor.insertAdjacentText("beforebegin", char);
      }

      charIndex++;

      // ЗДЕСЬ БЫЛ АВТОСКРОЛЛ. Я его убрал, чтобы рамка не дергалась.

      setTimeout(typeChar, 40);
    } else {
      partIndex++;
      charIndex = 0;
      setTimeout(typeChar, 40);
    }
  }

  setTimeout(typeChar, 500);
}

// ==================== СЕКРЕТНОЕ СЛОВО ====================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("secret-word")) {
    for (let i = 0; i < 15; i++) {
      const star = document.createElement("div");
      star.className = "floating-heart";
      star.textContent = "✨";
      star.style.left = e.clientX + "px";
      star.style.top = e.clientY + "px";
      star.style.position = "fixed";
      star.style.fontSize = Math.random() * 20 + 15 + "px";
      star.style.animation = "none";
      document.body.appendChild(star);

      // Анимация разлета
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 100 + 50;
      star.animate(
        [
          { transform: "translate(0, 0)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000,
          easing: "ease-out",
        },
      ).onfinish = () => star.remove();
    }
    sendTelegram(`✨ <b>Сальмина нашла секретное слово!</b>`);
  }
});

// ==================== ПЛАВАЮЩИЕ СЕРДЕЧКИ ====================
// ==================== ПЛАВАЮЩИЕ СЕРДЕЧКИ ====================
let heartsInterval = null;
function startHearts() {
  if (heartsInterval) return;
  const symbols = ["❤", "💕", "💖", "💗", "💝", "🌹"];
  heartsInterval = setInterval(() => {
    const h = document.createElement("div");
    h.className = "floating-heart";
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = Math.random() * 100 + "%";

    // Уменьшили размер (было 20+15, стало 10+8)
    h.style.fontSize = Math.random() * 15 + 10 + "px";

    const dur = Math.random() * 4 + 5;
    h.style.animationDuration = dur + "s";
    if (heartsBg) heartsBg.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
  }, 800); // Увеличили паузу (было 350, стало 800)
}

// ==================== КОМПЛИМЕНТЫ ====================
const compliments = [
  "Ты делаешь этот мир добрее 🌸",
  "Твоя улыбка — лучшая на свете 😊",
  "С тобой каждый день как праздник ✨",
  "Ты невероятно красивая 💖",
  "Твои глаза сияют ярче звёзд ⭐",
  "Ты моё самое любимое чудо 💫",
];
let lastComplimentIndex = -1;

if (flowerBtn) {
  flowerBtn.addEventListener("click", () => {
    complimentBox.classList.remove("show");

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * compliments.length);
    } while (newIndex === lastComplimentIndex && compliments.length > 1);

    lastComplimentIndex = newIndex;

    setTimeout(() => {
      complimentBox.textContent = compliments[newIndex];
      complimentBox.classList.add("show");
    }, 100);
  });
}

// ==================== ЛОГИКА ОКОН ====================
if (loveBtn) {
  loveBtn.addEventListener("click", () => {
    sendTelegram(
      `💗 <b>Сальмина нажала кнопку «Нажми на меня»!</b>\n\n` +
        `🕒 ${new Date().toLocaleString("ru-RU")}\n` +
        `💖 Она читает признание...`,
    );
    finalMessage.classList.add("show");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    finalMessage.classList.remove("show");
  });
}

if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    sendTelegram(
      `💍💖 <b>САЛЬМИНА НАЖАЛА «ДА» !!!</b>\n\n` +
        `🕒 ${new Date().toLocaleString("ru-RU")}\n\n` +
        `🎉 ПОЗДРАВЛЯЮ, БРАТ! ОНА СКАЗАЛА ДА! 💐`,
    );

    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const h = document.createElement("div");
        h.className = "floating-heart";
        h.textContent = ["❤", "💖", "💕", "💗", "💍", "🌹"][
          Math.floor(Math.random() * 6)
        ];
        h.style.left = Math.random() * 100 + "%";
        h.style.fontSize = Math.random() * 30 + 20 + "px";
        const dur = Math.random() * 4 + 4;
        h.style.animationDuration = dur + "s";
        if (heartsBg) heartsBg.appendChild(h);
        setTimeout(() => h.remove(), dur * 1000);
      }, i * 80);
    }

    yesBtn.textContent = "❤ Я тебя люблю ❤";
    yesBtn.style.background = "linear-gradient(135deg, #ff2d55, #ff8fab)";
  });
}

// ==================== ПРОСМОТР ФОТО (ЛАЙТБОКС) ====================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

if (lightbox && lightboxImg) {
  const polaroidImages = document.querySelectorAll(".polaroid-img img");
  polaroidImages.forEach((img) => {
    img.parentElement.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("show");
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", (e) => {
      e.stopPropagation();
      lightbox.classList.remove("show");
    });
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("show");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("show")) {
      lightbox.classList.remove("show");
    }
  });
}

// ==================== УВЕДОМЛЕНИЕ О ЗАХОДЕ ====================
sendTelegram(
  `🚪 <b>Сальмина только что зашла на сайт!</b>\n\n` +
    `🕒 ${new Date().toLocaleString("ru-RU")}\n` +
    `👀 Ждём, когда откроет конверт...`,
);
