document.addEventListener('DOMContentLoaded', () => {
    // Verificar a autenticação do usuário
    if (!localStorage.getItem('token')) {
        window.location.href = '../../index.html';
        return;
    }

    // Inicializar a página
    carregarPagamentos();

    // Configurar listeners para os filtros
    document.getElementById('filtro-pagamento-status').addEventListener('change', carregarPagamentos);
    document.getElementById('filtro-pagamento-metodo').addEventListener('change', carregarPagamentos);
    document.getElementById('filtro-data-inicio').addEventListener('change', carregarPagamentos);
    document.getElementById('filtro-data-fim').addEventListener('change', carregarPagamentos);

    // Configurar botão para adicionar novo pagamento
    document.getElementById('btn-novo-pagamento').addEventListener('click', abrirModalNovoPagamento);

    // Configurar o formulário de adicionar pagamento
    document.getElementById('formAddPagamento').addEventListener('submit', adicionarPagamento);
});

// Função para carregar pagamentos com filtros
async function carregarPagamentos() {
    try {
        const statusFiltro = document.getElementById('filtro-pagamento-status').value;
        const metodoFiltro = document.getElementById('filtro-pagamento-metodo').value;
        const dataInicioFiltro = document.getElementById('filtro-data-inicio').value;
        const dataFimFiltro = document.getElementById('filtro-data-fim').value;

        // Construir URL com filtros
        let url = 'http://localhost:3000/api/pagamentos?';
        const params = [];

        if (statusFiltro !== 'todos') {
            params.push(`status=${statusFiltro.toUpperCase()}`);
        }

        if (metodoFiltro !== 'todos') {
            params.push(`metodoPagamento=${metodoFiltro.toUpperCase()}`);
        }

        if (dataInicioFiltro) {
            params.push(`dataInicio=${dataInicioFiltro}`);
        }

        if (dataFimFiltro) {
            params.push(`dataFim=${dataFimFiltro}`);
        }

        url += params.join('&');

        console.log("URL de busca:", url);

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar pagamentos');
        }

        const pagamentos = await response.json();
        console.log("Pagamentos encontrados:", pagamentos.length);
        exibirPagamentosNaTabela(pagamentos);

    } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
        exibirMensagem('Erro ao carregar pagamentos', 'danger');
    }
}

