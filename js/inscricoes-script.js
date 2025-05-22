document.addEventListener('DOMContentLoaded', () => {
    const selectTrimestre = document.getElementById('select-trimestre-inscricao');
    const listaDisciplinasInscritasEl = document.getElementById('lista-disciplinas-inscritas');
    const statusInscricaoCardTitleEl = document.querySelector('#status-inscricao-atual h4');
    const listaDisciplinasParaInscricaoEl = document.getElementById('lista-disciplinas-para-inscricao');
    const tituloDisciplinasDisponiveisEl = document.getElementById('titulo-disciplinas-disponiveis');
    const formInscricao = document.getElementById('form-inscricao-disciplinas');
    const btnConfirmarInscricao = document.getElementById('btnConfirmarInscricao');
    const avisoLimiteCreditosEl = document.getElementById('aviso-limite-creditos');

    const MAX_CREDITOS_ELETIVAS = 12;

    const disciplinasPorTrimestre = {
        "1tri": [
            { id: "MAT101", nome: "Matemática I", tipo: "obrigatoria", creditos: 6, professor: "Prof. Newton" },
            { id: "POR101", nome: "Português Instrumental", tipo: "obrigatoria", creditos: 4, professor: "Profa. Camões" },
            { id: "FIS101", nome: "Física Mecânica", tipo: "obrigatoria", creditos: 5, professor: "Prof. Einstein" },
            { id: "ELEFIL", nome: "Introdução à Filosofia", tipo: "eletiva", creditos: 3, professor: "Prof. Sócrates" },
            { id: "ELEART", nome: "História da Arte Universal", tipo: "eletiva", creditos: 3, professor: "Profa. DaVinci" },
            { id: "ELEMUS", nome: "Apreciação Musical", tipo: "eletiva", creditos: 2, professor: "Prof. Mozart" },
            { id: "ELEECO", nome: "Economia Básica", tipo: "eletiva", creditos: 4, professor: "Prof. Smith" },
        ],
        "2tri": [
            { id: "MAT102", nome: "Matemática II", tipo: "obrigatoria", creditos: 6, professor: "Prof. Newton" },
            { id: "POR102", nome: "Literatura Lusófona", tipo: "obrigatoria", creditos: 4, professor: "Profa. Camões" },
            { id: "FIS102", nome: "Física Termodinâmica", tipo: "obrigatoria", creditos: 5, professor: "Prof. Einstein" },
            { id: "ELEDES", nome: "Desenho Geométrico", tipo: "eletiva", creditos: 3, professor: "Prof. Euclides" },
            { id: "ELEPSI", nome: "Psicologia Geral", tipo: "eletiva", creditos: 3, professor: "Prof. Freud" },
            { id: "ELEQUI", nome: "Química Orgânica Básica", tipo: "eletiva", creditos: 4, professor: "Profa. Curie" },
        ],
        "3tri": [
            { id: "MAT103", nome: "Matemática III", tipo: "obrigatoria", creditos: 6, professor: "Prof. Newton" },
            { id: "POR103", nome: "Redação Técnica", tipo: "obrigatoria", creditos: 4, professor: "Profa. Camões" },
            { id: "FIS103", nome: "Física Óptica e Ondas", tipo: "obrigatoria", creditos: 5, professor: "Prof. Einstein" },
            { id: "ELEPRO", nome: "Introdução à Programação", tipo: "eletiva", creditos: 4, professor: "Prof. Turing" },
            { id: "ELECS", nome: "Ciências Sociais Aplicadas", tipo: "eletiva", creditos: 3, professor: "Prof. Weber" },
        ]
    };

    let inscricoesRealizadas = {
        "1tri": ["MAT101", "POR101", "FIS101", "ELEFIL"],
        "2tri": [],
        "3tri": []
    };

    function atualizarStatusInscricao(trimestre) {
        const nomeTrimestre = selectTrimestre.options[selectTrimestre.selectedIndex].text;
        statusInscricaoCardTitleEl.textContent = `Suas Disciplinas Inscritas (${nomeTrimestre}):`;
        listaDisciplinasInscritasEl.innerHTML = '';

        const disciplinasAtuais = inscricoesRealizadas[trimestre];
        if (disciplinasAtuais && disciplinasAtuais.length > 0) {
            disciplinasAtuais.forEach(idDisciplina => {
                let disciplinaEncontrada = null;
                for (const key in disciplinasPorTrimestre) {
                    const disc = disciplinasPorTrimestre[key].find(d => d.id === idDisciplina);
                    if (disc) {
                        disciplinaEncontrada = disc;
                        break;
                    }
                }
                if (disciplinaEncontrada) {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="cod-disciplina">[${disciplinaEncontrada.id}]</span> ${disciplinaEncontrada.nome}`;
                    listaDisciplinasInscritasEl.appendChild(li);
                }
            });
        } else {
            listaDisciplinasInscritasEl.innerHTML = '<li>Nenhuma disciplina inscrita para este trimestre.</li>';
        }
    }

    function calcularCreditosSelecionados() {
        let creditosAtuais = 0;
        document.querySelectorAll('#lista-disciplinas-para-inscricao input[type="checkbox"]:checked').forEach(checkbox => {
            if (!checkbox.disabled || (checkbox.disabled && checkbox.dataset.tipo === "obrigatoria")) {
                 const disciplina = disciplinasPorTrimestre[selectTrimestre.value].find(d => d.id === checkbox.value);
                 if (disciplina && disciplina.tipo === "eletiva") {
                    creditosAtuais += disciplina.creditos;
                 }
            }
        });
        return creditosAtuais;
    }

    function atualizarAvisoCreditos() {
        const creditosSelecionados = calcularCreditosSelecionados();
        avisoLimiteCreditosEl.textContent = `Créditos de eletivas selecionados: ${creditosSelecionados} / ${MAX_CREDITOS_ELETIVAS}`;
        if (creditosSelecionados > MAX_CREDITOS_ELETIVAS) {
            avisoLimiteCreditosEl.style.color = "#ef4444";
            btnConfirmarInscricao.disabled = true;
        } else {
            avisoLimiteCreditosEl.style.color = "#f59e0b";
            btnConfirmarInscricao.disabled = false;
        }
        avisoLimiteCreditosEl.style.display = 'block';
    }


    function renderizarDisciplinasParaInscricao(trimestre) {
        const nomeTrimestre = selectTrimestre.options[selectTrimestre.selectedIndex].text;
        tituloDisciplinasDisponiveisEl.textContent = `Disciplinas Disponíveis para Inscrição (${nomeTrimestre})`;
        listaDisciplinasParaInscricaoEl.innerHTML = '';

        const disponiveis = disciplinasPorTrimestre[trimestre];
        const jaInscritas = inscricoesRealizadas[trimestre] || [];

        if (!disponiveis || disponiveis.length === 0) {
            listaDisciplinasParaInscricaoEl.innerHTML = '<p class="no-data-message">Nenhuma disciplina disponível para inscrição neste trimestre.</p>';
            avisoLimiteCreditosEl.style.display = 'none';
            btnConfirmarInscricao.disabled = true;
            return;
        }
        btnConfirmarInscricao.disabled = false;


        disponiveis.forEach(disc => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'disciplina-item-inscricao';
            if (disc.tipo === 'obrigatoria') {
                itemDiv.classList.add('obrigatoria');
            }

            const isChecked = jaInscritas.includes(disc.id) || (disc.tipo === 'obrigatoria');
            const isDisabled = disc.tipo === 'obrigatoria';

            if (isChecked) {
                itemDiv.classList.add('selecionada');
            }

            itemDiv.innerHTML = `
                <div class="disciplina-item-info">
                    <div class="nome-disciplina">${disc.nome} ${disc.tipo === 'obrigatoria' ? '(Obrigatória)' : ''}</div>
                    <div class="detalhes-disciplina">
                        <span class="cod">[${disc.id}]</span>
                        <span class="prof">Prof: ${disc.professor}</span>
                        <span class="creditos">Créditos: ${disc.creditos}</span>
                    </div>
                </div>
                <label class="checkbox-wrapper">
                    <input type="checkbox" name="disciplinas[]" value="${disc.id}" 
                           data-creditos="${disc.creditos}" data-tipo="${disc.tipo}"
                           ${isChecked ? 'checked' : ''} 
                           ${isDisabled ? 'disabled' : ''}>
                    <span class="custom-checkbox"></span>
                </label>
            `;
            listaDisciplinasParaInscricaoEl.appendChild(itemDiv);

            const checkbox = itemDiv.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    itemDiv.classList.add('selecionada');
                } else {
                    itemDiv.classList.remove('selecionada');
                }
                atualizarAvisoCreditos();
            });
        });
        atualizarAvisoCreditos();
    }

    formInscricao.addEventListener('submit', (event) => {
        event.preventDefault();
        const selecionadas = [];
        document.querySelectorAll('#lista-disciplinas-para-inscricao input[type="checkbox"]:checked').forEach(checkbox => {
            selecionadas.push(checkbox.value);
        });

        const creditosEletivasSelecionados = calcularCreditosSelecionados();
        if (creditosEletivasSelecionados > MAX_CREDITOS_ELETIVAS) {
            alert(`Você excedeu o limite de ${MAX_CREDITOS_ELETIVAS} créditos para disciplinas eletivas. Selecionados: ${creditosEletivasSelecionados}.`);
            return;
        }

        const trimestreAtual = selectTrimestre.value;
        inscricoesRealizadas[trimestreAtual] = selecionadas;

        alert('Inscrição confirmada com sucesso para o ' + selectTrimestre.options[selectTrimestre.selectedIndex].text + '! (Simulado)');

        atualizarStatusInscricao(trimestreAtual);
    });

    selectTrimestre.addEventListener('change', (event) => {
        const trimestreSelecionado = event.target.value;
        atualizarStatusInscricao(trimestreSelecionado);
        renderizarDisciplinasParaInscricao(trimestreSelecionado);
    });

    atualizarStatusInscricao(selectTrimestre.value);
    renderizarDisciplinasParaInscricao(selectTrimestre.value);
});