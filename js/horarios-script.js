document.addEventListener('DOMContentLoaded', () => {
    const daySelectorContainer = document.querySelector('.day-selector-container');
    const horarioDiaContainer = document.getElementById('horario-dia-container');

    // Dados simulados de horários
    const horariosDaSemana = {
        "seg": [
            { hora: "07:30 - 08:20", disciplina: "Matemática", professor: "Prof. Carlos", sala: "Sala 101" },
            { hora: "08:20 - 09:10", disciplina: "Português", professor: "Profa. Ana", sala: "Sala 102" },
            { hora: "09:10 - 09:30", disciplina: "Intervalo", professor: "", sala: "" },
            { hora: "09:30 - 10:20", disciplina: "Física", professor: "Prof. Pedro", sala: "Lab. Física" },
            { hora: "10:20 - 11:10", disciplina: "História", professor: "Profa. Maria", sala: "Sala 101" },
        ],
        "ter": [
            { hora: "07:30 - 08:20", disciplina: "Química", professor: "Profa. Sofia", sala: "Lab. Química" },
            { hora: "08:20 - 09:10", disciplina: "Geografia", professor: "Prof. João", sala: "Sala 103" },
            { hora: "09:10 - 09:30", disciplina: "Intervalo", professor: "", sala: "" },
            { hora: "09:30 - 10:20", disciplina: "Educação Física", professor: "Prof. Rui", sala: "Ginásio" },
            { hora: "10:20 - 11:10", disciplina: "Matemática", professor: "Prof. Carlos", sala: "Sala 101" },
        ],
        "qua": [
            { hora: "07:30 - 08:20", disciplina: "Português", professor: "Profa. Ana", sala: "Sala 102" },
            { hora: "08:20 - 09:10", disciplina: "Física", professor: "Prof. Pedro", sala: "Lab. Física" },
            { hora: "09:10 - 09:30", disciplina: "Intervalo", professor: "", sala: "" },
            { hora: "09:30 - 10:20", disciplina: "Química", professor: "Profa. Sofia", sala: "Lab. Química" },
            { hora: "10:20 - 11:10", disciplina: "Desenho Técnico", professor: "Prof. Marco", sala: "Sala Desenho" },
        ],
        "qui": [
             { hora: "07:30 - 08:20", disciplina: "Matemática", professor: "Prof. Carlos", sala: "Sala 101" },
            { hora: "08:20 - 09:10", disciplina: "História", professor: "Profa. Maria", sala: "Sala 101" },
            { hora: "09:10 - 09:30", disciplina: "Intervalo", professor: "", sala: "" },
            { hora: "09:30 - 10:20", disciplina: "Geografia", professor: "Prof. João", sala: "Sala 103" },
            { hora: "10:20 - 11:10", disciplina: "Português", professor: "Profa. Ana", sala: "Sala 102" },
        ],
        "sex": [
            { hora: "07:30 - 08:20", disciplina: "Física", professor: "Prof. Pedro", sala: "Lab. Física" },
            { hora: "08:20 - 09:10", disciplina: "Educação Física", professor: "Prof. Rui", sala: "Ginásio" },
            { hora: "09:10 - 09:30", disciplina: "Intervalo", professor: "", sala: "" },
            { hora: "09:30 - 10:20", disciplina: "TIC", professor: "Profa. Laura", sala: "Sala Info." },
            { hora: "10:20 - 11:10", disciplina: "Matemática", professor: "Prof. Carlos", sala: "Sala 101" },
        ],
        "sab": [] // Sem aulas ao Sábado (exemplo)
    };

    function renderizarHorario(dia) {
        horarioDiaContainer.innerHTML = '';
        const aulasDoDia = horariosDaSemana[dia] || [];

        if (aulasDoDia.length === 0) {
            horarioDiaContainer.innerHTML = `
                <div class="no-data-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                    Nenhuma aula programada para este dia.
                </div>`;
            return;
        }

        aulasDoDia.forEach(aula => {
            const aulaCard = document.createElement('div');
            aulaCard.className = 'aula-card';
            if (aula.disciplina.toLowerCase() === "intervalo") {
                aulaCard.classList.add('intervalo-card'); // Pode estilizar intervalos de forma diferente
            }

            let detalhesHTML = `<h4>${aula.disciplina}</h4>`;
            if (aula.professor) {
                detalhesHTML += `
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" /></svg>
                        ${aula.professor}
                    </p>`;
            }
            if (aula.sala) {
                detalhesHTML += `
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.979.572l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>
                        ${aula.sala}
                    </p>`;
            }
             if (aula.disciplina.toLowerCase() === "intervalo") { // Sem professor e sala para intervalo
                detalhesHTML = `<h4>${aula.disciplina}</h4>`;
            }


            aulaCard.innerHTML = `
                <div class="aula-horario">${aula.hora}</div>
                <div class="aula-detalhes">
                    ${detalhesHTML}
                </div>
            `;
            horarioDiaContainer.appendChild(aulaCard);
        });
    }

    if (daySelectorContainer) {
        const dayButtons = daySelectorContainer.querySelectorAll('.day-selector-btn');

        dayButtons.forEach(button => {
            button.addEventListener('click', () => {
                dayButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderizarHorario(button.dataset.day);
            });
        });

        // Selecionar o dia atual por padrão
        const hoje = new Date().getDay(); // Domingo = 0, Segunda = 1, ..., Sábado = 6
        const diasMap = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
        const diaAtualKey = diasMap[hoje] || "seg"; // Fallback para segunda se for domingo

        const botaoDiaAtual = daySelectorContainer.querySelector(`.day-selector-btn[data-day="${diaAtualKey}"]`);
        if (botaoDiaAtual) {
            botaoDiaAtual.click(); // Simula o clique para carregar e marcar como ativo
        } else if (dayButtons.length > 0) {
            dayButtons[0].click(); // Fallback para o primeiro botão se o dia atual não estiver na lista
        }

    } else {
        renderizarHorario("seg"); // Fallback se o container de botões não existir
    }
});