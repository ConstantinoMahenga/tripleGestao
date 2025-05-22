document.addEventListener('DOMContentLoaded', () => {
    const saldoDisponivelEl = document.getElementById('saldo-disponivel-valor');
    const saldoDividaEl = document.getElementById('saldo-divida-valor');
    const formRecarregar = document.getElementById('form-recarregar-carteira');
    const valorRecargaInput = document.getElementById('valor-recarga');
    const metodoPagamentoSelect = document.getElementById('metodo-pagamento');
    const historicoContainer = document.getElementById('historico-transacoes-container');

    const detalhesMpesaEl = document.getElementById('detalhes-pagamento-mpesa');
    const detalhesEmolaEl = document.getElementById('detalhes-pagamento-emola');
    const mpesaIdInput = document.getElementById('mpesa-id-transacao');
    const emolaIdInput = document.getElementById('emola-id-transacao');


    // Simulação de dados iniciais
    let saldoAtual = 250.75; // MZN
    let dividaAtual = 1500.00; // MZN (ex: propinas)
    let transacoes = [
        { id: 1, tipo: 'entrada', descricao: 'Recarga via M-Pesa', valor: 500.00, data: '2024-10-15' },
        { id: 2, tipo: 'saida', descricao: 'Pagamento Cantina', valor: -85.50, data: '2024-10-16' },
        { id: 3, tipo: 'entrada', descricao: 'Recarga (Referência XPTO)', valor: 1000.00, data: '2024-09-01' },
        { id: 4, tipo: 'saida', descricao: 'Mensalidade Outubro (Propina)', valor: -1500.00, data: '2024-10-05', eDivida: true }
    ];

    function formatarMoeda(valor) {
        return `MZN ${valor.toFixed(2).replace('.', ',')}`;
    }

    function atualizarSaldosUI() {
        saldoDisponivelEl.textContent = formatarMoeda(saldoAtual);
        saldoDividaEl.textContent = formatarMoeda(dividaAtual);
    }

    function renderizarHistorico() {
        historicoContainer.innerHTML = ''; // Limpa antes de renderizar
        if (transacoes.length === 0) {
            historicoContainer.innerHTML = '<p class="no-data-message" style="margin-top:0; background-color: transparent;">Nenhuma transação recente.</p>';
            return;
        }

        // Ordenar transações pela data mais recente primeiro
        const transacoesOrdenadas = [...transacoes].sort((a, b) => new Date(b.data) - new Date(a.data));

        transacoesOrdenadas.forEach(transacao => {
            const item = document.createElement('div');
            item.className = 'transacao-item';
            const valorFormatado = formatarMoeda(Math.abs(transacao.valor));
            const tipoClasse = transacao.tipo === 'entrada' ? 'transacao-entrada' : 'transacao-saida';
            
            item.classList.add(tipoClasse); // Adiciona classe para cor da borda e texto do valor

            item.innerHTML = `
                <div class="transacao-info">
                    <p class="descricao">${transacao.descricao}</p>
                    <p class="data">${new Date(transacao.data + 'T00:00:00').toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <span class="transacao-valor">${transacao.tipo === 'entrada' ? '+' : ''}${valorFormatado}</span>
            `;
            historicoContainer.appendChild(item);
        });
    }

    function mostrarDetalhesPagamento() {
        detalhesMpesaEl.style.display = 'none';
        detalhesEmolaEl.style.display = 'none';
        mpesaIdInput.required = false;
        emolaIdInput.required = false;
        // Esconder outros detalhes se existirem

        const metodo = metodoPagamentoSelect.value;
        if (metodo === 'mpesa') {
            detalhesMpesaEl.style.display = 'block';
            mpesaIdInput.required = true;
        } else if (metodo === 'emola') {
            detalhesEmolaEl.style.display = 'block';
            emolaIdInput.required = true;
        }
        // Adicionar lógica para 'cartao' ou 'conta_movel' se necessário
    }


    if (formRecarregar) {
        formRecarregar.addEventListener('submit', (e) => {
            e.preventDefault();
            const valor = parseFloat(valorRecargaInput.value);
            const metodo = metodoPagamentoSelect.value;
            let idTransacao = "";

            if (isNaN(valor) || valor <= 0) {
                alert('Por favor, insira um valor de recarga válido.');
                return;
            }
            
            if (metodo === 'mpesa') {
                idTransacao = mpesaIdInput.value.trim();
                if (!idTransacao) {
                    alert('Por favor, insira o ID da transação M-Pesa.');
                    return;
                }
            } else if (metodo === 'emola') {
                idTransacao = emolaIdInput.value.trim();
                 if (!idTransacao) {
                    alert('Por favor, insira o ID da transação e-Mola.');
                    return;
                }
            }
            // Adicionar validações para outros métodos se necessário


            // Simulação de processamento
            // Em um app real, você enviaria isso para um backend para verificar a transação
            // e depois atualizaria o saldo.
            saldoAtual += valor;
            transacoes.push({
                id: transacoes.length + 1,
                tipo: 'entrada',
                descricao: `Recarga via ${metodo.charAt(0).toUpperCase() + metodo.slice(1)} ${idTransacao ? `(ID: ${idTransacao})` : ''}`,
                valor: valor,
                data: new Date().toISOString().split('T')[0]
            });

            alert(`Recarga de ${formatarMoeda(valor)} via ${metodo} processada com sucesso! (Simulado)`);
            
            atualizarSaldosUI();
            renderizarHistorico();
            formRecarregar.reset(); // Limpa o formulário
            mostrarDetalhesPagamento(); // Reseta para o método padrão
        });
    }

    if (metodoPagamentoSelect) {
        metodoPagamentoSelect.addEventListener('change', mostrarDetalhesPagamento);
    }

    // Carga Inicial
    atualizarSaldosUI();
    renderizarHistorico();
    if (metodoPagamentoSelect) mostrarDetalhesPagamento(); // Mostrar detalhes do método padrão
});