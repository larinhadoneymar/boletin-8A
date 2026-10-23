const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 18,
  apiUrl: "https://boletim-api.profbt.com.br"
};

let boletimDados = [
  { disciplina: "Língua Portuguesa", tri1: 83.0, tri2: 87.0, tri3: null, faltas: [4, 4, 0] },
  { disciplina: "Matemática", tri1: 80.0, tri2: 74.0, tri3: null, faltas: [8, 7, 0] },
  { disciplina: "Ciências", tri1: 88.0, tri2: 92.0, tri3: null, faltas: [2, 5, 0] },
  { disciplina: "História", tri1: 100.0, tri2: 97.0, tri3: null, faltas: [2, 5, 0] },
  { disciplina: "Geografia", tri1: 70.0, tri2: 70.0, tri3: null, faltas: [0, 4, 0] },
  { disciplina: "Língua Inglesa", tri1: 78.0, tri2: 86.0, tri3: null, faltas: [1, 3, 0] },
  { disciplina: "Arte", tri1: 77.0, tri2: 76.0, tri3: null, faltas: [3, 2, 0] },
  { disciplina: "Educação Física", tri1: 93.0, tri2: 86.0, tri3: null, faltas: [0, 4, 0] },
  { disciplina: "Educação Digital", tri1: 90.0, tri2: 70.0, tri3: null, faltas: [2, 4, 0] },
  { disciplina: "Educação Financeira", tri1: 73.0, tri2: 77.0, tri3: null, faltas: [2, 2, 0] },
  { disciplina: "Estudo Orientado", tri1: 80.0, tri2: 86.0, tri3: null, faltas: [0, 4, 0] },
  { disciplina: "Redação e Leitura", tri1: 86.0, tri2: 75.0, tri3: null, faltas: [1, 4, 0] },
  { disciplina: "Pensamento Lógico", tri1: 75.0, tri2: 91.0, tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: 79.0, tri2: 64.0, tri3: null, faltas: [1, 0, 0] },
  { disciplina: "Práticas Experimentais", tri1: 81.0, tri2: 86.0, tri3: null, faltas: [3, 4, 0] }
];

let pinSessao = "";

// FUNÇÃO: Transforma qualquer formato de nota na escala oficial de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  let numero = Number(valor);

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  } else if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

// Formata a nota para exibir na tela (ex: 8.5 vira "8,5" ou "—")
function formatarExibicaoNota(nota) {
  if (nota === null || nota === undefined) return "—";
  return nota.toFixed(1).replace(".", ",");
}

// Função principal que atualiza a tela (DOM)
function carregarBoletim() {
  const tabela = document.getElementById("tabela-boletim");
  if (!tabela) return;
  tabela.innerHTML = "";

  let somaMediasGerais = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  boletimDados.forEach(item => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const notasValidas = [n1, n2, n3].filter(n => n !== null);

    let media = null;
    let situacaoTexto = "Nota ainda não disponível";
    let situacaoClasse = "situacao-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      media = soma / notasValidas.length;
      somaMediasGerais += media;
      qtdDisciplinasComMedia++;

      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        situacaoClasse = "situacao-bom";
        qtdBomDesempenho++;
      } else {
        situacaoTexto = "Atenção";
        situacaoClasse = "situacao-atencao";
        qtdAtencao++;
      }
    }

    const arrayFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasDisc = arrayFaltas.reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    totalFaltasGeral += totalFaltasDisc;

    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    const strongDisc = document.createElement("strong");
    strongDisc.textContent = item.disciplina;
    tdDisc.appendChild(strongDisc);

    const td1 = document.createElement("td");
    td1.textContent = formatarExibicaoNota(n1);

    const td2 = document.createElement("td");
    td2.textContent = formatarExibicaoNota(n2);

    const td3 = document.createElement("td");
    td3.textContent = formatarExibicaoNota(n3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = formatarExibicaoNota(media);
    tdMedia.appendChild(strongMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = String(totalFaltasDisc);

    const tdSit = document.createElement("td");
    const spanSit = document.createElement("span");
    spanSit.className = `situacao ${situacaoClasse}`;
    spanSit.textContent = situacaoTexto;
    tdSit.appendChild(spanSit);

    tr.appendChild(tdDisc);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(tdMedia);
    tr.appendChild(tdFaltas);
    tr.appendChild(tdSit);

    tabela.appendChild(tr);
  });

  const mediaGeralFinal = qtdDisciplinasComMedia > 0 
    ? (somaMediasGerais / qtdDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  const cardMedia = document.getElementById("card-media");
  if (cardMedia) cardMedia.textContent = mediaGeralFinal;

  const cardFaltas = document.getElementById("card-faltas");
  if (cardFaltas) cardFaltas.textContent = String(totalFaltasGeral);

  const cardBom = document.getElementById("card-bom-desempenho");
  if (cardBom) cardBom.textContent = String(qtdBomDesempenho);

  const cardAtencao = document.getElementById("card-atencao");
  if (cardAtencao) cardAtencao.textContent = String(qtdAtencao);
}

