document.addEventListener('DOMContentLoaded', () => {
    const formConcluirEvento = document.getElementById('form-concluir-evento');
    const eventoIdInput = document.getElementById('eventoId');
    const odometroFinalInput = document.getElementById('odometroFinal');
    const metodoPagamentoSelect = document.getElementById('metodoPagamento');

    // Verify if form exists before adding event listener
    if (formConcluirEvento) {
        formConcluirEvento.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const eventoData = {
                    eventoId: eventoIdInput?.value,
                    odometroFinal: Number(odometroFinalInput?.value) || 0,
                    metodoPagamento: metodoPagamentoSelect?.value
                };

                const response = await fetch('http://localhost:3000/api/evento', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(eventoData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erro ao concluir evento');
                }

                // Fechar o modal de conclusão
                const modalConcluir = bootstrap.Modal.getInstance(document.getElementById('modalConcluirEvento'));
                if (modalConcluir) modalConcluir.hide();

                // Mostrar o resumo
                await mostrarResumoEvento(data);

                // Recarregar a lista de eventos
                if (typeof carregarEventos === 'function') {
                    await carregarEventos();
                }

            } catch (error) {
                console.error('Erro:', error);
                alert(error.message || 'Erro ao concluir evento');
            }
        });
    }

    async function mostrarResumoEvento(data) {
        try {
            console.log('Dados recebidos:', data);
            const { evento, pagamento, relatorio } = data;

            if (!evento) {
                throw new Error('Dados do evento não encontrados');
            }

            // Função helper para verificar e formatar dados
            const atualizarElemento = (id, valor) => {
                const elemento = document.getElementById(id);
                if (elemento) {
                    elemento.textContent = valor;
                } else {
                    console.error(`Elemento não encontrado: ${id}`);
                }
            };

            // Função helper para atualizar badges
            const atualizarBadge = (id, html) => {
                const elemento = document.getElementById(id);
                if (elemento) {
                    elemento.innerHTML = html;
                } else {
                    console.error(`Elemento não encontrado: ${id}`);
                }
            };

            // Informações básicas do evento
            atualizarElemento('relatorio-evento-id', `ID do Evento: ${evento.id}`);
            atualizarElemento('relatorio-data-saida', formatarData(evento.dataSaida));
            atualizarElemento('relatorio-data-conclusao', formatarData(evento.dataEntrada));

            // Informações do motorista
            if (evento.motorista?.nome) {
                atualizarElemento('relatorio-motorista-info', `Motorista: ${evento.motorista.nome}`);
            }

            // Informações do veículo
            if (evento.carro) {
                const infoVeiculo = `${evento.carro.modelo} (${evento.carro.placa})`;
                atualizarElemento('relatorio-veiculo-info', infoVeiculo);
            }

            // Distância e valores
            const distancia = evento.odometroFinal - evento.odometroInicial;
            atualizarElemento('relatorio-distancia', `${distancia} km`);
            
            // Informações do pagamento
            if (pagamento) {
                const valorFormatado = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(pagamento.valor);
                
                atualizarElemento('relatorio-valor', valorFormatado);
                atualizarElemento('relatorio-metodo', formatarMetodoPagamento(pagamento.metodoPagamento));
                atualizarBadge('relatorio-status-pagamento', getStatusPagamentoBadge(pagamento.statusPagamento));
            }

            // Informações do relatório
            if (relatorio) {
                atualizarElemento('relatorio-numero', relatorio.id);
                atualizarElemento('relatorio-tipo', formatarTipoRelatorio(relatorio.tipo));
                atualizarBadge('relatorio-status', getStatusRelatorioBadge(relatorio.status));
            }

            // Gestor responsável
            if (evento.gestor?.nome) {
                atualizarElemento('relatorio-gestor-info', `Gestor Responsável: ${evento.gestor.nome}`);
            } else if (pagamento?.gestorId) {
                atualizarElemento('relatorio-gestor-info', `ID do Gestor: ${pagamento.gestorId}`);
            }

            // Mostrar o modal do relatório
            const modalRelatorio = new bootstrap.Modal(document.getElementById('modalRelatorioEvento'));
            modalRelatorio.show();

        } catch (error) {
            console.error('Erro ao mostrar resumo:', error);
            alert('Erro ao mostrar resumo do evento: ' + error.message);
        }
    }

    // Funções auxiliares de formatação
    function formatarData(data) {
        if (!data) return 'N/A';
        return new Date(data).toLocaleString('pt-BR');
    }

    function formatarMetodoPagamento(metodo) {
        const metodos = {
            'DINHEIRO': 'Dinheiro',
            'CARTAO_CREDITO': 'Cartão de Crédito',
            'CARTAO_DEBITO': 'Cartão de Débito',
            'PIX': 'PIX',
            'BOLETO': 'Boleto'
        };
        return metodos[metodo] || metodo || 'N/A';
    }

    function formatarTipoRelatorio(tipo) {
        const tipos = {
            'CONCLUSAO': 'Relatório de Conclusão',
            'CANCELAMENTO': 'Relatório de Cancelamento'
        };
        return tipos[tipo] || tipo || 'N/A';
    }

    function getStatusPagamentoBadge(status) {
        const badges = {
            'PENDENTE': '<span class="badge bg-warning">Pendente</span>',
            'CONFIRMADO': '<span class="badge bg-success">Confirmado</span>',
            'CANCELADO': '<span class="badge bg-danger">Cancelado</span>'
        };
        return badges[status] || `<span class="badge bg-secondary">${status || 'N/A'}</span>`;
    }

    function getStatusRelatorioBadge(status) {
        const badges = {
            'GERADO': '<span class="badge bg-success">Gerado</span>',
            'PENDENTE': '<span class="badge bg-warning">Pendente</span>',
            'ERRO': '<span class="badge bg-danger">Erro</span>'
        };
        return badges[status] || `<span class="badge bg-secondary">${status || 'N/A'}</span>`;
    }
});