import { API_BASE_URL } from '../api.js';

const relatorioContainer = document.getElementById('relatorio-container');

async function fetchRelatorio() {
  relatorioContainer.innerHTML = `<div class="text-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Carregando...</span>
    </div>
    <p>Carregando relatório...</p>
  </div>`;

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Usuário não autenticado');

    const response = await fetch(`${API_BASE_URL}/relatorios/completo`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erro ao buscar relatório');
    const data = await response.json();
    renderRelatorio(data);
  } catch (err) {
    relatorioContainer.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
}

function renderRelatorio(relatorio) {
  if (!relatorio.length) {
    relatorioContainer.innerHTML = '<div class="alert alert-warning">Nenhum dado encontrado.</div>';
    return;
  }
  relatorioContainer.innerHTML = relatorio.map(item => `
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Gestor: ${item.gestor.nome} (${item.gestor.email})</h5>
      </div>
      <div class="card-body">
        <h6>Motoristas</h6>
        ${renderMotoristasTable(item.motoristas)}
        <h6 class="mt-4">Carros</h6>
        ${renderCarrosTable(item.carros)}
        <h6 class="mt-4">Eventos</h6>
        ${renderEventosTable(item.eventos)}
        <h6 class="mt-4">Pagamentos</h6>
        ${renderPagamentosTable(item.pagamentos)}
      </div>
    </div>
  `).join('');
}

function renderMotoristasTable(motoristas) {
  if (!motoristas.length) return '<p class="text-muted">Nenhum motorista.</p>';
  return `<div class="table-responsive"><table class="table table-sm table-bordered">
    <thead><tr><th>Nome</th><th>CPF</th><th>Telefone</th><th>Habilitação</th><th>Status</th></tr></thead>
    <tbody>
      ${motoristas.map(m => `
        <tr>
          <td>${m.nome}</td>
          <td>${m.cpf}</td>
          <td>${m.telefone || '-'}</td>
          <td>${m.habilitacao}</td>
          <td>${m.disponivel ? 'Disponível' : 'Indisponível'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
}

function renderCarrosTable(carros) {
  if (!carros.length) return '<p class="text-muted">Nenhum carro.</p>';
  return `<div class="table-responsive"><table class="table table-sm table-bordered">
    <thead><tr><th>Modelo</th><th>Marca</th><th>Placa</th><th>Ano</th><th>Status</th></tr></thead>
    <tbody>
      ${carros.map(c => `
        <tr>
          <td>${c.modelo}</td>
          <td>${c.marca}</td>
          <td>${c.placa}</td>
          <td>${c.ano}</td>
          <td>${c.disponivel ? 'Disponível' : 'Indisponível'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
}

function renderEventosTable(eventos) {
  if (!eventos.length) return '<p class="text-muted">Nenhum evento.</p>';
  return `<div class="table-responsive"><table class="table table-sm table-bordered">
    <thead><tr><th>Tipo</th><th>Status</th><th>Data Saída</th><th>Data Entrada</th><th>Carro</th><th>Motorista</th></tr></thead>
    <tbody>
      ${eventos.map(e => `
        <tr>
          <td>${e.tipoEvento}</td>
          <td>${e.status}</td>
          <td>${e.dataSaida ? new Date(e.dataSaida).toLocaleString() : '-'}</td>
          <td>${e.dataEntrada ? new Date(e.dataEntrada).toLocaleString() : '-'}</td>
          <td>${e.carro ? e.carro.modelo + ' - ' + e.carro.placa : '-'}</td>
          <td>${e.motorista ? e.motorista.nome : '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
}

function renderPagamentosTable(pagamentos) {
  if (!pagamentos.length) return '<p class="text-muted">Nenhum pagamento.</p>';
  return `<div class="table-responsive"><table class="table table-sm table-bordered">
    <thead><tr><th>Valor</th><th>Data</th><th>Status</th><th>Método</th><th>Evento</th></tr></thead>
    <tbody>
      ${pagamentos.map(p => `
        <tr>
          <td>R$ ${p.valor.toFixed(2)}</td>
          <td>${p.data ? new Date(p.data).toLocaleString() : '-'}</td>
          <td>${p.statusPagamento}</td>
          <td>${p.metodoPagamento}</td>
          <td>${p.evento ? (p.evento.carro.modelo + ' - ' + p.evento.carro.placa + ' / ' + p.evento.motorista.nome) : '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
}

fetchRelatorio();
