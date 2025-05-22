document.addEventListener('DOMContentLoaded', () => {
    const selectTrimestreFaltas = document.getElementById('select-trimestre-faltas');
    const faltasListContainer = document.getElementById('faltas-list-container');
    const totalFaltasTrimestreEl = document.getElementById('total-faltas-trimestre');
    const limiteFaltasDisciplinaEl = document.getElementById('limite-faltas-disciplina'); // Pode ser fixo ou dinâmico
    const observacaoFaltasEl = document.getElementById('observacao-faltas');
    const faltasSummaryTitleEl = document.getElementById('faltas-summary-title');

    const LIMITE_FALTAS_DISCIPLINA_ANUAL = parseInt(limiteFaltasDisciplinaEl.textContent) || 20; // Pega do HTML ou usa 20
    const LIMITE_ATENCAO_PERCENTUAL = 0.5; // 50% do limite anual
    const LIMITE_PERIGO_PERCENTUAL = 0.75; // 75% do limite anual

    // Dados simulados de faltas (número de faltas por disciplina por trimestre)
    const todasAsFaltas = {
        "1tri": [
            { disciplina: "Matemática", faltas: 2, aulasPrevistas: 30 },
            { disciplina: "Português", faltas: 1, aulasPrevistas: 30 },
            { disciplina: "História", faltas: 5, aulasPrevistas: 25 }, // Atenção
            { disciplina: "Física", faltas: 0, aulasPrevistas: 28 },
            { disciplina: "Química", faltas: 3, aulasPrevistas: 28 },
        ],
        "2tri": [
            { disciplina: "Matemática", faltas: 4, aulasPrevistas: 30 },
            { disciplina: "Português", faltas: 0, aulasPrevistas: 30 },
            { disciplina: "História", faltas: 8, aulasPrevistas: 25 }, // Perigo
            { disciplina: "Física", faltas: 1, aulasPrevistas: 28 },
            { disciplina: "Química", faltas: 16, aulasPrevistas: 28 }, // Limite
        ],
        "3tri": [], // Sem faltas lançadas ainda
    };

    function getFaltasStatusClass(faltas, limiteAnual) {
        if (faltas >= limiteAnual) return 'faltas-limite';
        if (faltas >= limiteAnual * LIMITE_PERIGO_PERCENTUAL) return 'faltas-limite'; // Pode ser a mesma classe de limite
        if (faltas >= limiteAnual * LIMITE_ATENCAO_PERCENTUAL) return 'faltas-atencao';
        return 'faltas-ok';
    }

    function renderizarFaltas(trimestre) {
        faltasListContainer.innerHTML = '';
        let faltasDoTrimestre = [];
        let totalFaltasNoPeriodo = 0;

        const trimestreSelecionadoNome = selectTrimestreFaltas.options[selectTrimestreFaltas.selectedIndex].text;
        faltasSummaryTitleEl.textContent = `Resumo de Faltas (${trimestreSelecionadoNome})`;

        if (trimestre === "anual") {
            // Consolidar faltas de todos os trimestres
            const consolidadoAnual = {};
            Object.values(todasAsFaltas).forEach(trim => {
                trim.forEach(disc => {
                    if (!consolidadoAnual[disc.disciplina]) {
                        consolidadoAnual[disc.disciplina] = { disciplina: disc.disciplina, faltas: 0, aulasPrevistas: 0 };
                    }
                    consolidadoAnual[disc.disciplina].faltas += disc.faltas;
                    consolidadoAnual[disc.disciplina].aulasPrevistas += disc.aulasPrevistas; // Soma aulas para % presença anual
                });
            });
            faltasDoTrimestre = Object.values(consolidadoAnual);
            faltasSummaryTitleEl.textContent = `Resumo de Faltas (Anual)`;
        } else {
            faltasDoTrimestre = todasAsFaltas[trimestre] || [];
        }


        if (faltasDoTrimestre.length === 0 && trimestre !== "anual") { // Não mostrar "sem dados" para anual se outros trimestres tem dados
             if (!Object.values(todasAsFaltas).flat().length && trimestre === "anual") { // Só se não houver NENHUMA falta em nenhum trimestre
                faltasListContainer.innerHTML = `<div class="no-data-message">Nenhuma falta registrada.</div>`;
             } else if (trimestre !== "anual") {
                faltasListContainer.innerHTML = `<div class="no-data-message">Nenhuma falta registrada para este trimestre.</div>`;
             }
        }

        faltasDoTrimestre.forEach(item => {
            totalFaltasNoPeriodo += item.faltas;
            const statusClass = getFaltasStatusClass(item.faltas, LIMITE_FALTAS_DISCIPLINA_ANUAL);

            const card = document.createElement('div');
            card.className = 'disciplina-faltas-card';
            card.innerHTML = `
                <div class="disciplina-info">
                    <h4>${item.disciplina}</h4>
                    ${trimestre === 'anual' ? `<p>Total de aulas no ano: ${item.aulasPrevistas}</p>` : `<p>Aulas previstas no trimestre: ${item.aulasPrevistas}</p>`}
                </div>
                <div class="faltas-count ${statusClass}">
                    ${item.faltas}
                </div>
            `;
            faltasListContainer.appendChild(card);
        });

        totalFaltasTrimestreEl.textContent = totalFaltasNoPeriodo;
        // Observação pode ser mais dinâmica baseada no total de faltas ou em alguma disciplina crítica
        if (totalFaltasNoPeriodo > (faltasDoTrimestre.length * LIMITE_FALTAS_DISCIPLINA_ANUAL * LIMITE_ATENCAO_PERCENTUAL * 0.33) && totalFaltasNoPeriodo > 0) { // Heurística
            observacaoFaltasEl.textContent = "Atenção ao número de faltas. Verifique as disciplinas individualmente.";
            observacaoFaltasEl.style.color = "#f59e0b";
        } else if (totalFaltasNoPeriodo === 0 && faltasDoTrimestre.length > 0) {
             observacaoFaltasEl.textContent = "Ótimo! Nenhuma falta registrada neste período.";
             observacaoFaltasEl.style.color = "#6EE7B7";
        }
        else {
            observacaoFaltasEl.textContent = "Monitore suas faltas para não exceder o limite.";
            observacaoFaltasEl.style.color = ""; // Cor padrão
        }
    }

    if (selectTrimestreFaltas) {
        selectTrimestreFaltas.addEventListener('change', (event) => {
            renderizarFaltas(event.target.value);
        });
        renderizarFaltas(selectTrimestreFaltas.value); // Carga inicial
    } else {
        renderizarFaltas("1tri"); // Fallback
    }
});