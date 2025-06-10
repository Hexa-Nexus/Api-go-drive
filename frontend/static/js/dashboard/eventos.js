// Função para carregar os últimos eventos
async function carregarUltimosEventos() {
    const tbody = document.getElementById('ultimos-eventos');

    try {
        const response = await fetch('http://localhost:3000/api/eventos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar eventos');
        }

        const eventos = await response.json();

        // Limitar a 5 eventos e ordenar pelos mais recentes
        const ultimosEventos = eventos
            .sort((a, b) => new Date(b.dataSaida) - new Date(a.dataSaida))
            .slice(0, 5);

        if (ultimosEventos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Nenhum evento encontrado</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = ultimosEventos.map(evento => `
            <tr>
                <td>${formatarIdEvento(evento.id)}</td>
                <td>
                    <div class="d-flex flex-column">
                        <span class="badge bg-info mb-1">${evento.carro.modelo || 'N/A'}</span>
                        <small>${evento.carro.placa || 'N/A'}</small>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <span>${evento.motorista.nome || 'N/A'}</span>
                        <small>${formatarCPF(evento.motorista.cpf) || 'N/A'}</small>
                    </div>
                </td>
                <td>${formatarData(evento.dataSaida)}</td>
                <td>
                    <span class="badge ${getBadgeClassForStatus(evento.status)}">
                        ${traduzirStatus(evento.status)}
                    </span>
                </td>
                <td>
                    <a href="../evento/PainelEvento.html" class="btn btn-sm btn-primary">
                        <i class="fas fa-eye"></i>
                    </a>
                </td>
            </tr>
        `).join('');

        console.log('Últimos eventos carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar últimos eventos:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    Erro ao carregar eventos: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Função para inicializar o calendário de eventos
function inicializarCalendario() {
    const calendarDiv = document.getElementById('calendar');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Gerar calendário simples com o mês atual
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    let calendarHTML = `
        <div class="calendar-header d-flex justify-content-between align-items-center mb-2">
            <button class="btn btn-sm btn-outline-secondary" id="prev-month">
                <i class="fas fa-chevron-left"></i>
            </button>
            <h5 class="mb-0">${monthNames[currentMonth]} ${currentYear}</h5>
            <button class="btn btn-sm btn-outline-secondary" id="next-month">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <table class="table table-bordered text-center">
            <thead>
                <tr>
                    <th>Dom</th>
                    <th>Seg</th>
                    <th>Ter</th>
                    <th>Qua</th>
                    <th>Qui</th>
                    <th>Sex</th>
                    <th>Sáb</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Adicionar dias vazios no início do mês
    let day = 1;
    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';

        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < firstDayOfMonth) || day > daysInMonth) {
                calendarHTML += '<td></td>';
            } else {
                const isToday = day === currentDate.getDate() &&
                               currentMonth === currentDate.getMonth() &&
                               currentYear === currentDate.getFullYear();

                calendarHTML += `
                    <td class="${isToday ? 'bg-primary text-white' : ''}"
                        data-date="${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}">
                        ${day}
                    </td>
                `;
                day++;
            }
        }

        calendarHTML += '</tr>';
        if (day > daysInMonth) break;
    }

    calendarHTML += `
            </tbody>
        </table>
    `;

    calendarDiv.innerHTML = calendarHTML;

    // Adicionar event listeners para os dias do calendário
    document.querySelectorAll('#calendar td[data-date]').forEach(cell => {
        cell.addEventListener('click', () => {
            const selectedDate = cell.getAttribute('data-date');
            mostrarEventosNaData(selectedDate);
        });
    });

    // Adicionar event listeners para navegação do calendário
    document.getElementById('prev-month').addEventListener('click', () => {
        // Implementação futura: navegar para o mês anterior
        alert('Navegação para o mês anterior a ser implementada');
    });

    document.getElementById('next-month').addEventListener('click', () => {
        // Implementação futura: navegar para o próximo mês
        alert('Navegação para o próximo mês a ser implementada');
    });

    // Marcar dias com eventos
    carregarDiasComEventos(currentYear, currentMonth + 1);
}

// Função para carregar dias com eventos
async function carregarDiasComEventos(ano, mes) {
    try {
        // Formatar datas para o início e fim do mês
        const dataInicial = `${ano}-${mes.toString().padStart(2, '0')}-01`;
        const ultimoDia = new Date(ano, mes, 0).getDate();
        const dataFinal = `${ano}-${mes.toString().padStart(2, '0')}-${ultimoDia}`;

        const response = await fetch(`http://localhost:3000/api/eventos?dataInicial=${dataInicial}&dataFinal=${dataFinal}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar eventos para o calendário');
        }

        const eventos = await response.json();

        // Agrupar eventos por data
        const eventosPorData = {};
        eventos.forEach(evento => {
            const data = new Date(evento.dataSaida).toISOString().split('T')[0];
            if (!eventosPorData[data]) {
                eventosPorData[data] = [];
            }
            eventosPorData[data].push(evento);
        });

        // Marcar dias com eventos no calendário
        Object.keys(eventosPorData).forEach(data => {
            const cell = document.querySelector(`#calendar td[data-date="${data}"]`);
            if (cell) {
                const quantidadeEventos = eventosPorData[data].length;
                cell.classList.add('has-events');
                cell.innerHTML = `
                    ${cell.textContent}
                    <span class="badge rounded-pill bg-danger position-absolute"
                          style="font-size: 8px; top: 0; right: 0;">
                        ${quantidadeEventos}
                    </span>
                `;
                cell.style.position = 'relative';
            }
        });

        console.log('Dias com eventos marcados no calendário');
    } catch (error) {
        console.error('Erro ao carregar dias com eventos:', error);
    }
}

// Função para mostrar eventos em uma data específica
async function mostrarEventosNaData(data) {
    try {
        const response = await fetch(`http://localhost:3000/api/eventos?dataInicial=${data}&dataFinal=${data}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar eventos da data');
        }

        const eventos = await response.json();

        let mensagem = '';
        if (eventos.length === 0) {
            mensagem = `Nenhum evento encontrado em ${formatarDataSimples(data)}`;
        } else {
            mensagem = `
                <h6>${eventos.length} Evento(s) em ${formatarDataSimples(data)}:</h6>
                <ul class="list-group list-group-flush mt-2">
                    ${eventos.map(evento => `
                        <li class="list-group-item p-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="badge ${getBadgeClassForStatus(evento.status)} me-2">
                                        ${traduzirStatus(evento.status)}
                                    </span>
                                    ${evento.motorista.nome} - ${evento.carro.placa}
                                </div>
                                <small>${new Date(evento.dataSaida).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</small>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `;
        }

        // Mostrar modal ou tooltip com os eventos
        alert(mensagem.replace(/<[^>]*>/g, ''));

        console.log(`Eventos do dia ${data} exibidos`);
    } catch (error) {
        console.error(`Erro ao mostrar eventos da data ${data}:`, error);
        alert(`Erro ao carregar eventos: ${error.message}`);
    }
}

// Funções utilitárias
function formatarIdEvento(id) {
    if (!id) return 'N/A';
    return '#' + id.substring(0, 5);
}

function formatarData(data) {
    if (!data) return 'N/A';
    try {
        return new Date(data).toLocaleString('pt-BR');
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return 'Data inválida';
    }
}

function formatarDataSimples(data) {
    if (!data) return 'N/A';
    try {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        console.error('Erro ao formatar data simples:', error);
        return data;
    }
}

function formatarCPF(cpf) {
    if (!cpf) return 'CPF não informado';
    try {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } catch (error) {
        console.error('Erro ao formatar CPF:', error);
        return cpf;
    }
}

function traduzirStatus(status) {
    // Normalizar o status para maiúsculas para comparação
    const statusNormalizado = status ? status.toUpperCase() : '';

    const traducoes = {
        'PENDENTE': 'Pendente',
        'CONCLUIDO': 'Concluído',
        'CANCELADO': 'Cancelado'
    };

    return traducoes[statusNormalizado] || status;
}

function getBadgeClassForStatus(status) {
    // Normalizar o status para maiúsculas para comparação
    const statusNormalizado = status ? status.toUpperCase() : '';

    const classes = {
        'PENDENTE': 'bg-warning',
        'CONCLUIDO': 'bg-success',
        'CANCELADO': 'bg-danger'
    };

    return classes[statusNormalizado] || 'bg-secondary';
}
