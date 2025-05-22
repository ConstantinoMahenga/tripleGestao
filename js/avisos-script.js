document.addEventListener('DOMContentLoaded', () => {
    const selectCategoria = document.getElementById('select-categoria-aviso');
    const searchInput = document.getElementById('search-aviso');
    const avisosListContainerEl = document.getElementById('avisos-list-container');
    const avisosListaViewEl = document.getElementById('avisos-lista-view');

    const avisoDetalheViewEl = document.getElementById('aviso-detalhe-view');
    const detalheCategoriaEl = document.getElementById('detalhe-aviso-categoria');
    const detalheTitleEl = document.getElementById('detalhe-aviso-title');
    const detalheDataPublicacaoEl = document.getElementById('detalhe-aviso-data-publicacao');
    const detalheConteudoEl = document.getElementById('detalhe-aviso-conteudo');
    const btnVoltarParaLista = document.getElementById('btnVoltarParaLista');

    const headerBackLink = document.getElementById('header-back-link');
    const headerBackLinkText = document.getElementById('header-back-link-text');
    const pageTitleEl = document.getElementById('page-title');

    let avisosLidos = JSON.parse(localStorage.getItem('avisosLidosSGE')) || [];
    let currentViewingAviso = null;

    const todosOsAvisos = [
        {
            id: 1,
            titulo: "Reunião de Pais e Encarregados - 3º Trimestre",
            categoria: "geral",
            dataPublicacao: "2024-10-20",
            resumo: "Convocamos todos os pais e encarregados para a reunião trimestral de acompanhamento pedagógico. Sua presença é fundamental!",
            conteudoCompleto: "<p>Prezados Pais e Encarregados de Educação,</p><p>Temos o prazer de convidá-los para a Reunião de Pais do 3º Trimestre, que se realizará no dia <strong>05 de Novembro de 2024, às 18:00</strong>, no auditório da escola.</p><p>Nesta reunião, abordaremos os seguintes pontos:</p><ul><li>Desempenho acadêmico geral dos alunos no trimestre;</li><li>Preparação para as avaliações finais;</li><li>Calendário de atividades para o encerramento do ano letivo;</li><li>Esclarecimento de dúvidas.</li></ul><p>Contamos com a vossa valiosa presença.</p><p>Atenciosamente,<br>A Direção da Escola</p>",
        },
        {
            id: 2,
            titulo: "Inscrições Abertas para o Festival de Talentos",
            categoria: "evento",
            dataPublicacao: "2024-10-15",
            resumo: "Mostre seu talento! Inscrições para o Festival de Talentos da escola estão abertas até o dia 30/10. Canto, dança, teatro e mais!",
            conteudoCompleto: "<p>Solte a estrela que há em você! Estão abertas as inscrições para o nosso tradicional Festival de Talentos.</p><p><strong>Categorias:</strong></p><ul><li>Música (canto, instrumental)</li><li>Dança (todos os estilos)</li><li>Teatro (pequenas encenações, monólogos)</li><li>Poesia e Declamação</li><li>Artes Visuais (exposição)</li><li>Outros talentos especiais</li></ul><p><strong>Inscrições:</strong> Até 30 de Outubro de 2024, na secretaria da escola ou com o Grêmio Estudantil.</p><p><strong>Data do Evento:</strong> 15 de Novembro de 2024, às 19:00, no pátio principal.</p><p>Não perca a chance de brilhar!</p>",
        },
        {
            id: 3,
            titulo: "URGENTE: Suspensão das Aulas - Dia 25/10",
            categoria: "urgente",
            dataPublicacao: "2024-10-24",
            resumo: "Atenção: Devido a problemas na rede elétrica, as aulas estarão suspensas amanhã, dia 25/10/2024, em todos os períodos.",
            conteudoCompleto: "<p><strong>COMUNICADO URGENTE</strong></p><p>Informamos que, devido a uma falha crítica na rede de abastecimento elétrico que afeta as instalações da escola, as aulas estarão <strong>suspensas</strong> no dia de amanhã, <strong>25 de Outubro de 2024 (Sexta-feira)</strong>, para todos os turnos e níveis de ensino.</p><p>As equipes de manutenção já foram acionadas e estamos trabalhando para normalizar a situação o mais breve possível. Manteremos todos informados sobre o retorno das atividades.</p><p>Agradecemos a compreensão.</p><p>A Direção.</p>",
        },
        {
            id: 4,
            titulo: "Calendário de Provas Finais do 3º Trimestre",
            categoria: "academico",
            dataPublicacao: "2024-10-10",
            resumo: "Confira o calendário detalhado das provas finais do 3º Trimestre. Prepare-se e bons estudos!",
            conteudoCompleto: "<p>Divulgamos o calendário oficial das Provas Finais referentes ao 3º Trimestre do ano letivo de 2024.</p><p><strong>Datas Importantes:</strong></p><ul><li><strong>De 18 a 22 de Novembro:</strong> Semana de Revisões Intensivas (horário especial a ser divulgado).</li><li><strong>De 25 a 29 de Novembro:</strong> Realização das Provas Finais (consultar cronograma específico por turma e disciplina afixado nos murais e enviado por email).</li></ul><p>Recomendamos que os alunos organizem seus estudos com antecedência. Em caso de dúvidas, procurem seus professores.</p><p>Desejamos a todos bons estudos e sucesso nas avaliações!</p>",
        }
    ];

    function getCategoriaClass(categoria) {
        return `tag-${categoria.toLowerCase()}`;
    }

    function marcarComoLido(avisoId) {
        const avisoCardNaLista = document.querySelector(`.aviso-card[data-id="${avisoId}"]`);
        if (avisoCardNaLista) {
            avisoCardNaLista.classList.add('lido');
        }
        if (!avisosLidos.includes(String(avisoId))) {
            avisosLidos.push(String(avisoId));
            localStorage.setItem('avisosLidosSGE', JSON.stringify(avisosLidos));
        }
    }

    function renderizarListaDeAvisos(filtrados = todosOsAvisos) {
        avisosListContainerEl.innerHTML = '';
        if (filtrados.length === 0) {
            avisosListContainerEl.innerHTML = `<div class="no-data-message">Nenhum aviso encontrado.</div>`;
            return;
        }

        filtrados.sort((a, b) => {
            const aLido = avisosLidos.includes(String(a.id));
            const bLido = avisosLidos.includes(String(b.id));
            if (a.categoria === 'urgente' && !aLido && (b.categoria !== 'urgente' || bLido)) return -1;
            if (b.categoria === 'urgente' && !bLido && (a.categoria !== 'urgente' || aLido)) return 1;
            if (!aLido && bLido) return -1;
            if (aLido && !bLido) return 1;
            return new Date(b.dataPublicacao) - new Date(a.dataPublicacao);
        });

        filtrados.forEach(aviso => {
            const card = document.createElement('div');
            card.className = 'aviso-card';
            card.dataset.id = aviso.id;
            const isLido = avisosLidos.includes(String(aviso.id));
            if (isLido) card.classList.add('lido');

            card.innerHTML = `
                <div class="aviso-titulo-card">
                    <span class="unread-dot"></span>
                    ${aviso.titulo}
                </div>
                <div class="aviso-meta-card">
                    <span class="aviso-data">${new Date(aviso.dataPublicacao + 'T00:00:00').toLocaleDateString('pt-MZ', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                    <span class="aviso-categoria-tag ${getCategoriaClass(aviso.categoria)}">${aviso.categoria}</span>
                </div>
            `;
            card.addEventListener('click', () => mostrarDetalheAviso(aviso.id));
            avisosListContainerEl.appendChild(card);
        });
    }

    function filtrarAvisos() {
        const categoriaSelecionada = selectCategoria.value;
        const termoBusca = searchInput.value.toLowerCase();
        const filtrados = todosOsAvisos.filter(aviso => {
            const catOk = categoriaSelecionada === 'todos' || aviso.categoria === categoriaSelecionada;
            const buscaOk = aviso.titulo.toLowerCase().includes(termoBusca) ||
                            aviso.conteudoCompleto.toLowerCase().includes(termoBusca) ||
                            (aviso.resumo && aviso.resumo.toLowerCase().includes(termoBusca));
            return catOk && buscaOk;
        });
        renderizarListaDeAvisos(filtrados);
    }

    function mostrarDetalheAviso(avisoId) {
        currentViewingAviso = todosOsAvisos.find(a => a.id == avisoId);
        if (!currentViewingAviso) return;

        detalheCategoriaEl.textContent = currentViewingAviso.categoria;
        detalheCategoriaEl.className = `aviso-categoria-tag ${getCategoriaClass(currentViewingAviso.categoria)}`;
        detalheTitleEl.textContent = currentViewingAviso.titulo;
        detalheDataPublicacaoEl.textContent = new Date(currentViewingAviso.dataPublicacao + 'T00:00:00').toLocaleDateString('pt-MZ', { day: 'numeric', month: 'long', year: 'numeric' });
        detalheConteudoEl.innerHTML = currentViewingAviso.conteudoCompleto;

        marcarComoLido(avisoId);

        avisosListaViewEl.style.display = 'none';
        avisoDetalheViewEl.style.display = 'block';

        pageTitleEl.textContent = "Detalhe do Aviso";
        headerBackLinkText.textContent = "Avisos";
        window.scrollTo(0, 0);
    }

    function mostrarListaDeAvisos() {
        avisoDetalheViewEl.style.display = 'none';
        avisosListaViewEl.style.display = 'block';
        currentViewingAviso = null;

        pageTitleEl.textContent = "Mural de Avisos";
        headerBackLinkText.textContent = "Início";
        renderizarListaDeAvisos(todosOsAvisos.filter(aviso => {
            const categoriaSelecionada = selectCategoria.value;
            const termoBusca = searchInput.value.toLowerCase();
            const catOk = categoriaSelecionada === 'todos' || aviso.categoria === categoriaSelecionada;
            const buscaOk = aviso.titulo.toLowerCase().includes(termoBusca) || aviso.conteudoCompleto.toLowerCase().includes(termoBusca);
            return catOk && buscaOk;
        }));
        window.scrollTo(0, 0);
    }

    if (selectCategoria) selectCategoria.addEventListener('change', filtrarAvisos);
    if (searchInput) searchInput.addEventListener('input', filtrarAvisos);
    if (btnVoltarParaLista) btnVoltarParaLista.addEventListener('click', mostrarListaDeAvisos);

    if (headerBackLink) {
        headerBackLink.addEventListener('click', (e) => {
            if (currentViewingAviso) {
                e.preventDefault();
                mostrarListaDeAvisos();
            }
        });
    }

    renderizarListaDeAvisos();
});