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

// 🔹 Alterado para CNPJ
const cnpjInputDiv = document.getElementById("cnpjInput");
const sendCnpjBtn = document.getElementById("sendCnpj");
const userCnpjInput = document.getElementById("userCnpj");

let chatTimeouts = [];

// 👉 Máscara automática para CNPJ
userCnpjInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, ""); // só números
  if (value.length > 14) value = value.slice(0, 14);

  if (value.length <= 2) {
    value = value.replace(/(\d{0,2})/, "$1");
  } else if (value.length <= 5) {
    value = value.replace(/(\d{2})(\d{0,3})/, "$1.$2");
  } else if (value.length <= 8) {
    value = value.replace(/(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
  } else if (value.length <= 12) {
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
  } else {
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5");
  }

  e.target.value = value;
});

// Função para validar CNPJ
function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado == digitos.charAt(1);
}

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
  cnpjInputDiv.style.display = "none"; // 🔹 reset CNPJ
  userNameInput.value = "";
  userCnpjInput.value = "";
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
    addMessage("Agora, poderia nos informar seu CNPJ?");
    cnpjInputDiv.style.display = "flex"; // 🔹 pede CNPJ
  }, 2000));
});

// Envia CNPJ via AJAX
sendCnpjBtn.addEventListener("click", () => {
  const cnpj = userCnpjInput.value.trim();
  const name = userNameInput.value.trim();
  if (!cnpj || !validarCNPJ(cnpj)) {
    addMessage("❌ Por favor, insira um CNPJ válido.");
    return;
  }
  addMessage(cnpj, "user");
  cnpjInputDiv.style.display = "none";

  // 🔹 Envia com fetch para Formsubmit.co
  fetch("https://formsubmit.co/ajax/verifik@verifik.com.br", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ nome: name, cnpj: cnpj })
  })
    .then(response => response.json())
    .then(data => {
      addMessage("📩 Seus dados foram enviados com sucesso!");
    })
    .catch(error => {
      addMessge("⚠️ Ocorreu um erro ao enviar os dados. Tente novamente.");
    });

  // Opções de suporte/comercial com nome e CNPJ
  chatTimeouts.push(setTimeout(() => {
    addMessage("Escolha uma opção abaixo para falar conosco:");
    const options = document.createElement("div");
    options.classList.add("options");

    const suporteMsg = `Olá, meu nome é ${name} e meu CNPJ é ${cnpj}. Quero falar com o SUPORTE.`;
    const comercialMsg = `Olá, meu nome é ${name} e meu CNPJ é ${cnpj}. Quero falar com o COMERCIAL.`;

    options.innerHTML = `
      <a href="https://api.whatsapp.com/send?phone=554532257420&text=${encodeURIComponent(suporteMsg)}">🛠 Suporte</a>
      <a href="https://api.whatsapp.com/send?phone=554532257420&text=${encodeURIComponent(comercialMsg)}">💼 Comercial</a>
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
