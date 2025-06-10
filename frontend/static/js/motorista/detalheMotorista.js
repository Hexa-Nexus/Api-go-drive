// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Variáveis globais
let motoristaId = null;
let motoristaData = null;
let eventosMotorista = [];
let usarDadosDeTeste = false; // Flag para controlar o uso de dados de teste

// Inicialização do módulo
document.addEventListener('DOMContentLoaded', () => {
    // Garantir que não haja modais ou backdrops remanescentes
    limparTodosModaisEBackdrops();

    // Obter o ID do motorista da URL
    const urlParams = new URLSearchParams(window.location.search);
    motoristaId = urlParams.get('id');

    console.log("Inicializando página com motoristaId:", motoristaId);
    registrarLog('Inicialização da página de perfil do motorista', { motoristaId });

    if (!motoristaId) {
        showErrorModal('Erro', 'Identificador do motorista não encontrado na URL');
        setTimeout(() => {
            window.location.href = '../motorista/PainelMotorista.html';
        }, 3000);
        return;
    }

    // Verificar o token antes de iniciar
    const token = localStorage.getItem('token');
    if (!token) {
        showErrorModal('Erro', 'Usuário não autenticado');
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 3000);
        return;
    }

    // Carregar dados do motorista
    carregarDetalhesMotorista();

    // Adicionar event listener para o formulário de filtro
    document.getElementById('form-filtro-eventos').addEventListener('submit', (e) => {
        e.preventDefault();

        registrarLog('Aplicação de filtros via formulário', {
            carro: document.getElementById('filtro-carro').value,
            dataInicial: document.getElementById('filtro-data-inicial').value,
            dataFinal: document.getElementById('filtro-data-final').value,
            status: document.getElementById('filtro-status').value
        });

        carregarEventosMotorista(true);
    });

    // Adicionar event listener para o botão de limpar filtros
    document.getElementById('btn-limpar-filtros').addEventListener('click', () => {
        // Limpar os campos de filtro
        document.getElementById('filtro-carro').value = '';
        document.getElementById('filtro-data-inicial').value = '';
        document.getElementById('filtro-data-final').value = '';
        document.getElementById('filtro-status').value = '';

        registrarLog('Limpeza de filtros');

        // Recarregar eventos sem filtros
        carregarEventosMotorista(false);

        // Mostrar mensagem de sucesso
        showSuccessModal('Filtros limpos com sucesso!');
    });

    // Adicionar handler para limpar modais quando o usuário clicar fora ou teclar ESC
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal') || event.target.classList.contains('modal-backdrop')) {
            limparTodosModaisEBackdrops();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            limparTodosModaisEBackdrops();
        }
    });
});

// Função para limpar todos os modais e backdrops
function limparTodosModaisEBackdrops() {
    // Remover todos os modais
    const modais = [
        'detalheEventoModal',
        'errorModal',
        'successModal'
    ];

    modais.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            const instance = bootstrap.Modal.getInstance(modal);
            if (instance) {
                instance.hide();
            }
        }
    });

    // Remover todos os backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
        backdrop.remove();
    });

    // Restaurar o scroll e a aparência da página
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

// Função para registrar log de ações do usuário
function registrarLog(acao, detalhes) {
    const timestamp = new Date().toISOString();
    const usuario = localStorage.getItem('usuario') || 'Usuário';
    console.log(`[LOG ${timestamp}] ${usuario} - ${acao}`, detalhes);

    // Aqui poderia ser implementado um envio do log para o servidor
}

