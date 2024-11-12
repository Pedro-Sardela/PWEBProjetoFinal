let idTarefa = 0;
let editTarefa = null;
const root = document.documentElement;

function abrirJanela() {
  document.getElementById("janelaModal").style.display = "flex";
}

function fecharJanela() {
  document.getElementById("janelaModal").style.display = "none";
  document.getElementById("formTarefa").reset();
  document.getElementById("btnSubmitAdicionar").textContent = "Adicionar tarefa";
  document.getElementById("tituloJanela").textContent = "Adicionar nova tarefa";
  editTarefa = null;
}

function addTarefa(event) {
  event.preventDefault();
  
  document.getElementById("btnSubmitAdicionar").textContent = "Adicionar tarefa";
  document.getElementById("tituloJanela").textContent = "Adicionar nova tarefa";

  const titulo = document.getElementById("titulo").value;
  const desc = document.getElementById("descricao").value;
  const respon = document.getElementById("responsaveis").value;
  const priori = document.getElementById("prioridade").value;
  console.log(document.getElementById("prioridade").value);
  const dtVenc = document.getElementById("dtVencimento").value;


  if (editTarefa) {

    editTarefa.querySelector("strong").textContent = titulo;
    editTarefa.querySelector("p:nth-of-type(1)").textContent = desc;
    editTarefa.querySelector("p:nth-of-type(2)").textContent = `Vence em: ${dtVenc}`;
    editTarefa.querySelector("p:nth-of-type(3)").textContent = `Responsáveis: ${respon}`;

    editTarefa.classList.remove("alta", "media", "baixa");
    editTarefa.classList.add(`${priori}`);
    editTarefa.querySelector("p#prioricss").textContent = `${priori}`;

    const prioridadeElemento = editTarefa.querySelector("p#prioricss");
    alterarCor(prioridadeElemento, priori);

    editTarefa = null;
    fecharJanela();
    salvarTarefas();
  } else {
    const tarefa = {
      id: `tarefa-${idTarefa++}`,
      titulo,
      desc,
      respon,
      priori,
      dtVenc,
      status: "fazer",
    };
    const elementoTarefa = criarElementoTarefa(tarefa);
    adicionarTarefa(elementoTarefa, "listaFazer");

    salvarTarefas();
    fecharJanela();

    const prioridadeElemento = elementoTarefa.querySelector("p#prioricss");
    alterarCor(prioridadeElemento, priori);
  }
}

function criarElementoTarefa(tarefa) {
  const elementoTarefa = document.createElement("div");
  elementoTarefa.className = `tarefa ${tarefa.priori}-prioridade`;
  elementoTarefa.id = tarefa.id;
  elementoTarefa.draggable = true;
  elementoTarefa.ondragstart = drag;

  elementoTarefa.innerHTML = `
    <div class="conteudoTarefa">
      <strong id="titulocss">${tarefa.titulo}</strong>
      <p id="desccss">${tarefa.desc}</p>
      <p id="dtcss">Vence em: ${tarefa.dtVenc}</p>
      <p id="responcss">Responsáveis: ${tarefa.respon}</p>
      <p id="prioricss">${tarefa.priori}</p>
      <button id="btnEditar" onclick="editarTarefa('${tarefa.id}', this.parentElement.parentElement)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
        </svg>
      </button>

      <button id="btnDeletar" onclick="deletarTarefa('${tarefa.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
      </button>
    </div>
  `;

  return elementoTarefa;
}

function adicionarTarefa(elementoTarefa, idLista) {
  document.getElementById(idLista).appendChild(elementoTarefa);
}

function editarTarefa(id) {
  document.getElementById("btnSubmitAdicionar").textContent = "Salvar";
  document.getElementById("tituloJanela").textContent = "Editar tarefa";

  const tarefa = document.getElementById(id);
  abrirJanela();

  document.getElementById("titulo").value = tarefa.querySelector("strong").textContent;
  document.getElementById("descricao").value = tarefa.querySelector("p:nth-of-type(1)").textContent;

  const responsavelTexto = tarefa.querySelector("p:nth-of-type(3)").textContent;
  const responsavel = responsavelTexto.replace("Responsáveis: ", "").trim();
  document.getElementById("responsaveis").value = responsavel;

  const prioridade = tarefa.classList.contains("alta")
    ? "alta"
    : tarefa.classList.contains("media")
      ? "media"
      : "baixa";
  document.getElementById("prioridade").value = prioridade;

  const dataVencimentoTexto = tarefa.querySelector("p:nth-of-type(2)").textContent;
  const dtVenc = dataVencimentoTexto.replace("Vence em: ", "").trim();
  document.getElementById("dtVencimento").value = dtVenc;
  editTarefa = tarefa;
  salvarTarefas();
}