// Função para exibir pagamentos na tabela
function exibirPagamentosNaTabela(pagamentos) {
    const tbody = document.getElementById('pagamentos-lista');
    tbody.innerHTML = '';

    if (pagamentos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum pagamento encontrado</td></tr>';
        return;
    }

    pagamentos.forEach(pagamento => {
        const row = document.createElement('tr');
        row.classList.add('pagamento-row');
        row.dataset.id = pagamento.id;
        row.style.cursor = 'pointer';

        // Formatar valor
        const valorFormatado = parseFloat(pagamento.valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Formatar data
        const data = new Date(pagamento.data);
        const dataFormatada = data.toLocaleDateString('pt-BR');

        // Formatar status
        let statusClass = '';
        switch (pagamento.statusPagamento) {
            case 'PAGO':
                statusClass = 'bg-success';
                break;
            case 'PENDENTE':
                statusClass = 'bg-warning';
                break;
            case 'CANCELADO':
                statusClass = 'bg-danger';
                break;
        }

        // Formatar método de pagamento
        let metodoPagamento = '';
        switch (pagamento.metodoPagamento) {
            case 'CARTAO':
                metodoPagamento = '<i class="fas fa-credit-card"></i> Cartão';
                break;
            case 'PIX':
                metodoPagamento = '<i class="fas fa-qrcode"></i> PIX';
                break;
            case 'DINHEIRO':
                metodoPagamento = '<i class="fas fa-money-bill"></i> Dinheiro';
                break;
            case 'BOLETO':
                metodoPagamento = '<i class="fas fa-file-invoice"></i> Boleto';
                break;
            default:
                metodoPagamento = pagamento.metodoPagamento;
        }

        row.innerHTML = `
            <td>${pagamento.id.substring(0, 8)}...</td>
            <td>Evento #${pagamento.eventoId ? pagamento.eventoId.substring(0, 8) : 'N/A'}</td>
            <td>${valorFormatado}</td>
            <td>${dataFormatada}</td>
            <td>${metodoPagamento}</td>
            <td><span class="badge ${statusClass}">${pagamento.statusPagamento}</span></td>
            <td>
                <button class="btn btn-sm btn-primary edit-pagamento" data-id="${pagamento.id}">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);

        // Adicionar evento de clique na linha para ver detalhes
        row.addEventListener('click', (e) => {
            // Ignorar se o clique foi em um botão
            if (e.target.closest('.btn')) return;

            abrirDetalhesPagamento(pagamento.id);
        });

        // Adicionar eventos para os botões
        row.querySelector('.edit-pagamento').addEventListener('click', () => {
            abrirEdicaoPagamento(pagamento.id);
        });
    });
}

// Função para abrir modal com detalhes do pagamento
async function abrirDetalhesPagamento(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/pagamentos/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar detalhes do pagamento');
        }

        const pagamento = await response.json();
        console.log("Dados do pagamento:", pagamento); // Log para debug

        // Formatar data
        const data = new Date(pagamento.data);
        const dataFormatada = data.toLocaleDateString('pt-BR');

        // Formatar valor
        const valorFormatado = parseFloat(pagamento.valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Criar o modal básico com informações do pagamento
        const modalHTML = `
            <div class="modal fade" id="modalDetalhesPagamento" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalhes do Pagamento</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Informações do Pagamento</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row mb-2">
                                                <div class="col-md-4 text-muted">ID:</div>
                                                <div class="col-md-8">${pagamento.id}</div>
                                            </div>
                                            <div class="row mb-2">
                                                <div class="col-md-4 text-muted">Valor:</div>
                                                <div class="col-md-8">${valorFormatado}</div>
                                            </div>
                                            <div class="row mb-2">
                                                <div class="col-md-4 text-muted">Data:</div>
                                                <div class="col-md-8">${dataFormatada}</div>
                                            </div>
                                            <div class="row mb-2">
                                                <div class="col-md-4 text-muted">Status:</div>
                                                <div class="col-md-8">
                                                    <span class="badge ${pagamento.statusPagamento === 'PAGO' ? 'bg-success' :
                                                                        pagamento.statusPagamento === 'PENDENTE' ? 'bg-warning' : 'bg-danger'}">
                                                        ${pagamento.statusPagamento}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="row mb-2">
                                                <div class="col-md-4 text-muted">Método:</div>
                                                <div class="col-md-8">${formatarMetodoPagamento(pagamento.metodoPagamento)}</div>
                                            </div>
                                            <div class="row mb-2">
                                                <div class="col-md-4 text-muted">ID do Evento:</div>
                                                <div class="col-md-8">${pagamento.eventoId || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Informações do Evento</h6>
                                        </div>
                                        <div class="card-body" id="evento-details">
                                            <div class="d-flex justify-content-center align-items-center h-100">
                                                <div class="spinner-border text-primary" role="status">
                                                    <span class="visually-hidden">Carregando...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Informações do Motorista</h6>
                                        </div>
                                        <div class="card-body" id="motorista-details">
                                            <div class="d-flex justify-content-center align-items-center h-100">
                                                <div class="spinner-border text-primary" role="status">
                                                    <span class="visually-hidden">Carregando...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Informações do Carro</h6>
                                        </div>
                                        <div class="card-body" id="carro-details">
                                            <div class="d-flex justify-content-center align-items-center h-100">
                                                <div class="spinner-border text-primary" role="status">
                                                    <span class="visually-hidden">Carregando...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary" id="btn-editar-pagamento" data-id="${pagamento.id}">Editar Pagamento</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal anterior se existir
        const modalAnterior = document.getElementById('modalDetalhesPagamento');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Adicionar modal ao DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Inicializar e abrir o modal
        const modal = new bootstrap.Modal(document.getElementById('modalDetalhesPagamento'));
        modal.show();

        // Adicionar evento ao botão de editar
        document.getElementById('btn-editar-pagamento').addEventListener('click', () => {
            modal.hide();
            abrirEdicaoPagamento(pagamento.id);
        });

        // Carregar informações adicionais de forma assíncrona
        carregarInformacoesAdicionais(pagamento);

    } catch (error) {
        console.error('Erro ao carregar detalhes do pagamento:', error);
        exibirMensagem('Erro ao carregar detalhes do pagamento', 'danger');
    }
}

// Função para carregar informações adicionais (evento, motorista, carro)
async function carregarInformacoesAdicionais(pagamento) {
    // Verificar se tem ID de evento no pagamento
    if (pagamento.eventoId) {
        try {
            // Tentar obter detalhes do evento
            console.log("Tentando buscar evento com ID:", pagamento.eventoId);

            // Verificar se o ID do evento é válido
            if (!pagamento.eventoId || pagamento.eventoId === "null" || pagamento.eventoId === "undefined") {
                throw new Error("ID do evento inválido");
            }

            // Buscar todos os eventos primeiro para verificar se o ID existe
            const todosEventosResponse = await fetch('http://localhost:3000/api/eventos', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (todosEventosResponse.ok) {
                const todosEventos = await todosEventosResponse.json();
                console.log("Total de eventos encontrados:", todosEventos.length);

                // Procurar o evento pelo ID
                const eventoEncontrado = todosEventos.find(e => e.id === pagamento.eventoId);

                if (eventoEncontrado) {
                    console.log("Evento encontrado na lista:", eventoEncontrado);

                    // Exibir informações do evento
                    document.getElementById('evento-details').innerHTML = `
                        <div class="row mb-2">
                            <div class="col-md-4 text-muted">ID:</div>
                            <div class="col-md-8">${eventoEncontrado.id}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4 text-muted">Tipo:</div>
                            <div class="col-md-8">${eventoEncontrado.tipoEvento || 'N/A'}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4 text-muted">Status:</div>
                            <div class="col-md-8">
                                <span class="badge ${eventoEncontrado.status === 'CONCLUIDO' ? 'bg-success' :
                                                   eventoEncontrado.status === 'PENDENTE' ? 'bg-warning' : 'bg-danger'}">
                                    ${eventoEncontrado.status || 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4 text-muted">Data de Saída:</div>
                            <div class="col-md-8">${eventoEncontrado.dataSaida ? new Date(eventoEncontrado.dataSaida).toLocaleDateString('pt-BR') : 'N/A'}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4 text-muted">Data de Entrada:</div>
                            <div class="col-md-8">${eventoEncontrado.dataEntrada ? new Date(eventoEncontrado.dataEntrada).toLocaleDateString('pt-BR') : 'N/A'}</div>
                        </div>
                    `;

                    // Verificar se o evento tem motorista associado
                    if (eventoEncontrado.motoristaId) {
                        try {
                            console.log("Tentando buscar motorista com ID:", eventoEncontrado.motoristaId);

                            // Buscar todos os motoristas primeiro
                            const todosMotoristasResponse = await fetch('http://localhost:3000/api/motoristas', {
                                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                            });

                            if (todosMotoristasResponse.ok) {
                                const todosMotoristas = await todosMotoristasResponse.json();
                                console.log("Total de motoristas encontrados:", todosMotoristas.length);

                                // Procurar o motorista pelo ID
                                const motoristaEncontrado = todosMotoristas.find(m => m.id === eventoEncontrado.motoristaId);

                                if (motoristaEncontrado) {
                                    console.log("Motorista encontrado na lista:", motoristaEncontrado);

                                    document.getElementById('motorista-details').innerHTML = `
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Nome:</div>
                                            <div class="col-md-8">${motoristaEncontrado.nome || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">CPF:</div>
                                            <div class="col-md-8">${motoristaEncontrado.cpf || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Habilitação:</div>
                                            <div class="col-md-8">${motoristaEncontrado.habilitacao || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Telefone:</div>
                                            <div class="col-md-8">${motoristaEncontrado.telefone || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Disponível:</div>
                                            <div class="col-md-8">
                                                <span class="badge ${motoristaEncontrado.disponivel ? 'bg-success' : 'bg-danger'}">
                                                    ${motoristaEncontrado.disponivel ? 'Sim' : 'Não'}
                                                </span>
                                            </div>
                                        </div>
                                    `;
                                } else {
                                    console.warn(`Motorista com ID ${eventoEncontrado.motoristaId} não encontrado na lista`);
                                    document.getElementById('motorista-details').innerHTML = `
                                        <p class="text-center text-muted">Motorista não encontrado (ID: ${eventoEncontrado.motoristaId})</p>
                                    `;
                                }
                            } else {
                                throw new Error("Não foi possível obter a lista de motoristas");
                            }
                        } catch (error) {
                            console.warn('Erro ao carregar motorista:', error);
                            document.getElementById('motorista-details').innerHTML = `
                                <p class="text-center text-muted">Erro ao carregar informações do motorista: ${error.message}</p>
                            `;
                        }
                    } else {
                        document.getElementById('motorista-details').innerHTML = `
                            <p class="text-center text-muted">Nenhum motorista associado a este evento</p>
                        `;
                    }

                    // Verificar se o evento tem carro associado
                    if (eventoEncontrado.carroId) {
                        try {
                            console.log("Tentando buscar carro com ID:", eventoEncontrado.carroId);

                            // Buscar todos os carros primeiro
                            const todosCarrosResponse = await fetch('http://localhost:3000/api/carros', {
                                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                            });

                            if (todosCarrosResponse.ok) {
                                const todosCarros = await todosCarrosResponse.json();
                                console.log("Total de carros encontrados:", todosCarros.length);

                                // Procurar o carro pelo ID
                                const carroEncontrado = todosCarros.find(c => c.id === eventoEncontrado.carroId);

                                if (carroEncontrado) {
                                    console.log("Carro encontrado na lista:", carroEncontrado);

                                    document.getElementById('carro-details').innerHTML = `
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Modelo:</div>
                                            <div class="col-md-8">${carroEncontrado.modelo || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Marca:</div>
                                            <div class="col-md-8">${carroEncontrado.marca || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Placa:</div>
                                            <div class="col-md-8">${carroEncontrado.placa || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Cor:</div>
                                            <div class="col-md-8">${carroEncontrado.cor || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Ano:</div>
                                            <div class="col-md-8">${carroEncontrado.ano || 'N/A'}</div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-4 text-muted">Disponível:</div>
                                            <div class="col-md-8">
                                                <span class="badge ${carroEncontrado.disponivel ? 'bg-success' : 'bg-danger'}">
                                                    ${carroEncontrado.disponivel ? 'Sim' : 'Não'}
                                                </span>
                                            </div>
                                        </div>
                                    `;
                                } else {
                                    console.warn(`Carro com ID ${eventoEncontrado.carroId} não encontrado na lista`);
                                    document.getElementById('carro-details').innerHTML = `
                                        <p class="text-center text-muted">Carro não encontrado (ID: ${eventoEncontrado.carroId})</p>
                                    `;
                                }
                            } else {
                                throw new Error("Não foi possível obter a lista de carros");
                            }
                        } catch (error) {
                            console.warn('Erro ao carregar carro:', error);
                            document.getElementById('carro-details').innerHTML = `
                                <p class="text-center text-muted">Erro ao carregar informações do carro: ${error.message}</p>
                            `;
                        }
                    } else {
                        document.getElementById('carro-details').innerHTML = `
                            <p class="text-center text-muted">Nenhum carro associado a este evento</p>
                        `;
                    }
                } else {
                    // Evento não encontrado na lista
                    console.warn(`Evento com ID ${pagamento.eventoId} não encontrado na lista de eventos`);
                    document.getElementById('evento-details').innerHTML = `
                        <p class="text-center text-muted">Evento não encontrado (ID: ${pagamento.eventoId})</p>
                    `;
                    document.getElementById('motorista-details').innerHTML = `
                        <p class="text-center text-muted">Informações do motorista não disponíveis</p>
                    `;
                    document.getElementById('carro-details').innerHTML = `
                        <p class="text-center text-muted">Informações do carro não disponíveis</p>
                    `;
                }
            } else {
                // Não foi possível obter a lista de eventos
                throw new Error("Não foi possível obter a lista de eventos");
            }
        } catch (error) {
            console.warn('Erro ao carregar detalhes do evento:', error);
            document.getElementById('evento-details').innerHTML = `
                <p class="text-center text-muted">Erro ao carregar informações do evento: ${error.message}</p>
            `;
            document.getElementById('motorista-details').innerHTML = `
                <p class="text-center text-muted">Informações do motorista não disponíveis</p>
            `;
            document.getElementById('carro-details').innerHTML = `
                <p class="text-center text-muted">Informações do carro não disponíveis</p>
            `;
        }
    } else {
        document.getElementById('evento-details').innerHTML = `
            <p class="text-center text-muted">Nenhum evento associado a este pagamento</p>
        `;
        document.getElementById('motorista-details').innerHTML = `
            <p class="text-center text-muted">Informações do motorista não disponíveis</p>
        `;
        document.getElementById('carro-details').innerHTML = `
            <p class="text-center text-muted">Informações do carro não disponíveis</p>
        `;
    }
}

// Função auxiliar para formatar o método de pagamento
function formatarMetodoPagamento(metodo) {
    switch (metodo) {
        case 'CARTAO':
            return '<i class="fas fa-credit-card"></i> Cartão';
        case 'PIX':
            return '<i class="fas fa-qrcode"></i> PIX';
        case 'DINHEIRO':
            return '<i class="fas fa-money-bill"></i> Dinheiro';
        case 'BOLETO':
            return '<i class="fas fa-file-invoice"></i> Boleto';
        default:
            return metodo;
    }
}

// Função para abrir modal de edição de pagamento
async function abrirEdicaoPagamento(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/pagamentos/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar detalhes do pagamento');
        }

        const pagamento = await response.json();
        console.log("Editando pagamento:", pagamento);

        // Buscar eventos disponíveis
        const eventosResponse = await fetch('http://localhost:3000/api/eventos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        let eventosOptions = '';
        if (eventosResponse.ok) {
            const eventos = await eventosResponse.json();
            eventos.forEach(evento => {
                const tipoEvento = evento.tipoEvento || 'N/A';
                const dataEvento = evento.dataSaida ? new Date(evento.dataSaida).toLocaleDateString('pt-BR') : 'N/A';
                const selected = evento.id === pagamento.eventoId ? 'selected' : '';
                eventosOptions += `<option value="${evento.id}" ${selected}>${tipoEvento} - ${dataEvento} (ID: ${evento.id.substring(0, 8)}...)</option>`;
            });
        } else {
            eventosOptions = `<option value="${pagamento.eventoId}" selected>Evento atual (ID: ${pagamento.eventoId.substring(0, 8)}...)</option>`;
        }

        // Criar modal HTML
        const modalHTML = `
            <div class="modal fade" id="modalEditarPagamento" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar Pagamento</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formEditarPagamento">
                                <div class="mb-3">
                                    <label for="edit-evento" class="form-label">Evento</label>
                                    <select class="form-select" id="edit-evento" required>
                                        ${eventosOptions}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="edit-valor" class="form-label">Valor</label>
                                    <input type="number" step="0.01" class="form-control" id="edit-valor" value="${pagamento.valor}" required />
                                </div>
                                <div class="mb-3">
                                    <label for="edit-status" class="form-label">Status</label>
                                    <select class="form-select" id="edit-status" required>
                                        <option value="PENDENTE" ${pagamento.statusPagamento === 'PENDENTE' ? 'selected' : ''}>Pendente</option>
                                        <option value="PAGO" ${pagamento.statusPagamento === 'PAGO' ? 'selected' : ''}>Pago</option>
                                        <option value="CANCELADO" ${pagamento.statusPagamento === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="edit-metodo" class="form-label">Método de Pagamento</label>
                                    <select class="form-select" id="edit-metodo" required>
                                        <option value="CARTAO" ${pagamento.metodoPagamento === 'CARTAO' ? 'selected' : ''}>Cartão</option>
                                        <option value="DINHEIRO" ${pagamento.metodoPagamento === 'DINHEIRO' ? 'selected' : ''}>Dinheiro</option>
                                        <option value="PIX" ${pagamento.metodoPagamento === 'PIX' ? 'selected' : ''}>PIX</option>
                                        <option value="BOLETO" ${pagamento.metodoPagamento === 'BOLETO' ? 'selected' : ''}>Boleto</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="edit-data" class="form-label">Data</label>
                                    <input type="date" class="form-control" id="edit-data" value="${pagamento.data.split('T')[0]}" required />
                                </div>
                                <input type="hidden" id="edit-pagamento-id" value="${pagamento.id}" />
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" id="btn-cancelar-pagamento">Cancelar Pagamento</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="submit" class="btn btn-primary" form="formEditarPagamento">Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal anterior se existir
        const modalAnterior = document.getElementById('modalEditarPagamento');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Adicionar modal ao DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Inicializar e abrir o modal
        const modal = new bootstrap.Modal(document.getElementById('modalEditarPagamento'));
        modal.show();

        // Adicionar evento ao botão de cancelar pagamento
        document.getElementById('btn-cancelar-pagamento').addEventListener('click', () => {
            cancelarPagamento(pagamento.id);
        });

        // Adicionar evento ao formulário
        document.getElementById('formEditarPagamento').addEventListener('submit', async (e) => {
            e.preventDefault();

            const pagamentoId = document.getElementById('edit-pagamento-id').value;
            const eventoId = document.getElementById('edit-evento').value;
            const valor = document.getElementById('edit-valor').value;
            const status = document.getElementById('edit-status').value;
            const metodo = document.getElementById('edit-metodo').value;
            const data = document.getElementById('edit-data').value;

            try {
                const response = await fetch(`http://localhost:3000/api/pagamentos/${pagamentoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        valor: parseFloat(valor),
                        statusPagamento: status,
                        metodoPagamento: metodo,
                        data: data,
                        eventoId: eventoId
                    })
                });

                if (!response.ok) {
                    throw new Error('Erro ao atualizar pagamento');
                }

                modal.hide();
                exibirMensagem('Pagamento atualizado com sucesso', 'success');
                carregarPagamentos();

            } catch (error) {
                console.error('Erro ao atualizar pagamento:', error);
                exibirMensagem('Erro ao atualizar pagamento', 'danger');
            }
        });

    } catch (error) {
        console.error('Erro ao carregar detalhes do pagamento:', error);
        exibirMensagem('Erro ao carregar detalhes do pagamento', 'danger');
    }
}