// Função para carregar os detalhes do motorista
async function carregarDetalhesMotorista() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showErrorModal('Erro', 'Usuário não autenticado');
            return;
        }

        console.log("Carregando detalhes do motorista ID:", motoristaId);
        registrarLog('Carregamento de detalhes do motorista', { motoristaId });

        // Mostrar indicadores de carregamento
        document.getElementById('motorista-nome').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        document.getElementById('motorista-detalhes').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando detalhes...';

        const response = await fetch(`${API_BASE_URL}/motorista/${motoristaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("Status da resposta:", response.status);

        if (!response.ok) {
            // Tentar ler a mensagem de erro da API
            const errorData = await response.json().catch(() => ({}));
            console.error("Erro da API:", errorData);
            registrarLog('Erro ao carregar motorista', { motoristaId, status: response.status, erro: errorData.message || response.statusText });
            throw new Error(`Erro ao carregar dados do motorista: ${errorData.message || response.statusText}`);
        }

        motoristaData = await response.json();
        console.log("Dados do motorista recebidos:", motoristaData);
        registrarLog('Dados do motorista recebidos', { motoristaId, nome: motoristaData.nome });

        // Verificar se os dados são válidos
        if (!motoristaData || !motoristaData.id) {
            registrarLog('Dados do motorista inválidos', { motoristaId });
            throw new Error('Dados do motorista inválidos ou incompletos');
        }

        // Atualizar as informações do motorista na página
        atualizarInformacoesMotorista(motoristaData);

        // Carregar apenas eventos
        carregarEventosMotorista(false);
    } catch (error) {
        console.error('Erro:', error);
        registrarLog('Erro ao carregar detalhes do motorista', { motoristaId, erro: error.message });

        // Exibir mensagem de erro na página
        document.getElementById('motorista-nome').textContent = 'Erro ao carregar motorista';
        document.getElementById('motorista-detalhes').textContent = 'Não foi possível carregar os detalhes do motorista';

        // Preencher campos com informação de erro
        document.getElementById('info-nome').textContent = 'Erro';
        document.getElementById('info-status').innerHTML = '<span class="badge bg-danger">Erro</span>';
        document.getElementById('info-cpf').textContent = 'Erro';
        document.getElementById('info-telefone').textContent = 'Erro';
        document.getElementById('info-habilitacao').textContent = 'Erro';

        showErrorModal('Erro', 'Não foi possível carregar os detalhes do motorista. Verifique o console para mais detalhes.');
    }
}

// Função para atualizar as informações do motorista na página
function atualizarInformacoesMotorista(motorista) {
    try {
        // Verificação de segurança
        if (!motorista) {
            throw new Error('Dados do motorista não fornecidos');
        }

        // Atualizar o título
        document.getElementById('motorista-nome').textContent = motorista.nome || 'Sem nome';

        // Formatar CPF
        const cpfFormatado = motorista.cpf
            ? motorista.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
            : 'N/A';

        document.getElementById('motorista-detalhes').textContent =
            `CPF: ${cpfFormatado} | Telefone: ${motorista.telefone || 'N/A'} | Habilitação: ${motorista.habilitacao || 'N/A'}`;

        // Atualizar as informações detalhadas
        document.getElementById('info-nome').textContent = motorista.nome || 'N/A';

        /* Status com badge */
        let disponivel = false;
        try {
            // Tentar converter para booleano de várias formas
            disponivel = motorista.disponivel === true ||
                          motorista.disponivel === 'true' ||
                          motorista.disponivel === 1 ||
                          motorista.disponivel === '1';
        } catch (e) {
            console.error('Erro ao determinar disponibilidade:', e);
        }

        const statusBadge = `Status: <span class="badge ${disponivel ? 'bg-success' : 'bg-danger'}">
            ${disponivel ? 'Disponível' : 'Indisponível'}
        </span>`;
        document.getElementById('info-status').innerHTML = statusBadge;

        document.getElementById('info-cpf').textContent = cpfFormatado;
        document.getElementById('info-telefone').textContent = motorista.telefone || 'N/A';
        document.getElementById('info-habilitacao').textContent = motorista.habilitacao || 'N/A';

        // Avatar CSS
        const style = document.createElement('style');
        style.textContent = `
            .avatar-circle {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
            }
        `;
        document.head.appendChild(style);

        console.log("Informações do motorista atualizadas com sucesso");
    } catch (error) {
        console.error('Erro ao atualizar informações do motorista:', error);
    }
}

// Função para carregar os eventos do motorista
async function carregarEventosMotorista(comFiltro = false) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showErrorModal('Erro', 'Usuário não autenticado');
            return;
        }

        // Mostrar spinner de carregamento
        document.getElementById('eventos-lista').innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </td>
            </tr>
        `;

        console.log("Carregando eventos do motorista ID:", motoristaId);

        // Parâmetros de filtro
        const filtroCarro = document.getElementById('filtro-carro').value;
        const filtroDataInicial = document.getElementById('filtro-data-inicial').value;
        const filtroDataFinal = document.getElementById('filtro-data-final').value;
        const filtroStatus = document.getElementById('filtro-status').value;

        // Registrar log de ação - busca de eventos
        let detalhesLog = { motoristaId, comFiltro };
        if (comFiltro) {
            detalhesLog.filtros = {
                carro: filtroCarro || 'Todos',
                dataInicial: filtroDataInicial || 'Todas',
                dataFinal: filtroDataFinal || 'Todas',
                status: filtroStatus || 'Todos'
            };
        }
        registrarLog('Busca de eventos do motorista', detalhesLog);

        // Abordagem direta: obter todos os eventos e filtrar pelo ID do motorista
        const allEventsUrl = `${API_BASE_URL}/eventos`;
        console.log("Carregando todos os eventos:", allEventsUrl);
        console.log("Headers:", { 'Authorization': `Bearer ${token.substring(0, 10)}...` });

        const allEventsResponse = await fetch(allEventsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("Status da resposta (todos os eventos):", allEventsResponse.status);
        console.log("Status text:", allEventsResponse.statusText);

        let allEvents = [];

        if (!allEventsResponse.ok) {
            const errorText = await allEventsResponse.text();
            console.error("Erro detalhado:", errorText);
            console.warn("API retornou erro. Usando dados de teste para desenvolvimento.");

            // Ativar flag para uso de dados de teste
            usarDadosDeTeste = true;

            // Criar dados de teste para desenvolvimento
            allEvents = [
                {
                    id: "teste-evento-1",
                    dataSaida: new Date(2023, 5, 15).toISOString(),
                    dataEntrada: new Date(2023, 5, 16).toISOString(),
                    odometroInicial: 10000,
                    odometroFinal: 10250,
                    status: "CONCLUIDO",
                    motorista: {
                        id: motoristaId,
                        nome: motoristaData.nome,
                        cpf: motoristaData.cpf
                    },
                    carro: {
                        id: "teste-carro-1",
                        modelo: "Fiat Uno",
                        placa: "ABC1234",
                        marca: "Fiat"
                    }
                },
                {
                    id: "teste-evento-2",
                    dataSaida: new Date(2023, 6, 20).toISOString(),
                    dataEntrada: new Date(2023, 6, 21).toISOString(),
                    odometroInicial: 10500,
                    odometroFinal: 10800,
                    status: "CONCLUIDO",
                    motorista: {
                        id: motoristaId,
                        nome: motoristaData.nome,
                        cpf: motoristaData.cpf
                    },
                    carro: {
                        id: "teste-carro-2",
                        modelo: "Honda Civic",
                        placa: "XYZ5678",
                        marca: "Honda"
                    }
                },
                {
                    id: "teste-evento-3",
                    dataSaida: new Date(2023, 7, 10).toISOString(),
                    odometroInicial: 11000,
                    status: "PENDENTE",
                    motorista: {
                        id: motoristaId,
                        nome: motoristaData.nome,
                        cpf: motoristaData.cpf
                    },
                    carro: {
                        id: "teste-carro-1",
                        modelo: "Fiat Uno",
                        placa: "ABC1234",
                        marca: "Fiat"
                    }
                }
            ];
            console.log("Dados de teste criados:", allEvents);
        } else {
            allEvents = await allEventsResponse.json();
        }

        console.log("Todos os eventos obtidos:", allEvents);

        // Filtrar eventos pelo ID do motorista
        let eventos = Array.isArray(allEvents)
            ? allEvents.filter(e =>
                (e.motorista && (e.motorista.id === motoristaId || e.motoristaId === motoristaId)) ||
                (e.motoristaId === motoristaId)
            )
            : [];

        eventosMotorista = eventos; // Salvar para uso em outras funções
        console.log(`Encontrados ${eventos.length} eventos para o motorista após filtragem`);

        // Debug: mostrar informações detalhadas dos eventos encontrados
        if (eventos.length > 0) {
            console.log("Detalhes dos eventos encontrados:");
            eventos.forEach(evento => {
                console.log(`Evento ID: ${evento.id}`);
                console.log(`  Status: ${evento.status}`);
                console.log(`  Data Saída: ${evento.dataSaida ? new Date(evento.dataSaida).toLocaleString() : 'N/A'}`);
                console.log(`  Carro: ${evento.carro ? evento.carro.modelo : 'N/A'} (${evento.carro ? evento.carro.placa : 'N/A'})`);
            });
        }

        // Aplicar filtros adicionais se necessário
        if (comFiltro) {
            if (filtroCarro) {
                const termoBusca = filtroCarro.toLowerCase().trim();
                console.log("Termo de busca para carro:", termoBusca);

                // Extrair modelo e placa se o formato for "Modelo (Placa)"
                let modeloBusca = termoBusca;
                let placaBusca = termoBusca;

                const formatoModeloPlaca = /^(.+?)\s*\((.+?)\)$/;
                const match = termoBusca.match(formatoModeloPlaca);
                if (match) {
                    modeloBusca = match[1].trim();
                    placaBusca = match[2].trim();
                    console.log("Buscando modelo:", modeloBusca, "e placa:", placaBusca);
                }

                eventos = eventos.filter(e => {
                    if (!e.carro) return false;

                    const modelo = (e.carro.modelo || '').toLowerCase();
                    const placa = (e.carro.placa || '').toLowerCase();

                    // Buscar correspondência no modelo ou na placa
                    const matchModelo = modelo.includes(modeloBusca);
                    const matchPlaca = placa.includes(placaBusca);

                    // Se o formato for "Modelo (Placa)", verificar correspondência específica
                    if (match) {
                        return matchModelo || matchPlaca;
                    } else {
                        // Caso contrário, verificar se o termo está em qualquer parte
                        return modelo.includes(termoBusca) || placa.includes(termoBusca);
                    }
                });

                registrarLog('Filtro por carro', { carro: filtroCarro, resultados: eventos.length });
            }

            if (filtroDataInicial) {
                try {
                    const dataInicial = new Date(filtroDataInicial);
                    console.log("Filtro por data inicial:", dataInicial.toISOString());

                    eventos = eventos.filter(e => {
                        if (!e.dataSaida) return false;

                        const dataSaida = new Date(e.dataSaida);
                        console.log(`Evento ${e.id}: Data saída:`, dataSaida.toISOString());

                        // Comparar apenas as datas (ignorando as horas)
                        const dataInicialSemHora = new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dataInicial.getDate());
                        const dataSaidaSemHora = new Date(dataSaida.getFullYear(), dataSaida.getMonth(), dataSaida.getDate());

                        return dataSaidaSemHora >= dataInicialSemHora;
                    });
                    registrarLog('Filtro por data inicial', { data: filtroDataInicial, resultados: eventos.length });
                } catch (error) {
                    console.error("Erro ao filtrar por data inicial:", error);
                }
            }

            if (filtroDataFinal) {
                try {
                    const dataFinal = new Date(filtroDataFinal);
                    console.log("Filtro por data final:", dataFinal.toISOString());

                    // Ajustar para o final do dia
                    dataFinal.setHours(23, 59, 59, 999);

                    eventos = eventos.filter(e => {
                        if (!e.dataSaida) return false;

                        const dataSaida = new Date(e.dataSaida);
                        console.log(`Evento ${e.id}: Data saída:`, dataSaida.toISOString());

                        // Comparar apenas as datas (ignorando as horas)
                        const dataFinalSemHora = new Date(dataFinal.getFullYear(), dataFinal.getMonth(), dataFinal.getDate(), 23, 59, 59);
                        const dataSaidaSemHora = new Date(dataSaida.getFullYear(), dataSaida.getMonth(), dataSaida.getDate());

                        return dataSaidaSemHora <= dataFinalSemHora;
                    });
                    registrarLog('Filtro por data final', { data: filtroDataFinal, resultados: eventos.length });
                } catch (error) {
                    console.error("Erro ao filtrar por data final:", error);
                }
            }

            if (filtroStatus) {
                eventos = eventos.filter(e =>
                    e.status && e.status.toUpperCase() === filtroStatus.toUpperCase()
                );
                registrarLog('Filtro por status', { status: filtroStatus, resultados: eventos.length });
            }

            console.log(`Após aplicar filtros, restaram ${eventos.length} eventos`);
        }

        // Atualizar dados da página
        atualizarEstatisticasEvento(eventos);
        renderizarListaEventos(eventos);

        // Se após aplicar filtros não encontrou nenhum evento, mostrar mensagem explicativa
        if (comFiltro && eventos.length === 0) {
            document.getElementById('eventos-lista').innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Nenhum evento encontrado com os filtros aplicados.
                            <br>
                            <small class="text-muted">Tente modificar os critérios de busca ou <a href="#" id="limpar-filtros-link">limpar os filtros</a>.</small>
                        </div>
                    </td>
                </tr>
            `;

            // Adicionar event listener para o link de limpar filtros
            document.getElementById('limpar-filtros-link').addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('btn-limpar-filtros').click();
            });
        }

        // Se não estamos filtrando, atualizar também as estatísticas gerais
        if (!comFiltro) {
            atualizarEstatisticasGerais(eventos);
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('eventos-lista').innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger">
                    Erro ao carregar eventos. Tente novamente mais tarde. Detalhes: ${error.message}
                </td>
            </tr>
        `;

        registrarLog('Erro ao carregar eventos do motorista', { erro: error.message });
        showErrorModal('Erro', 'Não foi possível carregar os eventos do motorista. Verifique o console para mais detalhes.');
    }
}

