// Função para carregar pagamentos do mês atual
async function carregarPagamentosDoMes() {
    try {
        // Calcular início e fim do mês atual
        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        const dataInicial = inicioMes.toISOString().split('T')[0];
        const dataFinal = fimMes.toISOString().split('T')[0];

        const response = await fetch(`http://localhost:3000/api/pagamentos?dataInicial=${dataInicial}&dataFinal=${dataFinal}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar pagamentos');
        }

        const pagamentos = await response.json();

        // Calcular estatísticas dos pagamentos
        const totalPagamentos = pagamentos.length;
        const pagamentosPendentes = pagamentos.filter(p => p.statusPagamento === 'PENDENTE').length;
        const pagamentosConcluidos = pagamentos.filter(p => p.statusPagamento === 'PAGO').length;

        // Calcular valor total
        const valorTotal = pagamentos.reduce((total, pagamento) => {
            // Somar apenas pagamentos com status PAGO
            if (pagamento.statusPagamento === 'PAGO') {
                return total + pagamento.valor;
            }
            return total;
        }, 0);

        // Criar elemento para exibir estatísticas de pagamentos
        const pagamentosStats = document.createElement('div');
        pagamentosStats.className = 'pagamentos-stats mt-3';
        pagamentosStats.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Pagamentos - ${formatarNomeMes(hoje.getMonth())}/${hoje.getFullYear()}</h5>
                </div>
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-md-4 mb-3">
                            <div class="d-flex flex-column">
                                <span class="fs-4 fw-bold text-primary">${totalPagamentos}</span>
                                <span class="text-muted">Total</span>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="d-flex flex-column">
                                <span class="fs-4 fw-bold text-success">${pagamentosConcluidos}</span>
                                <span class="text-muted">Pagos</span>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="d-flex flex-column">
                                <span class="fs-4 fw-bold text-warning">${pagamentosPendentes}</span>
                                <span class="text-muted">Pendentes</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-3">
                        <h5 class="text-success">R$ ${valorTotal.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}</h5>
                        <small class="text-muted">Valor total recebido no mês</small>
                    </div>
                    <div class="d-flex justify-content-end mt-3">
                        <a href="../pagamento/PainelPagamento.html" class="btn btn-sm btn-outline-primary">
                            Ver todos os pagamentos
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Inserir no dashboard
        const ultimoCard = document.querySelector('.card:last-child');
        if (ultimoCard && ultimoCard.parentNode) {
            ultimoCard.parentNode.parentNode.appendChild(pagamentosStats);
        }

        console.log('Pagamentos do mês carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar pagamentos do mês:', error);
    }
}

// Função para formatar o nome do mês
function formatarNomeMes(numeroMes) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return meses[numeroMes];
}
