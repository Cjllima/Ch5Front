
document.addEventListener("DOMContentLoaded", function () {

  function buscar(id) {
    return document.getElementById(id);
  }


  const sidebar = buscar("sidebar");
  const fundoMenu = buscar("fundo-menu");

  function abrirMenu() {
    sidebar.classList.remove("-translate-x-full");
    fundoMenu.classList.remove("hidden");
  }

  function fecharMenu() {
    sidebar.classList.add("-translate-x-full");
    fundoMenu.classList.add("hidden");
  }

  buscar("abrir-menu").addEventListener("click", abrirMenu);
  buscar("fechar-menu").addEventListener("click", fecharMenu);
  fundoMenu.addEventListener("click", fecharMenu);

  document.querySelectorAll(".link-menu").forEach(function (link) {
    link.addEventListener("click", function () {
      document.querySelectorAll(".link-menu").forEach(function (item) {
        item.classList.remove("selecionado");
      });
      link.classList.add("selecionado");
      fecharMenu();
    });
  });


  const botaoTema = buscar("botao-tema");
  const menuTema = buscar("menu-tema");
  const botaoUsuario = buscar("botao-usuario");
  const menuUsuario = buscar("menu-usuario");

  function alternarMenu(botao, menu) {
    const vaiAbrir = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !vaiAbrir);
    botao.setAttribute("aria-expanded", String(vaiAbrir));
  }

  botaoTema.addEventListener("click", function (evento) {
    evento.stopPropagation();
    alternarMenu(botaoTema, menuTema);
    menuUsuario.classList.add("hidden");
    botaoUsuario.setAttribute("aria-expanded", "false");
  });

  botaoUsuario.addEventListener("click", function (evento) {
    evento.stopPropagation();
    alternarMenu(botaoUsuario, menuUsuario);
    menuTema.classList.add("hidden");
    botaoTema.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", function () {
    menuTema.classList.add("hidden");
    menuUsuario.classList.add("hidden");
    botaoTema.setAttribute("aria-expanded", "false");
    botaoUsuario.setAttribute("aria-expanded", "false");
  });


  const preferenciaSistema = window.matchMedia("(prefers-color-scheme: dark)");

  function aplicarTema(tema) {
    const usarEscuro = tema === "dark" || (tema === "system" && preferenciaSistema.matches);
    document.documentElement.classList.toggle("dark", usarEscuro);
    localStorage.setItem("techflow-tema", tema);

    document.querySelectorAll("[data-tema]").forEach(function (botao) {
      botao.textContent = botao.dataset.tema === tema
        ? botao.dataset.tema.charAt(0).toUpperCase() + botao.dataset.tema.slice(1) + " ✓"
        : botao.dataset.tema.charAt(0).toUpperCase() + botao.dataset.tema.slice(1);
    });
  }

  const temaSalvo = localStorage.getItem("techflow-tema") || "system";
  aplicarTema(temaSalvo);

  document.querySelectorAll("[data-tema]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      aplicarTema(botao.dataset.tema);
      menuTema.classList.add("hidden");
      mostrarAviso("Tema atualizado.");
    });
  });

  preferenciaSistema.addEventListener("change", function () {
    if (localStorage.getItem("techflow-tema") === "system") {
      aplicarTema("system");
    }
  });


  const camposPesquisa = [buscar("pesquisa"), buscar("pesquisa-cards")].filter(Boolean);
  const botoesFiltro = document.querySelectorAll("[data-filtro]");
  let filtroAtual = "todos";

  function filtrarProjetos() {
    const texto = camposPesquisa.length > 0
      ? camposPesquisa.find(function (campo) { return campo.value.trim() !== ""; })?.value.toLowerCase() || ""
      : "";
    let quantidadeVisivel = 0;

    document.querySelectorAll(".cartao-projeto").forEach(function (cartao) {
      const nome = (cartao.dataset.nome + " " + cartao.innerText).toLowerCase();
      const combinaTexto = nome.includes(texto);
      const combinaFiltro = filtroAtual === "todos" || cartao.dataset.status === filtroAtual;
      const mostrar = combinaTexto && combinaFiltro;
      cartao.classList.toggle("hidden", !mostrar);
      if (mostrar) quantidadeVisivel++;
    });

    buscar("nenhum-projeto").classList.toggle("hidden", quantidadeVisivel > 0);
  }

  camposPesquisa.forEach(function (campo) {
    campo.addEventListener("input", function () {
      camposPesquisa.forEach(function (outroCampo) {
        if (outroCampo !== campo) outroCampo.value = campo.value;
      });
      filtrarProjetos();
    });
  });

  botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () {
      filtroAtual = botao.dataset.filtro;
      botoesFiltro.forEach(function (outroBotao) {
        outroBotao.classList.toggle("ativo", outroBotao === botao);
      });
      filtrarProjetos();
    });
  });


  const modal = buscar("modal-projeto");
  const formulario = buscar("form-projeto");
  const camposFormulario = formulario.querySelectorAll(".campo-formulario");
  const mensagemFormulario = buscar("mensagem-formulario");

  function abrirModal() {
    modal.classList.add("aberto");
    buscar("nome-projeto").focus();
  }

  function fecharModal() {
    modal.classList.remove("aberto");
    formulario.reset();
    limparErros();
    mensagemFormulario.classList.add("hidden");
    buscar("salvar-projeto").disabled = false;
    buscar("salvar-projeto").textContent = "Criar projeto";
  }

  buscar("abrir-modal").addEventListener("click", abrirModal);
  buscar("fechar-modal").addEventListener("click", fecharModal);
  buscar("cancelar-projeto").addEventListener("click", fecharModal);

  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) fecharModal();
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharModal();
      fecharMenu();
      menuTema.classList.add("hidden");
      menuUsuario.classList.add("hidden");
    }
  });


  function validarCampo(campo) {
    const valor = campo.value.trim();
    let valido = valor !== "";

    if (campo.id === "nome-projeto") valido = valor.length >= 3;
    if (campo.id === "descricao") valido = valor.length >= 10;
    if (campo.id === "prazo") valido = valor !== "" && valor >= dataDeHoje();

    campo.classList.toggle("invalido", !valido);
    campo.setAttribute("aria-invalid", String(!valido));

    const mensagemErro = campo.parentElement.querySelector(".mensagem-erro");
    if (mensagemErro) mensagemErro.classList.toggle("hidden", valido);

    return valido;
  }

  function dataDeHoje() {
    const hoje = new Date();
    hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
    return hoje.toISOString().slice(0, 10);
  }

  function limparErros() {
    camposFormulario.forEach(function (campo) {
      campo.classList.remove("invalido");
      campo.setAttribute("aria-invalid", "false");
    });
    formulario.querySelectorAll(".mensagem-erro").forEach(function (mensagem) {
      mensagem.classList.add("hidden");
    });
  }

  camposFormulario.forEach(function (campo) {
    campo.addEventListener("blur", function () {
      validarCampo(campo);
    });
    campo.addEventListener("input", function () {
      if (campo.classList.contains("invalido")) validarCampo(campo);
      mensagemFormulario.classList.add("hidden");
    });
    campo.addEventListener("change", function () {
      if (campo.classList.contains("invalido")) validarCampo(campo);
    });
  });


  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let formularioValido = true;

    camposFormulario.forEach(function (campo) {
      if (!validarCampo(campo)) formularioValido = false;
    });

    if (!formularioValido) {
      mensagemFormulario.textContent = "Confira os campos marcados antes de continuar.";
      mensagemFormulario.className = "mt-4 rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200";
      return;
    }

    const botaoSalvar = buscar("salvar-projeto");
    botaoSalvar.disabled = true;
    botaoSalvar.textContent = "Criando...";

    const nome = buscar("nome-projeto").value.trim();
    const responsavel = buscar("responsavel").value.trim();
    const categoria = buscar("categoria").value;
    const prioridade = buscar("prioridade").value;
    const prazo = new Date(buscar("prazo").value + "T12:00:00").toLocaleDateString("pt-BR");
    const descricao = buscar("descricao").value.trim();

    const novoCartao = document.createElement("article");
    novoCartao.className = "cartao-projeto group";
    novoCartao.dataset.status = "andamento";
    novoCartao.dataset.nome = (nome + " " + descricao + " " + categoria).toLowerCase();


    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";
    etiqueta.textContent = "Em andamento · " + prioridade;

    const titulo = document.createElement("h3");
    titulo.className = "mt-3 text-lg font-bold";
    titulo.textContent = nome;

    const texto = document.createElement("p");
    texto.className = "mt-2 text-sm text-slate-500 dark:text-slate-400";
    texto.textContent = descricao;


    const categoriaTexto = document.createElement("p");
    categoriaTexto.className = "mt-2 text-xs text-slate-500 dark:text-slate-400";
    categoriaTexto.textContent = "Categoria: " + categoria;

    // Linha que mostra o percentual de progresso
    const areaProgresso = document.createElement("div");
    areaProgresso.className = "mt-5 flex items-center justify-between text-sm";

    const rotuloProgresso = document.createElement("span");
    rotuloProgresso.className = "texto-pequeno";
    rotuloProgresso.textContent = "Progresso";

    const porcentagemProgresso = document.createElement("strong");
    porcentagemProgresso.textContent = "0%";

    areaProgresso.append(rotuloProgresso, porcentagemProgresso);

    // Barra de progresso, inicialmente vazia
    const barraProgresso = document.createElement("div");
    barraProgresso.className = "barra-progresso";

    const preenchimentoProgresso = document.createElement("span");
    preenchimentoProgresso.className = "bg-blue-600";
    preenchimentoProgresso.style.width = "0%";

    barraProgresso.append(preenchimentoProgresso);


    const rodape = document.createElement("p");
    rodape.className = "mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400";
    rodape.textContent = "Responsável: " + responsavel + " · Prazo: " + prazo;

    novoCartao.append(etiqueta, titulo, texto, areaProgresso, categoriaTexto, barraProgresso, rodape, rodape);
    buscar("lista-projetos").prepend(novoCartao);

    buscar("total-ativos").textContent = Number(buscar("total-ativos").textContent) + 1;
    filtroAtual = "todos";
    botoesFiltro.forEach(function (botao) {
      botao.classList.toggle("ativo", botao.dataset.filtro === "todos");
    });
    camposPesquisa.forEach(function (campo) { campo.value = ""; });
    filtrarProjetos();

    mensagemFormulario.textContent = "Projeto criado com sucesso!";
    mensagemFormulario.className = "mt-4 rounded bg-green-100 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-200";
    mostrarAviso("Projeto adicionado.");
    window.setTimeout(fecharModal, 700);
  });


  let temporizadorAviso;
  function mostrarAviso(texto) {
    const aviso = buscar("aviso");
    aviso.textContent = texto;
    aviso.classList.remove("hidden");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () {
      aviso.classList.add("hidden");
    }, 2200);
  }

  buscar("perfil").addEventListener("click", function () {
    menuUsuario.classList.add("hidden");
    mostrarAviso("Perfil de Luís");
  });

  buscar("sair").addEventListener("click", function () {
    menuUsuario.classList.add("hidden");
    mostrarAviso("SAIU!");
  });

  document.querySelectorAll(".opcoes-projeto").forEach(function (botao) {
    botao.addEventListener("click", function () {
      mostrarAviso("Opções de projeto — demonstração.");
    });
  });
});