// Função para atualizar estatísticas de eventos na página
function atualizarEstatisticasEvento(eventos) {
    document.getElementById('eventos-total').textContent = eventos.length || '0';
    document.getElementById('eventos-concluidos').textContent = eventos.filter(e => e.status === 'CONCLUIDO').length || '0';
    document.getElementById('eventos-pendentes').textContent = eventos.filter(e => e.status === 'PENDENTE').length || '0';
    document.getElementById('eventos-cancelados').textContent = eventos.filter(e => e.status === 'CANCELADO').length || '0';
}

// Função para atualizar estatísticas gerais na página
function atualizarEstatisticasGerais(eventos) {
    // Total de eventos
    document.getElementById('total-eventos').textContent = eventos.length || '0';

    // Último evento
    let ultimaData = null;
    eventos.forEach(evento => {
        if (evento.dataSaida) {
            const dataSaida = new Date(evento.dataSaida);
            if (!ultimaData || dataSaida > ultimaData) {
                ultimaData = dataSaida;
            }
        }
    });
    document.getElementById('ultimo-evento').textContent = ultimaData
        ? ultimaData.toLocaleDateString('pt-BR')
        : 'N/A';
}

// Função para renderizar a lista de eventos
function renderizarListaEventos(eventos) {
    const tbody = document.getElementById('eventos-lista');
    tbody.innerHTML = '';

    if (!eventos || eventos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Nenhum evento encontrado para este motorista.
                        <br>
                        <small class="text-muted">Os eventos aparecerão aqui quando este motorista utilizar algum veículo.</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    console.log(`Renderizando ${eventos.length} eventos`);

    // Ordenar eventos por data (mais recentes primeiro)
    const eventosOrdenados = [...eventos].sort((a, b) => {
        const dataA = a.dataSaida ? new Date(a.dataSaida) : new Date(0);
        const dataB = b.dataSaida ? new Date(b.dataSaida) : new Date(0);
        return dataB - dataA;
    });

    // Coletar todos os carros únicos para facilitar a filtragem
    const carrosUnicos = new Set();
    eventosOrdenados.forEach(evento => {
        if (evento.carro && evento.carro.modelo) {
            carrosUnicos.add(`${evento.carro.modelo} (${evento.carro.placa || 'Sem placa'})`);
        }
    });

    // Atualizar o datalist de sugestões para o filtro de carros, se existir
    const datalistCarros = document.getElementById('carros-sugestoes');
    if (datalistCarros) {
        datalistCarros.innerHTML = '';
        carrosUnicos.forEach(carro => {
            const option = document.createElement('option');
            option.value = carro;
            datalistCarros.appendChild(option);
        });
    }

    // Agrupar eventos por carro para visualização mais clara
    const eventosPorCarro = {};

    eventosOrdenados.forEach(evento => {
        // Identificador único para o carro
        const carroKey = evento.carro
            ? `${evento.carro.modelo || 'Sem modelo'} (${evento.carro.placa || 'Sem placa'})`
            : 'Carro Desconhecido';

        if (!eventosPorCarro[carroKey]) {
            eventosPorCarro[carroKey] = {
                carro: evento.carro || { modelo: 'Desconhecido', placa: 'Desconhecida' },
                eventos: []
            };
        }

        eventosPorCarro[carroKey].eventos.push(evento);
    });

    // Variável para controlar grupos de carros
    let grupoAtual = null;

    // Renderizar eventos na tabela, agrupando por carro
    Object.entries(eventosPorCarro).forEach(([carroKey, dados]) => {
        const { carro, eventos } = dados;

        // Criar uma linha de cabeçalho para o carro
        const trHeader = document.createElement('tr');
        trHeader.className = 'table-primary';

        // Calcular estatísticas do carro
        const totalEventos = eventos.length;
        const eventosConcluidos = eventos.filter(e => e.status === 'CONCLUIDO').length;
        const eventosPendentes = eventos.filter(e => e.status === 'PENDENTE').length;
        const eventosCancelados = eventos.filter(e => e.status === 'CANCELADO').length;

        // Calcular quilometragem total
        let kmTotal = 0;
        eventos.forEach(evento => {
            if (evento.odometroInicial !== undefined && evento.odometroFinal !== undefined) {
                const diff = evento.odometroFinal - evento.odometroInicial;
                if (diff > 0) kmTotal += diff;
            }
        });

        // Encontrar a data mais recente
        const ultimaData = eventos.reduce((maxDate, evento) => {
            if (!evento.dataSaida) return maxDate;
            const eventDate = new Date(evento.dataSaida);
            return !maxDate || eventDate > maxDate ? eventDate : maxDate;
        }, null);

        const ultimaDataFormatada = ultimaData
            ? ultimaData.toLocaleDateString('pt-BR')
            : 'N/A';

        trHeader.innerHTML = `
            <td colspan="8" class="py-2">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-car me-2"></i>
                        <strong>${carro.modelo || 'Sem modelo'}</strong>
                        <span class="badge bg-secondary ms-2">${carro.placa || 'Sem placa'}</span>
                        <span class="badge bg-primary ms-2">${totalEventos} evento${totalEventos !== 1 ? 's' : ''}</span>
                    </div>
                    <div>
                        <span class="badge bg-success me-1">${eventosConcluidos} concluído${eventosConcluidos !== 1 ? 's' : ''}</span>
                        <span class="badge bg-warning me-1">${eventosPendentes} pendente${eventosPendentes !== 1 ? 's' : ''}</span>
                        <span class="badge bg-danger me-1">${eventosCancelados} cancelado${eventosCancelados !== 1 ? 's' : ''}</span>
                        <small class="text-muted ms-2">Último uso: ${ultimaDataFormatada}</small>
                        ${kmTotal > 0 ? `<small class="text-muted ms-2">${kmTotal.toLocaleString('pt-BR')} km percorridos</small>` : ''}
                        ${carro.id ? `
                        <a href="../carro/HistoricoEventosCarro.html?id=${carro.id}" class="btn btn-sm btn-outline-primary ms-2">
                            <i class="fas fa-history me-1"></i> Histórico
                        </a>` : ''}
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(trHeader);

        // Renderizar cada evento deste carro
        eventos.forEach((evento, index) => {
            try {
                const tr = document.createElement('tr');

                // Segurança para evitar erros com propriedades indefinidas
                evento = evento || {};

                console.log(`Renderizando evento ${index + 1}:`, evento.id || 'ID desconhecido');

                // Formatar datas com tratamento de erro
                let dataSaida = 'N/A';
                let dataEntrada = 'N/A';
                try {
                    dataSaida = evento.dataSaida ? new Date(evento.dataSaida).toLocaleDateString('pt-BR') : 'N/A';
                } catch (e) {
                    console.error('Erro ao formatar dataSaida:', e);
                }
                try {
                    dataEntrada = evento.dataEntrada ? new Date(evento.dataEntrada).toLocaleDateString('pt-BR') : 'N/A';
                } catch (e) {
                    console.error('Erro ao formatar dataEntrada:', e);
                }

                // Formatar valores numéricos com tratamento de erro
                const kmInicial = evento.odometroInicial
                    ? evento.odometroInicial.toLocaleString('pt-BR')
                    : 'N/A';
                const kmFinal = evento.odometroFinal
                    ? evento.odometroFinal.toLocaleString('pt-BR')
                    : 'N/A';

                // Calcular distância percorrida
                let distancia = 'N/A';
                if (evento.odometroInicial !== undefined && evento.odometroFinal !== undefined) {
                    const diff = evento.odometroFinal - evento.odometroInicial;
                    if (diff > 0) {
                        distancia = `${diff.toLocaleString('pt-BR')} km`;
                    }
                }

                // Status badge
                let statusBadge = '<span class="badge bg-secondary">Desconhecido</span>';
                if (evento.status) {
                    if (evento.status.toUpperCase() === 'PENDENTE') {
                        statusBadge = '<span class="badge bg-warning">Pendente</span>';
                    } else if (evento.status.toUpperCase() === 'CONCLUIDO') {
                        statusBadge = '<span class="badge bg-success">Concluído</span>';
                    } else if (evento.status.toUpperCase() === 'CANCELADO') {
                        statusBadge = '<span class="badge bg-danger">Cancelado</span>';
                    }
                }

                // Botões de ação
                let acoesHtml = `
                    <button class="btn btn-info btn-sm visualizar-evento" data-id="${evento.id || ''}" title="Visualizar Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                `;

                // Adicionar botões de concluir e cancelar para eventos pendentes
                if (evento.status && evento.status.toUpperCase() === 'PENDENTE') {
                    acoesHtml = `
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-success concluir-evento" data-id="${evento.id || ''}" title="Concluir Evento">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-warning cancelar-evento" data-id="${evento.id || ''}" title="Cancelar Evento">
                                <i class="fas fa-ban"></i>
                            </button>
                            <button class="btn btn-info visualizar-evento" data-id="${evento.id || ''}" title="Visualizar Detalhes">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    `;
                }

                tr.innerHTML = `
                    <td>${evento.id ? evento.id.substring(0, 8) + '...' : 'N/A'}</td>
                    <td>${dataSaida}</td>
                    <td>${dataEntrada}</td>
                    <td>${kmInicial}</td>
                    <td>${kmFinal}</td>
                    <td>${distancia}</td>
                    <td>${statusBadge}</td>
                    <td>${acoesHtml}</td>
                `;

                tbody.appendChild(tr);
            } catch (error) {
                console.error('Erro ao renderizar evento:', error, evento);
                // Continuar com o próximo evento
            }
        });
    });

    // Adicionar listeners para os botões
    document.querySelectorAll('.visualizar-evento').forEach(button => {
        button.addEventListener('click', () => {
            const eventoId = button.getAttribute('data-id');
            visualizarDetalhesDoEvento(eventoId);
        });
    });

    // Adicionar listeners para o botão de concluir evento
    document.querySelectorAll('.concluir-evento').forEach(button => {
        button.addEventListener('click', () => {
            const eventoId = button.getAttribute('data-id');
            if (confirm('Deseja realmente concluir este evento?')) {
                concluirEvento(eventoId);
            }
        });
    });

    // Adicionar listeners para o botão de cancelar evento
    document.querySelectorAll('.cancelar-evento').forEach(button => {
        button.addEventListener('click', () => {
            const eventoId = button.getAttribute('data-id');
            if (confirm('Deseja realmente cancelar este evento?')) {
                cancelarEvento(eventoId);
            }
        });
    });
}

