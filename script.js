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
const emailInputDiv = document.getElementById("emailInput");
const sendEmailBtn = document.getElementById("sendEmail");
const userEmailInput = document.getElementById("userEmail");

let chatTimeouts = [];

function addMessage(text, type = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.innerText = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function resetChat() {
  chatTimeouts.forEach(id => clearTimeout(id));
  chatTimeouts = [];
  chatMessages.innerHTML = "";
  chatInput.style.display = "none";
  emailInputDiv.style.display = "none";
  userNameInput.value = "";
  userEmailInput.value = "";
}

// Fecha ao clicar fora
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !openBtn.contains(e.target)) {
    menu.style.display = "none";
    resetChat();
  }
});

// Abre o menu e inicia o chat
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

// Envia nome
sendNameBtn.addEventListener("click", () => {
  const name = userNameInput.value.trim();
  if (!name) return;
  addMessage(name, "user");
  chatInput.style.display = "none";

  chatTimeouts.push(setTimeout(() => {
    addMessage(`Prazer em falar com você, ${name}! 😃`);
  }, 800));

  chatTimeouts.push(setTimeout(() => {
    addMessage("Agora, poderia nos informar seu e-mail?");
    emailInputDiv.style.display = "flex";
  }, 2000));
});

// Envia e-mail usando Formsubmit.co
sendEmailBtn.addEventListener("click", () => {
  const email = userEmailInput.value.trim();
  const name = userNameInput.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    addMessage("❌ Por favor, insira um e-mail válido.");
    return;
  }
  addMessage(email, "user");
  emailInputDiv.style.display = "none";


  // Cria um formulário temporário e envia para Formsubmit.co
  // Cria um formulário temporário e envia para Formsubmit.co
  const form = document.createElement("form");
  form.action = "https://formsubmit.co/daltonjoseneres7@gmail.com";
  form.method = "POST";

  const nomeInput = document.createElement("input");
  nomeInput.name = "nome";
  nomeInput.value = name;
  form.appendChild(nomeInput);

  const emailInput = document.createElement("input");
  emailInput.name = "email";
  emailInput.value = email;
  form.appendChild(emailInput);

  // CAMPO OCULTO DE ORIGEM
  const origemInput = document.createElement("input");
  origemInput.type = "hidden";
  origemInput.name = "origem";
  origemInput.value = "Formulário - Chat WhatsApp";
  form.appendChild(origemInput);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  addMessage("📩 Seus dados foram enviados com sucesso!");

  // Opções de suporte/comercial
  chatTimeouts.push(setTimeout(() => {
    addMessage("Escolha uma opção abaixo para falar conosco:");
    const options = document.createElement("div");
    options.classList.add("options");
    options.innerHTML = `
      <a href="https://api.whatsapp.com/send?phone=554532257420&text=Quero%20falar%20com%20o%20SUPORTE">🛠 Suporte</a>
      <a href="https://api.whatsapp.com/send?phone=554532257420&text=Quero%20falar%20com%20o%20COMERCIAL">💼 Comercial</a>
    `;
    chatMessages.appendChild(options);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 2000));

  // Agradecimento final
  chatTimeouts.push(setTimeout(() => {
    addMessage("✅ Agradecemos novamente pelo seu contato, estamos à disposição!");
  }, 8000));
});

// Botão voltar ao topo
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