// Função para cancelar pagamento
async function cancelarPagamento(id) {
    if (confirm('Tem certeza que deseja cancelar este pagamento?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/pagamentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    statusPagamento: 'CANCELADO'
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao cancelar pagamento');
            }

            // Fechar modal de edição
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarPagamento'));
            if (modal) {
                modal.hide();
            }

            exibirMensagem('Pagamento cancelado com sucesso', 'success');
            carregarPagamentos();

        } catch (error) {
            console.error('Erro ao cancelar pagamento:', error);
            exibirMensagem('Erro ao cancelar pagamento', 'danger');
        }
    }
}

// Função para abrir modal de novo pagamento
async function abrirModalNovoPagamento() {
    try {
        // Buscar eventos disponíveis para associar ao pagamento
        const eventosResponse = await fetch('http://localhost:3000/api/eventos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!eventosResponse.ok) {
            throw new Error('Erro ao buscar eventos');
        }

        const eventos = await eventosResponse.json();

        if (eventos.length === 0) {
            exibirMensagem('Não há eventos disponíveis para associar ao pagamento', 'warning');
            return;
        }

        // Criar opções para o select de eventos
        let eventosOptions = '';
        eventos.forEach(evento => {
            const tipoEvento = evento.tipoEvento || 'N/A';
            const dataEvento = evento.dataSaida ? new Date(evento.dataSaida).toLocaleDateString('pt-BR') : 'N/A';
            eventosOptions += `<option value="${evento.id}">${tipoEvento} - ${dataEvento} (ID: ${evento.id.substring(0, 8)}...)</option>`;
        });

        // Criar modal HTML
        const modalHTML = `
            <div class="modal fade" id="modalAddPagamento" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Registrar Novo Pagamento</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formAddPagamento">
                                <div class="mb-3">
                                    <label for="evento" class="form-label">Evento</label>
                                    <select class="form-select" id="evento" required>
                                        ${eventosOptions}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="valor" class="form-label">Valor</label>
                                    <input type="number" step="0.01" class="form-control" id="valor" required />
                                </div>
                                <div class="mb-3">
                                    <label for="status" class="form-label">Status</label>
                                    <select class="form-select" id="status" required>
                                        <option value="PENDENTE">Pendente</option>
                                        <option value="PAGO">Pago</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="metodo" class="form-label">Método de Pagamento</label>
                                    <select class="form-select" id="metodo" required>
                                        <option value="CARTAO">Cartão</option>
                                        <option value="DINHEIRO">Dinheiro</option>
                                        <option value="PIX">PIX</option>
                                        <option value="BOLETO">Boleto</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="data" class="form-label">Data</label>
                                    <input type="date" class="form-control" id="data" value="${new Date().toISOString().split('T')[0]}" required />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary" form="formAddPagamento">Registrar Pagamento</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal anterior se existir
        const modalAnterior = document.getElementById('modalAddPagamento');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Adicionar modal ao DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Inicializar e abrir o modal
        const modal = new bootstrap.Modal(document.getElementById('modalAddPagamento'));
        modal.show();

    } catch (error) {
        console.error('Erro ao preparar modal de novo pagamento:', error);
        exibirMensagem('Erro ao preparar formulário de novo pagamento', 'danger');
    }
}

// Função para adicionar novo pagamento
async function adicionarPagamento(e) {
    e.preventDefault();

    const eventoId = document.getElementById('evento').value;
    const valor = document.getElementById('valor').value;
    const status = document.getElementById('status').value;
    const metodo = document.getElementById('metodo').value;
    const data = document.getElementById('data').value;

    try {
        // Enviar requisição para adicionar o pagamento
        const response = await fetch('http://localhost:3000/api/pagamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                valor: parseFloat(valor),
                statusPagamento: status,
                metodoPagamento: metodo,
                data: data,
                eventoId: eventoId
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar pagamento');
        }

        // Fechar modal e atualizar lista
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalAddPagamento'));
        modal.hide();

        exibirMensagem('Pagamento registrado com sucesso', 'success');
        carregarPagamentos();

    } catch (error) {
        console.error('Erro ao adicionar pagamento:', error);
        exibirMensagem('Erro ao registrar pagamento: ' + error.message, 'danger');
    }
}