// Função para visualizar detalhes de um evento
async function visualizarDetalhesDoEvento(eventoId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showErrorModal('Erro', 'Usuário não autenticado');
            return;
        }

        console.log("Visualizando detalhes do evento ID:", eventoId);
        registrarLog('Visualização de detalhes do evento', { eventoId });

        // Primeiro, encontrar o evento na lista já carregada
        const eventoEncontrado = eventosMotorista.find(e => e.id === eventoId);

        if (eventoEncontrado) {
            registrarLog('Evento encontrado na lista atual', { eventoId });
            exibirModalDetalheEvento(eventoEncontrado);
            return;
        }

        // Se não encontrou na lista, tentar buscar da API
        console.log("Evento não encontrado na lista atual, buscando da API...");
        registrarLog('Evento não encontrado na lista, buscando da API', { eventoId });

        // Tentar diferentes endpoints possíveis
        const possiveisEndpoints = [
            `${API_BASE_URL}/eventos/${eventoId}`,
            `${API_BASE_URL}/evento/${eventoId}`
        ];

        let evento = null;
        let endpointUsado = null;

        for (const endpoint of possiveisEndpoints) {
            try {
                console.log("Tentando endpoint:", endpoint);

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    evento = await response.json();
                    endpointUsado = endpoint;
                    console.log("Evento encontrado:", evento);
                    registrarLog('Evento encontrado via API', { eventoId, endpoint });
                    break;
                }
            } catch (e) {
                console.log(`Erro ao tentar endpoint ${endpoint}:`, e);
            }
        }

        if (!evento) {
            registrarLog('Falha ao encontrar evento', { eventoId });
            throw new Error("Não foi possível obter os detalhes do evento");
        }

        // Exibir modal com os detalhes
        exibirModalDetalheEvento(evento);

    } catch (error) {
        console.error('Erro:', error);
        registrarLog('Erro ao visualizar detalhes do evento', { eventoId, erro: error.message });

        showErrorModal('Erro', `Não foi possível visualizar os detalhes do evento: ${error.message}`);
    }
}

