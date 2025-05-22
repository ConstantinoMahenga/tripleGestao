document.addEventListener('DOMContentLoaded', () => {
    const selectPeriodo = document.getElementById('select-periodo');
    const boletimContainer = document.getElementById('boletim-container');
    const mediaGeralPeriodoEl = document.getElementById('media-geral-periodo');
    const disciplinasAbaixoMediaEl = document.getElementById('disciplinas-abaixo-media');
    const statusGeralPeriodoEl = document.getElementById('status-geral-periodo');
    const resumoCardTitleEl = document.querySelector('.summary-card h3');

    const MEDIA_APROVACAO = 10.0;

    const todasAsNotas = {
        "1bim": [
            { disciplina: "Matemática", n1: 15.5, n2: 18.0, n3: 16.5, faltas: 2 },
            { disciplina: "Português", n1: 19.0, n2: 18.5, n3: 19.5, faltas: 1 },
            { disciplina: "História", n1: 12.0, n2: 14.0, n3: 11.5, faltas: 3 },
            { disciplina: "Ciências", n1: 18.0, n2: 18.5, n3: 17.5, faltas: 0 },
            { disciplina: "Geografia", n1: 17.0, n2: 16.5, n3: 17.5, faltas: 2 },
        ],
        "2bim": [
            { disciplina: "Matemática", n1: 12.0, n2: 11.5, n3: 13.0, faltas: 4 },
            { disciplina: "Português", n1: 18.0, n2: 17.5, n3: 18.5, faltas: 0 },
            { disciplina: "História", n1: 15.5, n2: 16.0, n3: 15.0, faltas: 1 },
            { disciplina: "Ciências", n1: 19.0, n2: 19.5, n3: 18.0, faltas: 0 },
            { disciplina: "Geografia", n1: 11.5, n2: 12.0, n3: 12.5, faltas: 3 },
        ],
        "3bim": [],
        "4bim": []
    };

    function calcularMediaDisciplina(notas) {
        const notasValidas = [notas.n1, notas.n2, notas.n3].filter(n => typeof n === 'number');
        if (notasValidas.length === 0) return 0;
        const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
        return parseFloat((soma / notasValidas.length).toFixed(1));
    }

    function getClassForNota(nota) {
        if (typeof nota !== 'number') return '';
        if (nota >= MEDIA_APROVACAO) return 'nota-alta';
        if (nota >= MEDIA_APROVACAO - 5 && nota < MEDIA_APROVACAO) return 'nota-recuperacao';
        return 'nota-baixa';
    }

    function renderizarBoletim(periodo) {
        boletimContainer.innerHTML = '';
        const notasDoPeriodo = todasAsNotas[periodo] || [];

        if (notasDoPeriodo.length === 0) {
            boletimContainer.innerHTML = `
                <div class="no-data-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    Nenhuma nota lançada para este período ainda.
                </div>`;
            atualizarResumo([], periodo);
            return;
        }

        const table = document.createElement('table');
        table.className = 'boletim-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Disciplina</th>
                    <th>N1</th>
                    <th>N2</th>
                    <th>N3</th>
                    <th>Faltas</th>
                    <th>Média</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        notasDoPeriodo.forEach(item => {
            const media = calcularMediaDisciplina(item);
            const tr = document.createElement('tr');
            tr.className = 'disciplina-row';
            tr.innerHTML = `
                <td data-label="Disciplina">${item.disciplina}</td>
                <td data-label="N1"><span class="nota ${getClassForNota(item.n1)}">${item.n1 !== undefined ? item.n1.toFixed(1) : '-'}</span></td>
                <td data-label="N2"><span class="nota ${getClassForNota(item.n2)}">${item.n2 !== undefined ? item.n2.toFixed(1) : '-'}</span></td>
                <td data-label="N3"><span class="nota ${getClassForNota(item.n3)}">${item.n3 !== undefined ? item.n3.toFixed(1) : '-'}</span></td>
                <td data-label="Faltas">${item.faltas !== undefined ? item.faltas : '-'}</td>
                <td data-label="Média"><span class="nota ${getClassForNota(media)}">${media.toFixed(1)}</span></td>
            `;
            tbody.appendChild(tr);
        });

        boletimContainer.appendChild(table);
        atualizarResumo(notasDoPeriodo, periodo);
    }

    function atualizarResumo(notasDoPeriodo, periodoSelecionado) {
        const periodoNome = selectPeriodo.options[selectPeriodo.selectedIndex].text;
        if (resumoCardTitleEl) {
             resumoCardTitleEl.textContent = `Resumo Geral (${periodoNome})`;
        }

        if (notasDoPeriodo.length === 0) {
            mediaGeralPeriodoEl.textContent = '-';
            disciplinasAbaixoMediaEl.textContent = 'N/A';
            statusGeralPeriodoEl.textContent = 'N/A';
            statusGeralPeriodoEl.className = '';
            return;
        }

        const mediasDisciplinas = notasDoPeriodo.map(item => calcularMediaDisciplina(item));
        const somaMedias = mediasDisciplinas.reduce((acc, curr) => acc + curr, 0);
        const mediaGeral = parseFloat((somaMedias / mediasDisciplinas.length).toFixed(1)) || 0;

        const disciplinasAbaixo = notasDoPeriodo.filter(item => calcularMediaDisciplina(item) < MEDIA_APROVACAO);

        mediaGeralPeriodoEl.textContent = mediaGeral.toFixed(1);
        disciplinasAbaixoMediaEl.textContent = disciplinasAbaixo.length > 0 ? disciplinasAbaixo.map(d => d.disciplina).join(', ') : "Nenhuma";

        let statusGeral = "Aprovado (Parcial)";
        let statusClass = "status-aprovado";

        if (mediaGeral < MEDIA_APROVACAO) {
            if (mediaGeral >= MEDIA_APROVACAO - 2) {
                statusGeral = "Em Recuperação (Parcial)";
                statusClass = "status-recuperacao";
            } else {
                statusGeral = "Reprovado (Parcial)";
                statusClass = "status-reprovado";
            }
        }

        if (disciplinasAbaixo.some(d => calcularMediaDisciplina(d) < MEDIA_APROVACAO - 2)) {
            statusGeral = "Atenção: Recuperação (Parcial)";
            statusClass = "status-recuperacao";
        }

        statusGeralPeriodoEl.textContent = statusGeral;
        statusGeralPeriodoEl.className = statusClass;
    }

    if (selectPeriodo) {
        selectPeriodo.addEventListener('change', (event) => {
            if (event.target.value === "todos") {
                boletimContainer.innerHTML = `
                <div class="no-data-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    A visualização de todos os períodos consolidados ainda não está implementada.
                </div>`;
                atualizarResumo([], "todos");
            } else {
                renderizarBoletim(event.target.value);
            }
        });
        renderizarBoletim(selectPeriodo.value);
    } else {
        renderizarBoletim("1bim");
    }
});