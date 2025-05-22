document.addEventListener('DOMContentLoaded', () => {
    const btnEditarDados = document.getElementById('btnEditarDados');
    const btnSalvarDados = document.getElementById('btnSalvarDados');
    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');

    const dataItems = [
        { displayId: 'display-nomeCompleto', inputId: 'input-nomeCompleto' },
        { displayId: 'display-dataNascimento', inputId: 'input-dataNascimento' },
        { displayId: 'display-cpf', inputId: 'input-cpf' },
        // Matrícula, Turma, Turno não são editáveis, então não entram aqui para o toggle
        { displayId: 'display-email', inputId: 'input-email' },
        { displayId: 'display-telefone', inputId: 'input-telefone' },
    ];

    let originalValues = {}; // Para armazenar os valores originais ao entrar em modo de edição

    function toggleEditMode(isEditing) {
        dataItems.forEach(item => {
            const displayElement = document.getElementById(item.displayId);
            const inputElement = document.getElementById(item.inputId);

            if (displayElement && inputElement) {
                if (isEditing) {
                    // Salva o valor original antes de mostrar o input
                    originalValues[item.inputId] = displayElement.textContent;
                    // Se for data, precisa pegar o valor do input e formatar para o display se necessário,
                    // mas aqui estamos pegando do display para o input
                    if (inputElement.type === 'date') {
                        // Converte DD/MM/YYYY para YYYY-MM-DD para o input date
                        const parts = displayElement.textContent.split('/');
                        if (parts.length === 3) {
                            inputElement.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
                        } else {
                            inputElement.value = displayElement.textContent; // fallback
                        }
                    } else {
                        inputElement.value = displayElement.textContent;
                    }
                    displayElement.style.display = 'none';
                    inputElement.style.display = 'block';
                } else {
                    // Ao salvar ou cancelar, atualiza o display com o valor do input (ou original se cancelado)
                    // Se salvando:
                    if (inputElement.type === 'date') {
                         // Converte YYYY-MM-DD para DD/MM/YYYY
                        const parts = inputElement.value.split('-');
                        if (parts.length === 3) {
                            displayElement.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
                        } else {
                            displayElement.textContent = inputElement.value; // fallback
                        }
                    } else {
                        displayElement.textContent = inputElement.value;
                    }
                    displayElement.style.display = 'block';
                    inputElement.style.display = 'none';
                }
            }
        });

        btnEditarDados.style.display = isEditing ? 'none' : 'inline-flex';
        btnSalvarDados.style.display = isEditing ? 'inline-flex' : 'none';
        btnCancelarEdicao.style.display = isEditing ? 'inline-flex' : 'none';
    }

    function revertToOriginalValues() {
        dataItems.forEach(item => {
            const displayElement = document.getElementById(item.displayId);
            const inputElement = document.getElementById(item.inputId);
            if (displayElement && inputElement) {
                displayElement.textContent = originalValues[item.inputId] || displayElement.textContent; // Usa original ou mantém atual se não houver original
                displayElement.style.display = 'block';
                inputElement.style.display = 'none';
            }
        });
        // Limpa os valores originais para a próxima edição
        originalValues = {};
    }


    if (btnEditarDados) {
        btnEditarDados.addEventListener('click', () => {
            toggleEditMode(true);
        });
    }

    if (btnSalvarDados) {
        btnSalvarDados.addEventListener('click', () => {
            // Aqui você faria a lógica de enviar os dados para um backend
            // Por enquanto, apenas simulamos e atualizamos a UI
            console.log("Dados a serem salvos (simulado):");
            dataItems.forEach(item => {
                const inputElement = document.getElementById(item.inputId);
                console.log(`${item.inputId}: ${inputElement.value}`);
            });
            alert('Dados salvos com sucesso! (Simulado)');
            toggleEditMode(false); // Volta para o modo de visualização
        });
    }

    if (btnCancelarEdicao) {
        btnCancelarEdicao.addEventListener('click', () => {
            revertToOriginalValues(); // Restaura os valores
            toggleEditMode(false); // Volta para o modo de visualização
        });
    }
});