function deletarTarefa(id) {
  const tarefa = document.getElementById(id);
  tarefa.remove();
  salvarTarefas();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event, idLista) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const tarefa = document.getElementById(data);
  const listaDestino = document.getElementById(idLista);
  atualizarStatusTarefa(tarefa, idLista);
  

  if (idLista === "listaConcluido") {
    adicionarIconeConcluido(tarefa);
  } else {
    removerIconeConcluido(tarefa);
  }

  listaDestino.appendChild(tarefa);
  salvarTarefas();
}

function atualizarStatusTarefa(tarefa, idLista) {
  if (idLista === "listaFazer") {
    tarefa.status = "fazer";
  } else if (idLista === "listaAndamento") {
    tarefa.status = "andamento";
  } else if (idLista === "listaConcluido") {
    tarefa.status = "concluido";
  }
}

function alterarCor(elemento, prioridade) {
  if (!elemento) return;

  switch (prioridade) {
    case "alta":
      elemento.style.backgroundColor = "#F37A7A";
      break;
    case "media":
      elemento.style.backgroundColor = "#FFC832";
      break;
    case "baixa":
      elemento.style.backgroundColor = "#A1F69C";
      break;
    default:
      elemento.style.backgroundColor = "";
  }
}

function verificarVencimento() {
  const tarefas = document.querySelectorAll('.tarefa');

  tarefas.forEach((tarefa) => {
    const elementoData = tarefa.querySelector("#dtcss");
    const dataVencimento = elementoData.textContent.replace("Vence em: ", "").trim();
    const dataAtual = new Date();
    const dataLimite = new Date(dataVencimento);

    if (dataLimite < dataAtual) {
      const diffTemp = Math.abs(dataAtual - dataLimite);
      const diffDias = Math.ceil(diffTemp / (1000 * 60 * 60 * 24));
      
      elementoData.style.color = "#FF0000";
      elementoData.style.fontWeight = "bold";
      
      mostrarNotificacao(`A tarefa "${tarefa.querySelector('#titulocss').textContent}" está atrasada há ${diffDias} dias!`, 6000);
    } else {
      elementoData.style.color = ""; 
      elementoData.style.fontWeight = "";
    }
  });
}

window.onload = verificarVencimento;


function mostrarNotificacao(mensagem, duracao = 3000) {
  const container = document.getElementById("containerNotificacoes");

  const notificacao = document.createElement("div");
  notificacao.className = "notificacao";
  notificacao.innerHTML = `
    <p>${mensagem}</p>
    <span onclick="fecharNotificacao(this.parentElement)">&times</span>
  `;

  container.appendChild(notificacao);

  setTimeout(() => {
    fecharNotificacao(notificacao);
  }, duracao);
}

function fecharNotificacao(notificacao) {
  notificacao.style.opacity = "0";
  setTimeout(() => {
    notificacao.remove(); 
  }, 300);
}

function adicionarIconeConcluido(tarefa) {
  const iconeConcluido = document.createElement("span");
  iconeConcluido.classList.add("iconeConcluido");
  iconeConcluido.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
</svg>`;
  
  const tituloElemento = tarefa.querySelector("#titulocss");
  tituloElemento.appendChild(iconeConcluido);
}

function removerIconeConcluido(tarefa) {
  const iconeConcluido = tarefa.querySelector(".iconeConcluido");
  if (iconeConcluido) {
    iconeConcluido.remove();
  }
}


function carregarTarefas() {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefasSalvas.forEach((tarefa) => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    adicionarTarefa(elementoTarefa, `lista${pLetraMaiusc(tarefa.status)}`);
    
    const prioricssElement = elementoTarefa.querySelector("#prioricss");
    aplicarCoresPrioridade(prioricssElement, tarefa.priori);
  });

  idTarefa = tarefasSalvas.length ? Math.max(...tarefasSalvas.map(t => parseInt(t.id.split('-')[1]))) + 1 : 0;
}
function pLetraMaiusc(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function salvarTarefas() {
  const tarefas = Array.from(document.querySelectorAll(".tarefa")).map((tarefa) => {
    return {
      id: tarefa.id,
      titulo: tarefa.querySelector("#titulocss").textContent,
      desc: tarefa.querySelector("#desccss").textContent,
      respon: tarefa.querySelector("#responcss").textContent.replace("Responsáveis: ", "").trim(),
      priori: tarefa.classList.contains("alta") ? "alta" :
              tarefa.classList.contains("media") ? "media" :
              tarefa.classList.contains("baixa") ? "baixa" : "baixa",
      dtVenc: tarefa.querySelector("#dtcss").textContent.replace("Vence em: ", "").trim(),
      status: tarefa.parentElement.id.replace("lista", "").toLowerCase()
    };
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}


function aplicarCoresPrioridade() {
  const tarefas = document.querySelectorAll(".tarefa");

  tarefas.forEach((tarefa) => {
    const prioridadeElemento = tarefa.querySelector("#prioricss");
    const prioridade = prioridadeElemento.textContent.trim();
    
    alterarCor(prioridadeElemento, prioridade);
  });
}


document.addEventListener("DOMContentLoaded", carregarTarefas);