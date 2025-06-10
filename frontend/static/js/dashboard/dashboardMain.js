document.addEventListener('DOMContentLoaded', () => {
    // Verificar a autenticação do usuário
    if (!localStorage.getItem('token')) {
        window.location.href = '../../index.html';
        return;
    }

    // Inicializar todos os componentes do dashboard
    carregarResumoDashboard();
    carregarUltimosEventos();
    carregarCarrosDisponiveis();
    carregarMotoristasDisponiveis();
    carregarPagamentosDoMes();
    inicializarCalendario();

    // Atualizar o dashboard a cada 5 minutos
    setInterval(carregarResumoDashboard, 5 * 60 * 1000);
});

// Função para carregar o resumo do dashboard (cards)
async function carregarResumoDashboard() {
    try {
        // Carregar informações de carros
        const responseCarro = await fetch('http://localhost:3000/api/carros', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!responseCarro.ok) {
            throw new Error('Erro ao carregar carros');
        }

        const carros = await responseCarro.json();
        const carrosDisponiveis = carros.filter(carro => carro.disponivel);

        document.getElementById('total-carros').textContent = carros.length;
        document.getElementById('carros-disponiveis-count').textContent = carrosDisponiveis.length;

        // Carregar informações de motoristas
        const responseMotorista = await fetch('http://localhost:3000/api/motoristas', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!responseMotorista.ok) {
            throw new Error('Erro ao carregar motoristas');
        }

        const motoristas = await responseMotorista.json();
        const motoristasDisponiveis = motoristas.filter(motorista => motorista.disponivel);

        document.getElementById('total-motoristas').textContent = motoristas.length;
        document.getElementById('motoristas-disponiveis-count').textContent = motoristasDisponiveis.length;

        // Carregar informações de eventos ativos (pendentes)
        const responseEventos = await fetch('http://localhost:3000/api/eventos?status=PENDENTE', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!responseEventos.ok) {
            throw new Error('Erro ao carregar eventos');
        }

        const eventos = await responseEventos.json();
        document.getElementById('eventos-ativos').textContent = eventos.length;

        // Carregar informações de pagamentos pendentes
        const responsePagamentos = await fetch('http://localhost:3000/api/pagamentos?status=PENDENTE', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!responsePagamentos.ok) {
            throw new Error('Erro ao carregar pagamentos');
        }

        const pagamentosPendentes = await responsePagamentos.json();

        // Calcular início e fim do mês atual para obter todos os pagamentos do mês
        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        const dataInicial = inicioMes.toISOString().split('T')[0];
        const dataFinal = fimMes.toISOString().split('T')[0];

        // Buscar todos os pagamentos do mês atual
        const responsePagamentosMes = await fetch(`http://localhost:3000/api/pagamentos?dataInicial=${dataInicial}&dataFinal=${dataFinal}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!responsePagamentosMes.ok) {
            throw new Error('Erro ao carregar pagamentos do mês');
        }

        const pagamentosMes = await responsePagamentosMes.json();

        // Calcular valor total recebido no mês (apenas pagamentos com status PAGO)
        const valorTotalRecebido = pagamentosMes
            .filter(pagamento => pagamento.statusPagamento === 'PAGO')
            .reduce((total, pagamento) => total + pagamento.valor, 0);

        document.getElementById('pagamentos-pendentes').textContent = pagamentosPendentes.length;
        document.getElementById('valor-pagamentos').textContent = valorTotalRecebido.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        console.log('Dashboard atualizado com sucesso');
    } catch (error) {
        console.error('Erro ao carregar resumo do dashboard:', error);
    }
}
