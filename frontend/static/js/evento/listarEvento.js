document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const eventosLista = document.getElementById('eventos-lista');
    const filtroStatus = document.getElementById('filtro-evento-status');
    const filtroMotoristaNome = document.getElementById('filtro-motorista-nome');
    const filtroMotoristaId = document.getElementById('filtro-motorista-id');
    const filtroCarroNome = document.getElementById('filtro-carro-nome');
    const filtroCarroId = document.getElementById('filtro-carro-id');
    const listaMotoristas = document.getElementById('lista-motoristas');
    const listaCarros = document.getElementById('lista-carros');
    const filtroDataInicial = document.getElementById('filtro-data-inicial');
    const filtroDataFinal = document.getElementById('filtro-data-final');
    const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
    const btnLimparFiltros = document.getElementById('btn-limpar-filtros');

    // Armazenar dados para busca
    let motoristasData = [];
    let carrosData = [];

    // Carregar eventos iniciais e dados para os filtros
    carregarEventos();
    carregarMotoristas();
    carregarCarros();

    // Adicionar listeners para os campos de busca
    filtroMotoristaNome.addEventListener('input', function() {
        const motoristaEncontrado = motoristasData.find(m =>
            `${m.nome} (${m.cpf})` === this.value ||
            m.nome.toLowerCase().includes(this.value.toLowerCase())
        );

        if (motoristaEncontrado) {
            filtroMotoristaId.value = motoristaEncontrado.id;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            console.log(`Motorista encontrado: ID=${motoristaEncontrado.id}, Nome=${motoristaEncontrado.nome}`);
        } else {
            filtroMotoristaId.value = '';
            if (this.value) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                console.log(`Motorista não encontrado: "${this.value}"`);
            } else {
                this.classList.remove('is-invalid');
                this.classList.remove('is-valid');
            }
        }
    });

    filtroCarroNome.addEventListener('input', function() {
        const carroEncontrado = carrosData.find(c =>
            `${c.modelo} - ${c.placa}` === this.value ||
            c.modelo.toLowerCase().includes(this.value.toLowerCase()) ||
            c.placa.toLowerCase().includes(this.value.toLowerCase())
        );

        if (carroEncontrado) {
            filtroCarroId.value = carroEncontrado.id;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            console.log(`Carro encontrado: ID=${carroEncontrado.id}, Modelo=${carroEncontrado.modelo}, Placa=${carroEncontrado.placa}`);
        } else {
            filtroCarroId.value = '';
            if (this.value) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                console.log(`Carro não encontrado: "${this.value}"`);
            } else {
                this.classList.remove('is-invalid');
                this.classList.remove('is-valid');
            }
        }
    });

    // Adicionar listeners para botões
    btnAplicarFiltros.addEventListener('click', () => {
        // Verificar se há algum filtro preenchido
        const temFiltros = filtroStatus.value !== 'todos' ||
                          filtroMotoristaNome.value.trim() !== '' ||
                          filtroCarroNome.value.trim() !== '' ||
                          filtroDataInicial.value !== '' ||
                          filtroDataFinal.value !== '';

        if (!temFiltros) {
            alert('Por favor, selecione pelo menos um filtro antes de buscar.');
            return;
        }

        // Validar filtros de data
        if (!validarFiltros()) {
            return;
        }

        carregarEventos();
    });

    btnLimparFiltros.addEventListener('click', limparFiltros);

    // Função para validar os filtros de data
    function validarFiltros() {
        const dataInicial = filtroDataInicial.value;
        const dataFinal = filtroDataFinal.value;

        if (dataInicial && dataFinal && new Date(dataFinal) < new Date(dataInicial)) {
            alert('A data final deve ser maior ou igual à data inicial.');
            return false;
        }
        return true;
    }

    // Função para limpar todos os filtros
    function limparFiltros() {
        // Limpar todos os campos de filtro
        filtroStatus.value = 'todos';
        filtroMotoristaNome.value = '';
        filtroMotoristaId.value = '';
        filtroCarroNome.value = '';
        filtroCarroId.value = '';
        filtroDataInicial.value = '';
        filtroDataFinal.value = '';

        // Remover classes de validação
        filtroMotoristaNome.classList.remove('is-valid', 'is-invalid');
        filtroCarroNome.classList.remove('is-valid', 'is-invalid');

        // Recarregar eventos sem filtros
        carregarEventos();

        console.log("Todos os filtros foram limpos");
    }

    // Função para carregar os motoristas para o filtro
    async function carregarMotoristas() {
        try {
            console.log("Carregando lista de motoristas...");
            const response = await fetch('http://localhost:3000/api/motoristas', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar motoristas');
            }

            motoristasData = await response.json();
            console.log(`Motoristas carregados: ${motoristasData.length}`);

            // Limpar opções existentes
            listaMotoristas.innerHTML = '';

            // Adicionar opções de motoristas ao datalist
            motoristasData.forEach(motorista => {
                const option = document.createElement('option');
                option.value = `${motorista.nome} (${motorista.cpf})`;
                option.dataset.id = motorista.id;
                listaMotoristas.appendChild(option);
            });

            // Log para debug
            if (motoristasData.length > 0) {
                console.log("Primeiro motorista:", motoristasData[0]);
            }
        } catch (error) {
            console.error('Erro ao carregar motoristas:', error);
        }
    }

    // Função para carregar os carros para o filtro
    async function carregarCarros() {
        try {
            console.log("Carregando lista de carros...");
            const response = await fetch('http://localhost:3000/api/carros', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar carros');
            }

            carrosData = await response.json();
            console.log(`Carros carregados: ${carrosData.length}`);

            // Limpar opções existentes
            listaCarros.innerHTML = '';

            // Adicionar opções de carros ao datalist
            carrosData.forEach(carro => {
                const option = document.createElement('option');
                option.value = `${carro.modelo} - ${carro.placa}`;
                option.dataset.id = carro.id;
                listaCarros.appendChild(option);
            });

            // Log para debug
            if (carrosData.length > 0) {
                console.log("Primeiro carro:", carrosData[0]);
            }
        } catch (error) {
            console.error('Erro ao carregar carros:', error);
        }
    }

    async function carregarEventos() {
        try {
            // Mostrar indicador de carregamento
            eventosLista.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Carregando...</span>
                        </div>
                    </td>
                </tr>
            `;

            // Resumo dos filtros aplicados
            console.log("=== FILTROS APLICADOS ===");
            console.log("Status:", filtroStatus.value);
            console.log("Motorista:", filtroMotoristaNome.value, filtroMotoristaId.value);
            console.log("Carro:", filtroCarroNome.value, filtroCarroId.value);
            console.log("Data:", filtroDataInicial.value, filtroDataFinal.value);

            // Construir query params com filtros
            const params = new URLSearchParams();

            // Log do valor do status selecionado
            console.log("Valor do filtro status:", filtroStatus.value);

            // Filtro de status
            if (filtroStatus.value !== 'todos') {
                // Certifique-se de que o status está no formato correto para o backend
                params.append('status', filtroStatus.value);
                console.log(`Enviando status: ${filtroStatus.value}`);
            }

            // Filtro de motorista (por ID ou nome)
            if (filtroMotoristaId.value) {
                params.append('motoristaId', filtroMotoristaId.value);
                console.log(`Enviando motoristaId: ${filtroMotoristaId.value}`);
            } else if (filtroMotoristaNome.value.trim()) {
                // Remover informação do CPF, se presente
                let nomeBusca = filtroMotoristaNome.value.trim();
                // Remover o CPF entre parênteses, se existir: "Nome (12345678900)" -> "Nome"
                if (nomeBusca.includes('(')) {
                    nomeBusca = nomeBusca.split('(')[0].trim();
                }

                params.append('motoristaNome', nomeBusca);
                console.log(`Enviando motoristaNome: ${nomeBusca}`);
            }

            // Filtro de carro (por ID, modelo ou placa)
            if (filtroCarroId.value) {
                params.append('carroId', filtroCarroId.value);
                console.log(`Enviando carroId: ${filtroCarroId.value}`);
            } else if (filtroCarroNome.value.trim()) {
                // Verifica se é uma placa ou modelo
                if (filtroCarroNome.value.match(/[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/)) {
                    params.append('carroPlaca', filtroCarroNome.value.trim());
                    console.log(`Enviando carroPlaca: ${filtroCarroNome.value.trim()}`);
                } else {
                    params.append('carroNome', filtroCarroNome.value.trim());
                    console.log(`Enviando carroNome: ${filtroCarroNome.value.trim()}`);
                }
            }

            // Filtro de datas
            if (filtroDataInicial.value) {
                params.append('dataInicial', filtroDataInicial.value);
                console.log(`Enviando dataInicial: ${filtroDataInicial.value}`);
            }
            if (filtroDataFinal.value) {
                params.append('dataFinal', filtroDataFinal.value);
                console.log(`Enviando dataFinal: ${filtroDataFinal.value}`);
            }

            const url = `http://localhost:3000/api/eventos?${params}`;
            console.log(`Fazendo requisição para: ${url}`);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar eventos');
            }

            const eventos = await response.json();
            console.log(`Eventos recebidos: ${eventos.length}`);

            // Log para verificar os status dos eventos recebidos
            let eventosFiltrados = eventos;
            let filtradosLocalmente = false;

            if (eventos.length > 0) {
                const statusDosEventos = eventos.map(e => e.status);
                console.log("Status dos eventos recebidos:", statusDosEventos);

                // Filtro local por status se necessário
                if (filtroStatus.value !== 'todos') {
                    const countAntes = eventosFiltrados.length;
                    eventosFiltrados = eventosFiltrados.filter(e =>
                        e.status.toUpperCase() === filtroStatus.value.toUpperCase()
                    );
                    console.log(`Eventos após filtro de status (${filtroStatus.value}): ${eventosFiltrados.length}`);

                    if (eventosFiltrados.length !== countAntes) {
                        filtradosLocalmente = true;
                    }
                }

                // Filtro local por motorista (ID ou nome)
                if (filtroMotoristaId.value) {
                    const countAntes = eventosFiltrados.length;
                    console.log(`Aplicando filtro local por ID de motorista: ${filtroMotoristaId.value}`);
                    eventosFiltrados = eventosFiltrados.filter(e =>
                        e.motoristaId === filtroMotoristaId.value
                    );
                    console.log(`Eventos após filtro de motorista por ID: ${eventosFiltrados.length}`);

                    if (eventosFiltrados.length !== countAntes) {
                        filtradosLocalmente = true;
                    }
                } else if (filtroMotoristaNome.value) {
                    const countAntes = eventosFiltrados.length;
                    console.log(`Aplicando filtro local por nome de motorista: ${filtroMotoristaNome.value}`);
                    const nomeMotorista = filtroMotoristaNome.value.toLowerCase();
                    eventosFiltrados = eventosFiltrados.filter(e =>
                        e.motorista && e.motorista.nome &&
                        e.motorista.nome.toLowerCase().includes(nomeMotorista)
                    );
                    console.log(`Eventos após filtro de motorista por nome: ${eventosFiltrados.length}`);

                    if (eventosFiltrados.length !== countAntes) {
                        filtradosLocalmente = true;
                    }
                }

                // Filtro local por carro (ID, modelo ou placa)
                if (filtroCarroId.value) {
                    const countAntes = eventosFiltrados.length;
                    console.log(`Aplicando filtro local por ID de carro: ${filtroCarroId.value}`);
                    eventosFiltrados = eventosFiltrados.filter(e =>
                        e.carroId === filtroCarroId.value
                    );
                    console.log(`Eventos após filtro de carro por ID: ${eventosFiltrados.length}`);

                    if (eventosFiltrados.length !== countAntes) {
                        filtradosLocalmente = true;
                    }
                } else if (filtroCarroNome.value) {
                    const countAntes = eventosFiltrados.length;
                    console.log(`Aplicando filtro local por carro (modelo/placa): ${filtroCarroNome.value}`);
                    const textoCarro = filtroCarroNome.value.toLowerCase();
                    eventosFiltrados = eventosFiltrados.filter(e =>
                        (e.carro && e.carro.modelo && e.carro.modelo.toLowerCase().includes(textoCarro)) ||
                        (e.carro && e.carro.placa && e.carro.placa.toLowerCase().includes(textoCarro))
                    );
                    console.log(`Eventos após filtro de carro por texto: ${eventosFiltrados.length}`);

                    if (eventosFiltrados.length !== countAntes) {
                        filtradosLocalmente = true;
                    }
                }
            }

            // Adicionar informação sobre filtragem local
            if (filtradosLocalmente && eventosFiltrados.length > 0) {
                console.log("Filtragem local aplicada para refinar resultados");
            }

            // Remover contador de resultados anterior, se existir
            const contadorAnterior = document.querySelector('.alert-info.mb-2');
            if (contadorAnterior) {
                contadorAnterior.remove();
            }

            // Adicionar contador de resultados na tabela
            const headerResultados = document.createElement('div');
            headerResultados.className = 'alert alert-info mb-2';
            headerResultados.innerHTML = `
                <strong>${eventosFiltrados.length}</strong> evento(s) encontrado(s)
                ${filtradosLocalmente ? '<span class="badge bg-warning ms-2">Filtragem local aplicada</span>' : ''}
            `;

            const tabela = eventosLista.closest('.table-responsive');
            if (tabela && tabela.parentNode) {
                tabela.parentNode.insertBefore(headerResultados, tabela);
            }

            renderizarEventos(eventosFiltrados);

        } catch (error) {
            console.error('Erro:', error);
            eventosLista.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        Erro ao carregar eventos: ${error.message}
                    </td>
                </tr>
            `;
        }
    }

    // Helper function to format event ID
    function formatarIdEvento(id) {
        if (!id) return 'N/A';
        return '#' + id.substring(0, 5);
    }

    function renderizarEventos(eventos) {
        if (!eventos || !eventos.length) {
            // Mensagem personalizada baseada nos filtros aplicados
            let mensagem = 'Nenhum evento encontrado';

            if (filtroStatus.value !== 'todos' ||
                filtroMotoristaNome.value ||
                filtroCarroNome.value ||
                filtroDataInicial.value ||
                filtroDataFinal.value) {

                mensagem += ' com os filtros aplicados:<ul class="mt-2 text-start">';

                if (filtroStatus.value !== 'todos') {
                    mensagem += `<li>Status: ${traduzirStatus(filtroStatus.value)}</li>`;
                }

                if (filtroMotoristaNome.value) {
                    mensagem += `<li>Motorista: ${filtroMotoristaNome.value}</li>`;
                }

                if (filtroCarroNome.value) {
                    mensagem += `<li>Carro: ${filtroCarroNome.value}</li>`;
                }

                if (filtroDataInicial.value || filtroDataFinal.value) {
                    mensagem += '<li>Período: ';
                    if (filtroDataInicial.value) mensagem += `de ${filtroDataInicial.value} `;
                    if (filtroDataFinal.value) mensagem += `até ${filtroDataFinal.value}`;
                    mensagem += '</li>';
                }

                mensagem += '</ul>';
                mensagem += '<button class="btn btn-sm btn-outline-secondary mt-2" id="btn-limpar-filtros-inline">Limpar Filtros</button>';
            }

            eventosLista.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">${mensagem}</td>
                </tr>
            `;

            // Adicionar listener para o botão de limpar filtros inline
            const btnLimparFiltrosInline = document.getElementById('btn-limpar-filtros-inline');
            if (btnLimparFiltrosInline) {
                btnLimparFiltrosInline.addEventListener('click', limparFiltros);
            }

            return;
        }

        eventosLista.innerHTML = eventos.map(evento => {
            // Verificar se o evento e suas propriedades existem para evitar erros
            if (!evento || !evento.carro || !evento.motorista) {
                console.error('Evento com dados incompletos:', evento);
                return `
                    <tr>
                        <td colspan="7" class="text-center text-danger">
                            Evento com dados incompletos
                        </td>
                    </tr>
                `;
            }

            return `
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
                        <span class="badge ${getBadgeClassForStatus(evento.status)}">
                            <a href="../motorista/DetalheMotorista.html?id=${evento.motorista.id}" class="text-white text-decoration-none">
                                ${evento.motorista.nome || 'N/A'}
                            </a>
                        </span>
                        <small>${formatarCPF(evento.motorista.cpf) || 'N/A'}</small>
                    </div>
                </td>
                <td>${evento.dataSaida ? formatarData(evento.dataSaida) : 'N/A'}</td>
                <td>${evento.dataEntrada ? formatarData(evento.dataEntrada) : '-'}</td>
                <td>
                    <span class="badge ${getBadgeClassForStatus(evento.status)}">
                        ${traduzirStatus(evento.status)}
                    </span>
                </td>
                <td>
                    ${getBotoesAcao(evento)}
                </td>
            </tr>
        `;
        }).join('');

        // Adicionar event listeners para os botões de ação
        adicionarEventListeners();
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

    function getBotoesAcao(evento) {
        // Normalizar o status para maiúsculas para comparação
        const statusNormalizado = evento.status ? evento.status.toUpperCase() : '';

        if (statusNormalizado === 'PENDENTE') {
            return `
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-success concluir-evento" data-id="${evento.id}" title="Concluir Evento">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-warning cancelar-evento" data-id="${evento.id}" title="Cancelar Evento">
                        <i class="fas fa-ban"></i>
                    </button>
                    <button class="btn btn-danger deletar-evento" data-id="${evento.id}" title="Deletar Evento">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else if (statusNormalizado === 'CONCLUIDO') {
            return `
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-warning cancelar-evento" data-id="${evento.id}" title="Cancelar Evento">
                        <i class="fas fa-ban"></i>
                    </button>
                    <button class="btn btn-info visualizar-evento" data-id="${evento.id}" title="Visualizar Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
        }
        return `
            <button class="btn btn-info btn-sm visualizar-evento" data-id="${evento.id}" title="Visualizar Detalhes">
                <i class="fas fa-eye"></i>
            </button>
        `;
    }

    function adicionarEventListeners() {
        // Botões de concluir evento
        document.querySelectorAll('.concluir-evento').forEach(btn => {
            btn.addEventListener('click', () => {
                const eventoId = btn.getAttribute('data-id');
                const modal = new bootstrap.Modal(document.getElementById('modalConcluirEvento'));
                document.getElementById('eventoId').value = eventoId;
                modal.show();
            });
        });

        // Botões de cancelar evento
        document.querySelectorAll('.cancelar-evento').forEach(btn => {
            btn.addEventListener('click', async () => {
                const eventoId = btn.getAttribute('data-id');
                if (confirm('Tem certeza que deseja cancelar este evento?')) {
                    await cancelarEvento(eventoId);
                }
            });
        });

        // Botões de deletar evento
        document.querySelectorAll('.deletar-evento').forEach(btn => {
            btn.addEventListener('click', async () => {
                const eventoId = btn.getAttribute('data-id');
                if (confirm('Tem certeza que deseja deletar este evento?')) {
                    await deletarEvento(eventoId);
                }
            });
        });

        // Botões de visualizar evento
        document.querySelectorAll('.visualizar-evento').forEach(btn => {
            btn.addEventListener('click', () => {
                const eventoId = btn.getAttribute('data-id');
                visualizarEvento(eventoId);
            });
        });
    }

    async function deletarEvento(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/evento/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar evento');
            }

            alert('Evento deletado com sucesso!');
            carregarEventos();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao deletar evento: ' + error.message);
        }
    }

    async function visualizarEvento(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/evento/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar detalhes do evento');
            }

            const evento = await response.json();

            // Helper function to safely update element content
            const updateElement = (id, value) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                } else {
                    console.warn(`Elemento não encontrado: ${id}`);
                }
            };

            // Update elements with null check
            updateElement('detalhe-evento-id', formatarIdEvento(evento.id));
            updateElement('detalhe-carro', `${evento.carro.modelo} - ${evento.carro.placa}`);
            updateElement('detalhe-motorista', evento.motorista.nome);
            updateElement('detalhe-data-saida', formatarData(evento.dataSaida));
            updateElement('detalhe-odometro-inicial', evento.odometroInicial);
            updateElement('detalhe-odometro-final', evento.odometroFinal || '-');
            updateElement('detalhe-status', traduzirStatus(evento.status));

            // Mostrar informações de pagamento se o evento estiver concluído
            const detalhePagamento = document.getElementById('detalhe-pagamento');
            if (detalhePagamento) {
                if (evento.pagamentos && evento.pagamentos.length > 0) {
                    const pagamento = evento.pagamentos[0];
                    updateElement('detalhe-valor', pagamento.valor.toFixed(2));
                    updateElement('detalhe-metodo', pagamento.metodoPagamento);
                    updateElement('detalhe-status-pagamento', pagamento.statusPagamento);
                    detalhePagamento.classList.remove('d-none');
                } else {
                    detalhePagamento.classList.add('d-none');
                }
            }

            // Mostrar botões de ação se o evento estiver pendente ou concluído
            const acoesEventoPendente = document.getElementById('acoes-evento-pendente');
            if (acoesEventoPendente) {
                if (evento.status && (evento.status.toUpperCase() === 'PENDENTE' || evento.status.toUpperCase() === 'CONCLUIDO')) {
                    acoesEventoPendente.classList.remove('d-none');

                    // Adicionar event listeners aos botões
                    const btnConcluir = document.getElementById('btn-concluir-modal');
                    if (btnConcluir) {
                        // Mostrar botão de concluir apenas para eventos pendentes
                        if (evento.status.toUpperCase() === 'PENDENTE') {
                            btnConcluir.classList.remove('d-none');
                            btnConcluir.addEventListener('click', () => {
                                // Fechar o modal de visualização
                                const modalVisualizar = bootstrap.Modal.getInstance(document.getElementById('modalVisualizarEvento'));
                                if (modalVisualizar) modalVisualizar.hide();

                                // Abrir o modal de conclusão
                                const modalConcluir = new bootstrap.Modal(document.getElementById('modalConcluirEvento'));
                                document.getElementById('eventoId').value = evento.id;
                                modalConcluir.show();
                            });
                        } else {
                            btnConcluir.classList.add('d-none');
                        }
                    }

                    const btnCancelar = document.getElementById('btn-cancelar-modal');
                    if (btnCancelar) {
                        // Mostrar botão de cancelar para eventos pendentes e concluídos
                        btnCancelar.classList.remove('d-none');
                        btnCancelar.addEventListener('click', async () => {
                            if (confirm('Tem certeza que deseja cancelar este evento?')) {
                                // Fechar o modal de visualização
                                const modalVisualizar = bootstrap.Modal.getInstance(document.getElementById('modalVisualizarEvento'));
                                if (modalVisualizar) modalVisualizar.hide();

                                // Cancelar o evento
                                await cancelarEvento(evento.id);
                            }
                        });
                    }
                } else {
                    acoesEventoPendente.classList.add('d-none');
                }
            }

            // Abrir o modal
            const modalElement = document.getElementById('modalVisualizarEvento');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            } else {
                throw new Error('Modal não encontrado');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar detalhes do evento: ' + error.message);
        }
    }

    async function cancelarEvento(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/evento/${id}/cancelar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
                    alert('Não é possível cancelar um evento que já foi concluído conforme regra de negócio.');
                    return;
                }
                throw new Error(data.error || 'Erro ao cancelar evento');
            }

            alert('Evento cancelado com sucesso!');
            carregarEventos();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cancelar evento: ' + error.message);
        }
    }
});