// Função para exibir o modal com os detalhes do evento
function exibirModalDetalheEvento(evento) {
    // Verificar se já existe um modal, se existir, remover
    const modalExistente = document.getElementById('detalheEventoModal');
    if (modalExistente) {
        const modalInstance = bootstrap.Modal.getInstance(modalExistente);
        if (modalInstance) {
            modalInstance.hide();
        }
    }

    // Preparar o conteúdo do modal
    const modalBody = document.getElementById('detalheEventoBody');

    // Formatar informações
    const dataSaida = evento.dataSaida
        ? new Date(evento.dataSaida).toLocaleDateString('pt-BR') + ' ' + new Date(evento.dataSaida).toLocaleTimeString('pt-BR')
        : 'N/A';

    const dataEntrada = evento.dataEntrada
        ? new Date(evento.dataEntrada).toLocaleDateString('pt-BR') + ' ' + new Date(evento.dataEntrada).toLocaleTimeString('pt-BR')
        : 'N/A';

    const kmInicial = evento.odometroInicial
        ? evento.odometroInicial.toLocaleString('pt-BR') + ' km'
        : 'N/A';

    const kmFinal = evento.odometroFinal
        ? evento.odometroFinal.toLocaleString('pt-BR') + ' km'
        : 'N/A';

    /* Status com badge */
    let statusBadge = '<span class="badge bg-secondary">Desconhecido</span>';
    if (evento.status) {
        if (evento.status.toUpperCase() === 'PENDENTE') {
            statusBadge = '<span class="badge bg-warning">Pendente</span>';
        } else if (evento.status.toUpperCase() === 'CONCLUIDO') {
            statusBadge = '<span class="badge bg-success">Concluído</span>';
        } else if (evento.status.toUpperCase() === 'CANCELADO') {
            statusBadge = '<span class="badge bg-danger">Cancelado</span>';
        }
    }

    // Informações do veículo
    const veiculo = evento.carro
        ? `${evento.carro.modelo || 'N/A'} (${evento.carro.placa || 'N/A'})`
        : 'N/A';

    // Calcular distância percorrida
    let distancia = 'N/A';
    if (evento.odometroInicial !== undefined && evento.odometroFinal !== undefined) {
        const diff = evento.odometroFinal - evento.odometroInicial;
        distancia = `${diff.toLocaleString('pt-BR')} km`;
    }

    // Calcular duração
    let duracao = 'N/A';
    if (evento.dataSaida && evento.dataEntrada) {
        const inicio = new Date(evento.dataSaida);
        const fim = new Date(evento.dataEntrada);
        const diff = Math.abs(fim - inicio);
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (dias > 0) {
            duracao = `${dias} dia(s), ${horas} hora(s) e ${minutos} minuto(s)`;
        } else {
            duracao = `${horas} hora(s) e ${minutos} minuto(s)`;
        }
    }

    // Criar o conteúdo HTML
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header bg-primary text-white">
                        <i class="fas fa-car me-2"></i>
                        Informações do Veículo
                    </div>
                    <div class="card-body">
                        <p><strong>Veículo:</strong> ${veiculo}</p>
                        <p><strong>Placa:</strong> ${evento.carro?.placa || 'N/A'}</p>
                        <p><strong>Marca:</strong> ${evento.carro?.marca || 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header bg-success text-white">
                        <i class="fas fa-user me-2"></i>
                        Informações do Motorista
                    </div>
                    <div class="card-body">
                        <p><strong>Nome:</strong> ${motoristaData?.nome || 'N/A'}</p>
                        <p><strong>CPF:</strong> ${motoristaData?.cpf || 'N/A'}</p>
                        <p><strong>ID:</strong> ${motoristaData?.id || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mb-3">
            <div class="card-header bg-info text-white">
                <i class="fas fa-calendar-alt me-2"></i>
                Detalhes do Evento
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>ID do Evento:</strong> ${evento.id || 'N/A'}</p>
                        <p><strong>Status:</strong> ${statusBadge}</p>
                        <p><strong>Data de Saída:</strong> ${dataSaida}</p>
                        <p><strong>Data de Entrada:</strong> ${dataEntrada}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Odômetro Inicial:</strong> ${kmInicial}</p>
                        <p><strong>Odômetro Final:</strong> ${kmFinal}</p>
                        <p><strong>Distância Percorrida:</strong> ${distancia}</p>
                        <p><strong>Duração:</strong> ${duracao}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inicializar o modal Bootstrap
    const modal = new bootstrap.Modal(modalExistente);

    // Mostrar o modal
    modal.show();
}

// Função para mostrar modal de erro
function showErrorModal(title, message) {
    // Verificar se o Bootstrap está disponível
    if (typeof bootstrap === 'undefined') {
        // Fallback para alert se o Bootstrap não estiver disponível
        alert(`${title}: ${message}`);
        return;
    }

    // Remover modal existente se houver
    const existingModal = document.getElementById('errorModal');
    if (existingModal) {
        const modalInstance = bootstrap.Modal.getInstance(existingModal);
        if (modalInstance) {
            modalInstance.hide();
        }
    }

    // Atualizar o conteúdo do modal
    document.getElementById('errorModalTitle').textContent = title;
    document.getElementById('errorModalBody').textContent = message;

    // Inicializar o modal Bootstrap
    const modal = new bootstrap.Modal(existingModal);

    // Mostrar o modal
    modal.show();
}

// Função para mostrar modal de sucesso
function showSuccessModal(message) {
    // Verificar se o Bootstrap está disponível
    if (typeof bootstrap === 'undefined') {
        // Fallback para alert se o Bootstrap não estiver disponível
        alert(message);
        return;
    }

    // Remover modal existente se houver
    const existingModal = document.getElementById('successModal');
    if (existingModal) {
        const modalInstance = bootstrap.Modal.getInstance(existingModal);
        if (modalInstance) {
            modalInstance.hide();
        }
    }

    // Atualizar o conteúdo do modal
    document.getElementById('successMessage').textContent = message;

    // Inicializar o modal Bootstrap
    const modal = new bootstrap.Modal(existingModal);

    // Mostrar o modal
    modal.show();
}

// Função para concluir um evento
async function concluirEvento(eventoId) {
    // Implementar a lógica para concluir o evento
    // Por enquanto, apenas redirecionamos para a página de eventos
    window.location.href = `../evento/PainelEvento.html?concluir=${eventoId}`;
}

// Função para cancelar um evento
async function cancelarEvento(eventoId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showErrorModal('Erro', 'Usuário não autenticado');
            return;
        }

        console.log("Tentando cancelar evento:", eventoId);
        registrarLog('Tentativa de cancelar evento', { eventoId });

        const response = await fetch(`${API_BASE_URL}/evento/${eventoId}/cancelar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                motivoCancelamento: "Cancelado pelo usuário"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Verificar se o erro é devido a tentativa de cancelar um evento concluído
            if (data.error && data.error.includes("Não é possível cancelar um evento que já foi concluído")) {
                showErrorModal('Operação não permitida', 'Não é possível cancelar um evento que já foi concluído conforme regra de negócio.');
                return;
            }
            throw new Error(data.error || 'Erro ao cancelar evento');
        }

        showSuccessModal('Evento cancelado com sucesso!');

        // Recarregar eventos
        carregarEventosMotorista(true);
    } catch (error) {
        console.error('Erro:', error);
        registrarLog('Erro ao cancelar evento', { eventoId, erro: error.message });
        showErrorModal('Erro', `Não foi possível cancelar o evento: ${error.message}`);
    }
}
