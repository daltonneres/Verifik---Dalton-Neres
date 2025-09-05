// OPEN

function toggleCard(el) {
  const card = el.closest(".consulta-card");
  const allCards = document.querySelectorAll(".consulta-card");

  allCards.forEach(c => {
    if (c !== card) {
      c.classList.remove("open"); // fecha todos os outros
    }
  });

  card.classList.toggle("open"); // abre/fecha o card clicado
}

// Menu WhatsApp
const openBtn = document.getElementById("openWhatsappMenu");
const menu = document.getElementById("whatsappMenu");

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendNameBtn = document.getElementById("sendName");
const userNameInput = document.getElementById("userName");

// Array para guardar os timeouts ativos
let chatTimeouts = [];

function addMessage(text, type = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.innerText = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para limpar todos os timeouts
function resetChat() {
  chatTimeouts.forEach(id => clearTimeout(id));
  chatTimeouts = [];
  chatMessages.innerHTML = "";
  chatInput.style.display = "none";
  userNameInput.value = "";
}

// Fecha ao clicar fora
if (openBtn && menu) {
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !openBtn.contains(e.target)) {
      menu.style.display = "none";
      resetChat(); // limpa tudo ao fechar
    }
  });
}

// Quando abrir o menu, inicia o chat
openBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (menu.style.display === "block") {
    menu.style.display = "none";
    resetChat();
  } else {
    menu.style.display = "block";
    resetChat();

    addMessage("👋 Seja bem-vindo ao autoatendimento da VERIFIK!");
    chatTimeouts.push(setTimeout(() => {
      addMessage("Por favor, nos diga seu nome:");
      chatInput.style.display = "flex";
    }, 1200));
  }
});

// Quando enviar o nome
sendNameBtn.addEventListener("click", () => {
  const name = userNameInput.value.trim();
  if (!name) return;

  addMessage(name, "user");
  chatInput.style.display = "none";

  chatTimeouts.push(setTimeout(() => {
    addMessage(`Prazer em falar com você, ${name}! 😃`);
  }, 800));

  // Após 8s → Instagram
  chatTimeouts.push(setTimeout(() => {
    addMessage("📲 Já nos acompanha no Instagram?");
    const options = document.createElement("div");
    options.classList.add("options");
    options.innerHTML = `
      <a href="https://www.instagram.com/serasacascavel/" target="_blank">📸 Acessar Instagram</a>
    `;
    chatMessages.appendChild(options);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 8000));

  // Após +8s → Guia de Soluções
  chatTimeouts.push(setTimeout(() => {
    addMessage("📘 Confira também nosso Guia de Soluções:");
    const options = document.createElement("div");
    options.classList.add("options");
    options.innerHTML = `
      <a href="https://www.verifik.com.br/solucoes" target="_blank">📑 Ver Guia de Soluções</a>
    `;
    chatMessages.appendChild(options);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 16000));

  // Após +8s → Suporte e Vendas
  chatTimeouts.push(setTimeout(() => {
    addMessage("Escolha uma opção abaixo para falar conosco:");
    const options = document.createElement("div");
    options.classList.add("options");
    options.innerHTML = `
      <a href="https://wa.me/554532257420?text=Quero%20falar%20com%20o%20Suporte">🛠 Suporte</a>
      <a href="https://wa.me/554532257421?text=Quero%20falar%20com%20Vendas">💼 Vendas</a>
    `;
    chatMessages.appendChild(options);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 24000));

  // Após +8s → Agradecimento final
  chatTimeouts.push(setTimeout(() => {
    addMessage("✅ Agradecemos novamente pelo seu contato, estamos à disposição!");
  }, 32000));
});