// LOGIN E CONEXÃO COM API
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const msgLogin = document.getElementById("mensagem-login");
  const campoPin = document.getElementById("campo-pin");
  const secaoLogin = document.getElementById("secao-login");
  const secaoBoletim = document.getElementById("secao-boletim");

  const btnAlterarDados = document.getElementById("btn-alterar-dados");
  const secaoEdicao = document.getElementById("secao-edicao");
  const formEdicao = document.getElementById("form-edicao");
  const btnCancelarEdicao = document.getElementById("btn-cancelar-edicao");
  const msgEdicao = document.getElementById("mensagem-edicao");

  function exibirMensagem(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = `mensagem-status ${tipo}`;
  }

  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pinDigitado = campoPin.value.trim();
      if (!pinDigitado) return;

      exibirMensagem(msgLogin, "Conectando...", "info");

      try {
        const response = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            turma: CONFIG_ALUNO.turma,
            numero_chamada: CONFIG_ALUNO.numeroChamada,
            pin: pinDigitado
          })
        });

        if (response.status === 401) {
          exibirMensagem(msgLogin, "Turma, chamada ou PIN inválidos.", "erro");
          return;
        }

        if (response.status === 429) {
          exibirMensagem(msgLogin, "Muitas tentativas. Aguarde um minuto e tente novamente.", "erro");
          return;
        }

        if (!response.ok) {
          exibirMensagem(msgLogin, "Não foi possível conectar ao servidor. Tente novamente.", "erro");
          return;
        }

        const data = await response.json();
        pinSessao = pinDigitado;
        campoPin.value = "";

        if (data && data.dados && Array.isArray(data.dados.disciplinas) && data.dados.disciplinas.length > 0) {
          boletimDados = data.dados.disciplinas;
        }

        secaoLogin.classList.add("escondido");
        secaoBoletim.classList.remove("escondido");
        carregarBoletim();
      } catch (err) {
        exibirMensagem(msgLogin, "Não foi possível conectar ao servidor. Tente novamente.", "erro");
      }
    });
  }

  if (btnAlterarDados) {
    btnAlterarDados.addEventListener("click", () => {
      preencherFormularioEdicao();
      secaoEdicao.classList.remove("escondido");
      msgEdicao.className = "mensagem-status";
      msgEdicao.textContent = "";
    });
  }

  if (btnCancelarEdicao) {
    btnCancelarEdicao.addEventListener("click", () => {
      secaoEdicao.classList.add("escondido");
    });
  }

  function preencherFormularioEdicao() {
    const tbody = document.getElementById("tabela-edicao-corpo");
    if (!tbody) return;
    tbody.innerHTML = "";

    boletimDados.forEach((item, index) => {
      const n1 = normalizarNota(item.tri1);
      const n2 = normalizarNota(item.tri2);
      const n3 = normalizarNota(item.tri3);

      const f = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];

      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      const strongName = document.createElement("strong");
      strongName.textContent = item.disciplina;
      tdName.appendChild(strongName);

      tr.appendChild(tdName);

      const criadoInputNota = (val, fieldName) => {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.dataset.index = index;
        input.dataset.field = fieldName;
        input.value = val !== null && val !== undefined ? String(val).replace(".", ",") : "";
        td.appendChild(input);
        return td;
      };

      const criadoInputFalta = (val, faltaIndex) => {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.dataset.index = index;
        input.dataset.faltaIndex = faltaIndex;
        input.value = val !== undefined && val !== null ? String(val) : "0";
        td.appendChild(input);
        return td;
      };

      tr.appendChild(criadoInputNota(n1, "tri1"));
      tr.appendChild(criadoInputNota(n2, "tri2"));
      tr.appendChild(criadoInputNota(n3, "tri3"));

      tr.appendChild(criadoInputFalta(f[0], 0));
      tr.appendChild(criadoInputFalta(f[1], 1));
      tr.appendChild(criadoInputFalta(f[2], 2));

      tbody.appendChild(tr);
    });
  }

  function validarNotaDigitada(str) {
    if (!str || str.trim() === "") {
      return { valido: true, valor: null };
    }
    const limpo = str.trim().replace(",", ".");
    const num = Number(limpo);
    if (isNaN(num) || num < 0 || num > 10) {
      return { valido: false, valor: null };
    }
    return { valido: true, valor: num };
  }

  function validarFaltaDigitada(str) {
    if (str === null || str === undefined || str.trim() === "") {
      return { valido: false, valor: null };
    }
    const limpo = str.trim();
    if (!/^\d+$/.test(limpo)) {
      return { valido: false, valor: null };
    }
    const num = parseInt(limpo, 10);
    if (isNaN(num) || num < 0) {
      return { valido: false, valor: null };
    }
    return { valido: true, valor: num };
  }

  if (formEdicao) {
    formEdicao.addEventListener("submit", async (e) => {
      e.preventDefault();

      const tbody = document.getElementById("tabela-edicao-corpo");
      const inputs = tbody.querySelectorAll("input");

      inputs.forEach(inp => inp.classList.remove("campo-invalido"));

      let temErro = false;
      const copiaNovosDados = JSON.parse(JSON.stringify(boletimDados));

      inputs.forEach(input => {
        const idx = parseInt(input.dataset.index, 10);
        const valStr = input.value;

        if (input.dataset.field) {
          const field = input.dataset.field;
          const res = validarNotaDigitada(valStr);
          if (!res.valido) {
            input.classList.add("campo-invalido");
            temErro = true;
          } else {
            copiaNovosDados[idx][field] = res.valor;
          }
        } else if (input.dataset.faltaIndex !== undefined) {
          const fIdx = parseInt(input.dataset.faltaIndex, 10);
          const res = validarFaltaDigitada(valStr);
          if (!res.valido) {
            input.classList.add("campo-invalido");
            temErro = true;
          } else {
            if (!Array.isArray(copiaNovosDados[idx].faltas)) {
              copiaNovosDados[idx].faltas = [0, 0, 0];
            }
            copiaNovosDados[idx].faltas[fIdx] = res.valor;
          }
        }
      });

      if (temErro) {
        exibirMensagem(msgEdicao, "Por favor, corrija os campos destacados com valores inválidos.", "erro");
        return;
      }

      exibirMensagem(msgEdicao, "Salvando...", "info");

      try {
        const response = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            turma: CONFIG_ALUNO.turma,
            numero_chamada: CONFIG_ALUNO.numeroChamada,
            pin: pinSessao,
            dados: {
              disciplinas: copiaNovosDados
            }
          })
        });

        if (!response.ok) {
          exibirMensagem(msgEdicao, "Não foi possível salvar as alterações. Tente novamente.", "erro");
          return;
        }

        boletimDados = copiaNovosDados;
        carregarBoletim();
        exibirMensagem(msgEdicao, "Dados salvos com sucesso.", "sucesso");
        setTimeout(() => {
          secaoEdicao.classList.add("escondido");
        }, 1200);
      } catch (err) {
        exibirMensagem(msgEdicao, "Não foi possível salvar as alterações. Tente novamente.", "erro");
      }
    });
  }
});