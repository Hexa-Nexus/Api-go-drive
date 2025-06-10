import { API_BASE_URL } from "./api.js";

// Expor a função createEvento globalmente
window.createEvento = createEvento;
// Expor a função createEvento globalmente
window.createEvento = createEvento;
window.concludeEvento = concludeEvento;

document.addEventListener("DOMContentLoaded", function () {
  // Check authentication
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../pages/gestor/loginGestor.html";
    return;
  }

  // Set user name from localStorage
  const gestorName = localStorage.getItem("gestorName");
  if (gestorName) {
    document.getElementById("user-name").textContent = gestorName;
  }

  // Logout functionality
  document.getElementById("btn-logout").addEventListener("click", logout);
  document.getElementById("dropdown-logout").addEventListener("click", logout);

  // Initialize dashboard
  initDashboard();

  // Initialize tabs
  initCarrosTab();
  initMotoristasTab();
  initEventosTab();
  initPagamentosTab();
  initGestoresTab();

  // Initialize FullCalendar
  initCalendar();

  // Garantir que o botão de criar evento tem um listener
  const btnCriarEvento = document.getElementById("btn-criar-evento");
  if (btnCriarEvento) {
    console.log("Adicionando evento ao botão Criar Evento");
    btnCriarEvento.addEventListener("click", function (e) {
      console.log("Botão Criar Evento clicado", e);
      createEvento();
    });
  } else {
    console.error("Botão btn-criar-evento não encontrado!");
  }
});

// Add this to fix modal focus issues
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("hidden.bs.modal", function () {
    // Remove focus from any elements inside the modal
    document.activeElement.blur();
  });
});

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("gestorName");
  window.location.href = "../pages/gestor/loginGestor.html";
}

// API request helper with authentication
async function apiRequest(endpoint, method = "GET", data = null) {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        logout();
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      const errorData = await response.json();
      throw new Error(errorData.error || "Erro na requisição");
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

// Initialize main dashboard data
async function initDashboard() {
  try {
    // Get summary data
    const [carros, motoristas, eventos, pagamentos] = await Promise.all([
      apiRequest("/carros"),
      apiRequest("/motoristas"),
      apiRequest("/eventos"),
      apiRequest("/pagamentos"),
    ]);

    // Update cards with summary information
    updateDashboardSummary(carros, motoristas, eventos, pagamentos);

    // Update latest events table
    updateLatestEvents(eventos);

    // Update available cars and drivers tables
    updateAvailableCarros(carros);
    updateAvailableMotoristas(motoristas);
  } catch (error) {
    showAlert(
      "Erro ao carregar dados do dashboard: " + error.message,
      "danger"
    );
  }
}

function updateDashboardSummary(carros, motoristas, eventos, pagamentos) {
  // Update totals
  document.getElementById("total-carros").textContent = carros.length;
  document.getElementById("total-motoristas").textContent = motoristas.length;

  // Count available cars and drivers
  const carrosDisponiveis = carros.filter((carro) => carro.disponivel).length;
  const motoristasDisponiveis = motoristas.filter(
    (motorista) => motorista.disponivel
  ).length;

  document.getElementById("carros-disponiveis").textContent = carrosDisponiveis;
  document.getElementById("motoristas-disponiveis").textContent =
    motoristasDisponiveis;

  // Count active events (status = PENDENTE)
  const eventosAtivos = eventos.filter(
    (evento) => evento.status === "PENDENTE"
  ).length;
  document.getElementById("eventos-ativos").textContent = eventosAtivos;

  // Count pending payments and calculate total value
  const pagamentosPendentes = pagamentos.filter(
    (pagamento) => pagamento.statusPagamento === "PENDENTE"
  );
  document.getElementById("pagamentos-pendentes").textContent =
    pagamentosPendentes.length;

  const valorTotal = pagamentosPendentes.reduce(
    (total, pagamento) => total + pagamento.valor,
    0
  );
  document.getElementById("valor-pagamentos").textContent =
    valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function updateLatestEvents(eventos) {
  const tbody = document.getElementById("ultimos-eventos");
  tbody.innerHTML = "";

  // Sort by date (most recent first) and take first 5
  const latestEvents = eventos
    .sort((a, b) => new Date(b.dataSaida) - new Date(a.dataSaida))
    .slice(0, 5);

  if (latestEvents.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="6" class="text-center">Nenhum evento encontrado</td>';
    tbody.appendChild(tr);
    return;
  }

  latestEvents.forEach((evento) => {
    const tr = document.createElement("tr");

    // Format date
    const dataSaida = new Date(evento.dataSaida).toLocaleDateString("pt-BR");

    // Status badge
    let statusBadge;
    if (evento.status === "PENDENTE") {
      statusBadge = '<span class="badge badge-custom-warning">Pendente</span>';
    } else if (evento.status === "CONCLUIDO") {
      statusBadge = '<span class="badge badge-custom-success">Concluído</span>';
    } else {
      statusBadge = '<span class="badge badge-custom-danger">Cancelado</span>';
    }

    tr.innerHTML = `
            <td>${evento.id.substring(0, 8)}...</td>
            <td>${evento.carro?.modelo || "N/A"}</td>
            <td>${evento.motorista?.nome || "N/A"}</td>
            <td>${dataSaida}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action view-event" data-id="${
                  evento.id
                }">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });

  // Add event listeners for view buttons
  document.querySelectorAll(".view-event").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      viewEventDetails(id);
    });
  });
}

function updateAvailableCarros(carros) {
  const tbody = document.getElementById("carros-disponiveis-list");
  tbody.innerHTML = "";

  // Filter available cars and take first 5
  const availableCarros = carros
    .filter((carro) => carro.disponivel)
    .slice(0, 5);

  if (availableCarros.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="4" class="text-center">Nenhum carro disponível</td>';
    tbody.appendChild(tr);
    return;
  }

  availableCarros.forEach((carro) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${carro.modelo} (${carro.marca})</td>
            <td>${carro.placa}</td>
            <td>${carro.odometroAtual} km</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action create-event-with-car" data-id="${carro.id}">
                    <i class="fas fa-plus"></i> Criar Evento
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });

  // Add event listeners for create event buttons
  document.querySelectorAll(".create-event-with-car").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      openCreateEventModal(id);
    });
  });
}

function updateAvailableMotoristas(motoristas) {
  const tbody = document.getElementById("motoristas-disponiveis-list");
  tbody.innerHTML = "";

  // Filter available drivers and take first 5
  const availableMotoristas = motoristas
    .filter((motorista) => motorista.disponivel)
    .slice(0, 5);

  if (availableMotoristas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="4" class="text-center">Nenhum motorista disponível</td>';
    tbody.appendChild(tr);
    return;
  }

  availableMotoristas.forEach((motorista) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${motorista.nome}</td>
            <td>${motorista.habilitacao}</td>
            <td>${motorista.telefone}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action view-driver" data-id="${motorista.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });

  // Add event listeners for view buttons
  document.querySelectorAll(".view-driver").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      viewDriverDetails(id);
    });
  });
}

function initCalendar() {
  const calendarEl = document.getElementById("calendar");

  // Adicionar controles de navegação personalizados acima do calendário
  const calendarNavigation = document.createElement("div");
  calendarNavigation.className = "calendar-navigation mb-3";
  calendarNavigation.innerHTML = `
    <div class="d-flex justify-content-between align-items-center flex-wrap">
      <div class="btn-group mb-2">
        <button type="button" class="btn btn-outline-primary" id="btn-prev-year">
          <i class="fas fa-angle-double-left"></i> Ano Anterior
        </button>
        <button type="button" class="btn btn-outline-primary" id="btn-prev-3-months">
          <i class="fas fa-angle-left"></i> 3 Meses
        </button>
        <button type="button" class="btn btn-outline-primary" id="btn-prev-month">
          <i class="fas fa-angle-left"></i> Mês
        </button>
      </div>
      <div class="mb-2">
        <select id="month-selector" class="form-select form-select-sm d-inline-block" style="width: auto">
          <option value="0">Janeiro</option>
          <option value="1">Fevereiro</option>
          <option value="2">Março</option>
          <option value="3">Abril</option>
          <option value="4">Maio</option>
          <option value="5">Junho</option>
          <option value="6">Julho</option>
          <option value="7">Agosto</option>
          <option value="8">Setembro</option>
          <option value="9">Outubro</option>
          <option value="10">Novembro</option>
          <option value="11">Dezembro</option>
        </select>
        <select id="year-selector" class="form-select form-select-sm d-inline-block ms-2" style="width: auto">
          <!-- Anos serão adicionados dinamicamente via JavaScript -->
        </select>
        <button type="button" class="btn btn-sm btn-primary ms-2" id="btn-go-to-date">
          <i class="fas fa-calendar-check"></i> Ir
        </button>
      </div>
      <div class="btn-group mb-2">
        <button type="button" class="btn btn-outline-primary" id="btn-today">
          <i class="fas fa-calendar-day"></i> Hoje
        </button>
        <button type="button" class="btn btn-outline-primary" id="btn-next-month">
          <i class="fas fa-angle-right"></i> Mês
        </button>
      </div>
    </div>
  `;

  // Inserir os controles de navegação antes do calendário
  calendarEl.parentNode.insertBefore(calendarNavigation, calendarEl);

  // Inicializar o calendário
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "today",
      center: "title",
      right: "prev,next dayGridMonth,listMonth",
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      list: 'Lista'
    },
    locale: 'pt-br',
    height: "auto",
    navLinks: true, // can click day/week names to navigate views
    dayMaxEvents: true, // allow "more" link when too many events
    showNonCurrentDates: true, // show dates from other months
    fixedWeekCount: false, // don't always show 6 weeks
    events: function (info, successCallback, failureCallback) {
      // Calculate date range to include previous months
      const startDate = new Date(info.start);

      // Get events from the beginning of the year to include all past events
      const currentYear = new Date().getFullYear();
      const beginningOfYear = new Date(currentYear - 1, 0, 1); // January 1st of previous year

      // Format dates for API
      const formattedStartDate = beginningOfYear.toISOString().split('T')[0];
      const formattedEndDate = info.end.toISOString().split('T')[0];

      console.log(`Loading calendar events from ${formattedStartDate} to ${formattedEndDate}`);

      // Load events from API with date range
      apiRequest(`/eventos?dataInicial=${formattedStartDate}&dataFinal=${formattedEndDate}`)
        .then((eventos) => {
          console.log(`Loaded ${eventos.length} events for calendar`);

          const calendarEvents = eventos.map((evento) => {
            // Determine color based on status
            let color, textColor = '#fff';
            if (evento.status === "PENDENTE") {
              color = "#ffc107"; // warning/yellow
            } else if (evento.status === "CONCLUIDO") {
              color = "#28a745"; // success/green
            } else {
              color = "#dc3545"; // danger/red
            }

            // Format title to include more information
            const carroInfo = evento.carro ? `${evento.carro.modelo} (${evento.carro.placa})` : "Carro";
            const motoristaInfo = evento.motorista ? evento.motorista.nome : "Motorista";

            // Create event object
            return {
              id: evento.id,
              title: `${carroInfo} - ${motoristaInfo}`,
              start: evento.dataSaida,
              end: evento.dataEntrada || null,
              backgroundColor: color,
              borderColor: color,
              textColor: textColor,
              extendedProps: {
                status: evento.status,
                carroId: evento.carroId,
                motoristaId: evento.motoristaId,
                odometroInicial: evento.odometroInicial,
                odometroFinal: evento.odometroFinal
              }
            };
          });

          successCallback(calendarEvents);
        })
        .catch((error) => {
          console.error("Error loading calendar events:", error);
          failureCallback(error);
        });
    },
    eventClick: function (info) {
      // Show event details when an event is clicked
      viewEventDetails(info.event.id);
    },
    eventDidMount: function(info) {
      // Add tooltip with more information
      const evento = info.event;
      const status = evento.extendedProps.status;
      const statusText = status === "PENDENTE" ? "Pendente" :
                         status === "CONCLUIDO" ? "Concluído" : "Cancelado";

      // Create tooltip content
      const tooltipContent = `
        <div class="calendar-tooltip">
          <strong>${evento.title}</strong><br>
          <span>Status: ${statusText}</span><br>
          <span>Data: ${new Date(evento.start).toLocaleDateString('pt-BR')}</span>
          ${evento.end ? `<br><span>Até: ${new Date(evento.end).toLocaleDateString('pt-BR')}</span>` : ''}
        </div>
      `;

      // Initialize tooltip
      new bootstrap.Tooltip(info.el, {
        title: tooltipContent,
        html: true,
        placement: 'top',
        customClass: 'calendar-event-tooltip'
      });
    },
    datesSet: function(dateInfo) {
      // Atualizar os seletores de mês e ano quando a data do calendário mudar
      const currentDate = dateInfo.view.currentStart;
      const monthSelector = document.getElementById('month-selector');
      const yearSelector = document.getElementById('year-selector');

      if (monthSelector && yearSelector) {
        monthSelector.value = currentDate.getMonth();
        yearSelector.value = currentDate.getFullYear();
      }
    }
  });

  calendar.render();

  // Preencher o seletor de anos (do ano atual até 5 anos atrás)
  const yearSelector = document.getElementById('year-selector');
  if (yearSelector) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelector.appendChild(option);
    }
    yearSelector.value = currentYear;
  }

  // Definir o mês atual no seletor
  const monthSelector = document.getElementById('month-selector');
  if (monthSelector) {
    monthSelector.value = new Date().getMonth();
  }

  // Adicionar event listeners para os botões de navegação
  document.getElementById('btn-prev-year').addEventListener('click', function() {
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
    calendar.prev();
  });

  document.getElementById('btn-prev-3-months').addEventListener('click', function() {
    calendar.prev();
    calendar.prev();
    calendar.prev();
  });

  document.getElementById('btn-prev-month').addEventListener('click', function() {
    calendar.prev();
  });

  document.getElementById('btn-today').addEventListener('click', function() {
    calendar.today();
  });

  document.getElementById('btn-next-month').addEventListener('click', function() {
    calendar.next();
  });

  document.getElementById('btn-go-to-date').addEventListener('click', function() {
    const year = parseInt(document.getElementById('year-selector').value);
    const month = parseInt(document.getElementById('month-selector').value);
    calendar.gotoDate(new Date(year, month, 1));
  });

  // Add CSS for calendar tooltips and navigation
  const style = document.createElement('style');
  style.textContent = `
    .calendar-tooltip {
      font-size: 12px;
      padding: 4px;
    }
    .fc-event {
      cursor: pointer;
    }
    .fc-list-event-title {
      font-weight: bold;
    }
    .calendar-navigation {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 5px;
    }
  `;
  document.head.appendChild(style);

  // Expor o objeto calendar para uso global
  window.mainCalendar = calendar;
}

// CARROS TAB
function initCarrosTab() {
  loadCarros();

  // Add event listeners
  document
    .getElementById("btn-buscar-modelo")
    .addEventListener("click", searchCarrosByModelo);
  document
    .getElementById("btn-buscar-placa")
    .addEventListener("click", searchCarrosByPlaca);
  document
    .getElementById("filtro-disponibilidade")
    .addEventListener("change", filterCarrosByDisponibilidade);
  document
    .getElementById("btn-salvar-carro")
    .addEventListener("click", saveCarro);

  // Add validation to license plate field
  const placaInput = document.getElementById("carro-placa");
  if (placaInput) {
    placaInput.addEventListener('input', function() {
      // Convert to uppercase
      this.value = this.value.toUpperCase();

      // Validate format
      if (this.value && !validarPlaca(this.value)) {
        this.setCustomValidity("Formato de placa inválido! Use ABC1234 (padrão antigo) ou ABC1D23 (padrão Mercosul)");
        this.classList.add("is-invalid");
      } else {
        this.setCustomValidity("");
        this.classList.remove("is-invalid");
      }
    });
  }

  // Reset form when modal is closed
  document
    .getElementById("modalAddCarro")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("formAddCarro").reset();
    });
}

// Function to validate license plate format
function validarPlaca(placa) {
  // Brazilian standard format: ABC1234 or ABC1D23 (Mercosul)
  const placaRegexAntiga = /^[A-Z]{3}[0-9]{4}$/;
  const placaRegexMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;

  return placaRegexAntiga.test(placa) || placaRegexMercosul.test(placa);
}

async function loadCarros() {
  try {
    const carros = await apiRequest("/carros");
    renderCarrosList(carros);
  } catch (error) {
    showAlert("Erro ao carregar lista de carros: " + error.message, "danger");
  }
}

function renderCarrosList(carros) {
  const tbody = document.getElementById("carros-lista");
  tbody.innerHTML = "";

  if (carros.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="9" class="text-center">Nenhum carro encontrado</td>';
    tbody.appendChild(tr);
    return;
  }

  carros.forEach((carro) => {
    const tr = document.createElement("tr");

    // Status indicator
    const statusClass = carro.disponivel
      ? "status-disponivel"
      : "status-indisponivel";
    const statusText = carro.disponivel ? "Disponível" : "Em uso";

    tr.innerHTML = `
            <td>${carro.id.substring(0, 8)}...</td>
            <td>${carro.modelo}</td>
            <td>${carro.marca}</td>
            <td>${carro.placa}</td>
            <td>${carro.ano}</td>
            <td>${carro.cor}</td>
            <td>${carro.odometroAtual} km</td>
            <td><span class="status-indicator ${statusClass}"></span> ${statusText}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action edit-carro" data-id="${
                  carro.id
                }">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action delete-carro" data-id="${
                  carro.id
                }">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });

  // Add event listeners for edit and delete buttons
  addCarroButtonListeners();
}

function addCarroButtonListeners() {
  document.querySelectorAll(".edit-carro").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      editCarro(id);
    });
  });

  document.querySelectorAll(".delete-carro").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      deleteCarro(id);
    });
  });
}

async function saveCarro() {
  const modelo = document.getElementById("carro-modelo").value;
  const marca = document.getElementById("carro-marca").value;
  const ano = document.getElementById("carro-ano").value;
  const cor = document.getElementById("carro-cor").value;
  const placa = document.getElementById("carro-placa").value;
  const odometroAtual = document.getElementById("carro-odometro").value;
  const disponivel = document.getElementById("carro-disponivel").checked;

  // Validate license plate before submitting
  if (!validarPlaca(placa)) {
    showAlert("Formato de placa inválido! Use ABC1234 (padrão antigo) ou ABC1D23 (padrão Mercosul)", "danger");
    return;
  }

  // Validate odometer value is not negative
  if (parseInt(odometroAtual) < 0) {
    showAlert("O valor do odômetro não pode ser negativo.", "danger");
    return;
  }

  // Get gestor ID from token (you may need to decode JWT or get from localStorage)
  const gestorId = localStorage.getItem("gestorId");

  try {
    await apiRequest("/carros", "POST", {
      modelo,
      marca,
      ano: parseInt(ano),
      cor,
      placa: placa.toUpperCase(), // Ensure plate is uppercase
      odometroAtual: parseInt(odometroAtual),
      disponivel,
      gestorId,
    });

    // Close modal and reload cars
    bootstrap.Modal.getInstance(
      document.getElementById("modalAddCarro")
    ).hide();
    showAlert("Carro adicionado com sucesso!", "success");
    loadCarros();

    // Reload dashboard to update summary
    initDashboard();
  } catch (error) {
    showAlert("Erro ao adicionar carro: " + error.message, "danger");
  }
}

async function editCarro(id) {
  try {
    const carro = await apiRequest(`/carro/${id}`);

    // Populate form
    document.getElementById("carro-modelo").value = carro.modelo;
    document.getElementById("carro-marca").value = carro.marca;
    document.getElementById("carro-ano").value = carro.ano;
    document.getElementById("carro-cor").value = carro.cor;
    document.getElementById("carro-placa").value = carro.placa;
    document.getElementById("carro-odometro").value = carro.odometroAtual;
    document.getElementById("carro-disponivel").checked = carro.disponivel;

    // Change modal title and button
    document.getElementById("modalAddCarroLabel").textContent = "Editar Carro";
    const saveButton = document.getElementById("btn-salvar-carro");
    saveButton.textContent = "Salvar Alterações";

    // Change save function to update
    saveButton.onclick = async () => {
      await updateCarro(id);
    };

    // Show modal
    new bootstrap.Modal(document.getElementById("modalAddCarro")).show();
  } catch (error) {
    showAlert("Erro ao carregar dados do carro: " + error.message, "danger");
  }
}

async function updateCarro(id) {
  const modelo = document.getElementById("carro-modelo").value;
  const marca = document.getElementById("carro-marca").value;
  const ano = document.getElementById("carro-ano").value;
  const cor = document.getElementById("carro-cor").value;
  const placa = document.getElementById("carro-placa").value;
  const odometroAtual = document.getElementById("carro-odometro").value;
  const disponivel = document.getElementById("carro-disponivel").checked;

  // Validate license plate before submitting
  if (!validarPlaca(placa)) {
    showAlert("Formato de placa inválido! Use ABC1234 (padrão antigo) ou ABC1D23 (padrão Mercosul)", "danger");
    return;
  }

  // Validate odometer value is not negative
  if (parseInt(odometroAtual) < 0) {
    showAlert("O valor do odômetro não pode ser negativo.", "danger");
    return;
  }

  try {
    await apiRequest(`/carro/${id}`, "PUT", {
      modelo,
      marca,
      ano: parseInt(ano),
      cor,
      placa: placa.toUpperCase(), // Ensure plate is uppercase
      odometroAtual: parseInt(odometroAtual),
      disponivel,
    });

    // Close modal and reload cars
    bootstrap.Modal.getInstance(
      document.getElementById("modalAddCarro")
    ).hide();
    showAlert("Carro atualizado com sucesso!", "success");
    loadCarros();

    // Reset modal to add mode
    document.getElementById("modalAddCarroLabel").textContent =
      "Adicionar Novo Carro";
    document.getElementById("btn-salvar-carro").textContent = "Salvar";
    document.getElementById("btn-salvar-carro").onclick = saveCarro;

    // Reload dashboard to update summary
    initDashboard();
  } catch (error) {
    showAlert("Erro ao atualizar carro: " + error.message, "danger");
  }
}

async function deleteCarro(id) {
  if (!confirm("Tem certeza que deseja excluir este carro?")) {
    return;
  }

  try {
    await apiRequest(`/carro/${id}`, "DELETE");
    showAlert("Carro excluído com sucesso!", "success");
    loadCarros();

    // Reload dashboard to update summary
    initDashboard();
  } catch (error) {
    showAlert("Erro ao excluir carro: " + error.message, "danger");
  }
}

function searchCarrosByModelo() {
  const modelo = document.getElementById("busca-modelo").value.toLowerCase();

  // Filter cars in the table
  const rows = document.querySelectorAll("#carros-lista tr");

  rows.forEach((row) => {
    const modeloCell = row.cells[1];
    if (modeloCell) {
      const modeloText = modeloCell.textContent.toLowerCase();
      if (modeloText.includes(modelo) || modelo === "") {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
}

function searchCarrosByPlaca() {
  const placa = document.getElementById("busca-placa").value.toLowerCase();

  // Filter cars in the table
  const rows = document.querySelectorAll("#carros-lista tr");

  rows.forEach((row) => {
    const placaCell = row.cells[3];
    if (placaCell) {
      const placaText = placaCell.textContent.toLowerCase();
      if (placaText.includes(placa) || placa === "") {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
}

function filterCarrosByDisponibilidade() {
  const filter = document.getElementById("filtro-disponibilidade").value;

  // Filter cars in the table
  const rows = document.querySelectorAll("#carros-lista tr");

  rows.forEach((row) => {
    const statusCell = row.cells[7];
    if (statusCell) {
      const isDisponivel = statusCell.textContent.includes("Disponível");

      if (
        filter === "todos" ||
        (filter === "disponivel" && isDisponivel) ||
        (filter === "indisponivel" && !isDisponivel)
      ) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
}

// MOTORISTAS TAB
function initMotoristasTab() {
  loadMotoristas();

  // Add event listeners
  document
    .getElementById("btn-buscar-cpf")
    .addEventListener("click", searchMotoristasByCPF);
  document
    .getElementById("filtro-motorista-disponibilidade")
    .addEventListener("change", filterMotoristasByDisponibilidade);
  document
    .getElementById("btn-salvar-motorista")
    .addEventListener("click", saveMotorista);

  // Reset form when modal is closed
  document
    .getElementById("modalAddMotorista")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("formAddMotorista").reset();
    });
}

async function loadMotoristas() {
  try {
    const motoristas = await apiRequest("/motoristas");
    renderMotoristasList(motoristas);
  } catch (error) {
    showAlert(
      "Erro ao carregar lista de motoristas: " + error.message,
      "danger"
    );
  }
}

function renderMotoristasList(motoristas) {
  const tbody = document.getElementById("motoristas-lista");
  tbody.innerHTML = "";

  if (motoristas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="7" class="text-center">Nenhum motorista encontrado</td>';
    tbody.appendChild(tr);
    return;
  }

  motoristas.forEach((motorista) => {
    const tr = document.createElement("tr");

    // Status indicator
    const statusClass = motorista.disponivel
      ? "status-disponivel"
      : "status-indisponivel";
    const statusText = motorista.disponivel ? "Disponível" : "Em serviço";

    tr.innerHTML = `
            <td>${motorista.id.substring(0, 8)}...</td>
            <td>${motorista.nome}</td>
            <td>${motorista.cpf}</td>
            <td>${motorista.telefone}</td>
            <td>${motorista.habilitacao}</td>
            <td><span class="status-indicator ${statusClass}"></span> ${statusText}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action edit-motorista" data-id="${
                  motorista.id
                }">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action delete-motorista" data-id="${
                  motorista.id
                }">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });

  // Add event listeners for edit and delete buttons
  addMotoristaButtonListeners();
}

function addMotoristaButtonListeners() {
  document.querySelectorAll(".edit-motorista").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      editMotorista(id);
    });
  });

  document.querySelectorAll(".delete-motorista").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      deleteMotorista(id);
    });
  });
}

async function saveMotorista() {
  const nome = document.getElementById("motorista-nome").value;
  const cpf = document.getElementById("motorista-cpf").value;
  const telefone = document.getElementById("motorista-telefone").value;
  const habilitacao = document.getElementById("motorista-habilitacao").value;

  const gestorId = localStorage.getItem("gestorId");

  try {
    await apiRequest("/motorista", "POST", {
      nome,
      cpf,
      telefone,
      habilitacao,
      gestorId,
    });

    // Exibir mensagem de sucesso
    showAlert("Motorista cadastrado com sucesso!", "success");

    // Fechar modal e recarregar lista
    bootstrap.Modal.getInstance(
      document.getElementById("modalAddMotorista")
    ).hide();
    loadMotoristas();
  } catch (error) {
    // Exibir mensagem de erro
    showAlert("Erro ao cadastrar motorista: " + error.message, "danger");
  }
}

async function editMotorista(id) {
  try {
    const motorista = await apiRequest(`/motorista/${id}`);

    // Populate form
    document.getElementById("motorista-nome").value = motorista.nome;
    document.getElementById("motorista-cpf").value = motorista.cpf;
    document.getElementById("motorista-telefone").value = motorista.telefone;
    document.getElementById("motorista-habilitacao").value =
      motorista.habilitacao;

    // Change modal title and button
    document.getElementById("modalAddMotoristaLabel").textContent =
      "Editar Motorista";
    const saveButton = document.getElementById("btn-salvar-motorista");
    saveButton.textContent = "Salvar Alterações";

    // Change save function to update
    saveButton.onclick = async () => {
      await updateMotorista(id);
    };

    // Show modal
    new bootstrap.Modal(document.getElementById("modalAddMotorista")).show();
  } catch (error) {
    showAlert(
      "Erro ao carregar dados do motorista: " + error.message,
      "danger"
    );
  }
}

async function updateMotorista(id) {
  const nome = document.getElementById("motorista-nome").value;
  const telefone = document.getElementById("motorista-telefone").value;
  const habilitacao = document.getElementById("motorista-habilitacao").value;

  try {
    await apiRequest(`/motorista/${id}`, "PUT", {
      nome,
      telefone,
      habilitacao,
    });

    // Close modal and reload drivers
    bootstrap.Modal.getInstance(
      document.getElementById("modalAddMotorista")
    ).hide();
    showAlert("Motorista atualizado com sucesso!", "success");
    loadMotoristas();

    // Reset modal to add mode
    document.getElementById("modalAddMotoristaLabel").textContent =
      "Adicionar Novo Motorista";
    document.getElementById("btn-salvar-motorista").textContent = "Salvar";
    document.getElementById("btn-salvar-motorista").onclick = saveMotorista;

    // Reload dashboard to update summary
    initDashboard();
  } catch (error) {
    showAlert("Erro ao atualizar motorista: " + error.message, "danger");
  }
}

async function deleteMotorista(id) {
  if (!confirm("Tem certeza que deseja excluir este motorista?")) {
    return;
  }

  try {
    await apiRequest(`/motorista/${id}`, "DELETE");
    showAlert("Motorista excluído com sucesso!", "success");
    loadMotoristas();

    // Reload dashboard to update summary
    initDashboard();
  } catch (error) {
    showAlert("Erro ao excluir motorista: " + error.message, "danger");
  }
}

function searchMotoristasByCPF() {
  const cpf = document
    .getElementById("busca-cpf")
    .value.toLowerCase()
    .replace(/\D/g, "");

  if (!cpf) {
    loadMotoristas();
    return;
  }

  // Use the API endpoint to search by CPF
  apiRequest("/motorista", "GET", { cpf })
    .then((motorista) => {
      if (motorista) {
        renderMotoristasList([motorista]);
      } else {
        document.getElementById("motoristas-lista").innerHTML =
          '<tr><td colspan="7" class="text-center">Nenhum motorista encontrado com este CPF</td></tr>';
      }
    })
    .catch((error) => {
      showAlert("Erro ao buscar motorista: " + error.message, "danger");
    });
}

function filterMotoristasByDisponibilidade() {
  const filter = document.getElementById(
    "filtro-motorista-disponibilidade"
  ).value;

  // Filter drivers in the table
  const rows = document.querySelectorAll("#motoristas-lista tr");

  rows.forEach((row) => {
    const statusCell = row.cells[5];
    if (statusCell) {
      const isDisponivel = statusCell.textContent.includes("Disponível");

      if (
        filter === "todos" ||
        (filter === "disponivel" && isDisponivel) ||
        (filter === "indisponivel" && !isDisponivel)
      ) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
}

// EVENTOS TAB
function initEventosTab() {
  loadEventos();
  loadCombos();

  // Add event listeners
  document
    .getElementById("filtro-evento-status")
    .addEventListener("change", filterEventosByStatus);
  document
    .getElementById("filtro-data-inicial")
    .addEventListener("change", filterEventosByDate);
  document
    .getElementById("filtro-data-final")
    .addEventListener("change", filterEventosByDate);
  document
    .getElementById("btn-criar-evento")
    .addEventListener("click", createEvento);

  // Remova esta linha, não é mais necessária:
  // document
  //   .getElementById("btn-concluir-evento")
  //   .addEventListener("click", concludeEvento);

  // Event listener for car selection in add event modal
  document
    .getElementById("evento-carro")
    .addEventListener("change", function () {
      const carroId = this.value;
      if (carroId) {
        apiRequest(`/carro/${carroId}`)
          .then((carro) => {
            // Set odometer value but make it editable
            const odometroInput = document.getElementById("evento-odometro");
            odometroInput.value = carro.odometroAtual || 0;
            odometroInput.readOnly = false; // Remove readonly attribute
          })
          .catch((error) => {
            console.error("Error loading car details:", error);
          });
      } else {
        document.getElementById("evento-odometro").value = "";
      }
    });

  // Reset form when modal is closed
  document
    .getElementById("modalAddEvento")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("formAddEvento").reset();
      document.getElementById("evento-odometro").value = "";
    });

  document
    .getElementById("modalConcluirEvento")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("formConcluirEvento").reset();
    });
}

async function loadEventos() {
  try {
    const eventos = await apiRequest("/eventos");
    renderEventosList(eventos);
  } catch (error) {
    showAlert("Erro ao carregar lista de eventos: " + error.message, "danger");
  }
}

function renderEventosList(eventos) {
  const tbody = document.getElementById("eventos-lista");
  tbody.innerHTML = "";

  if (eventos.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="7" class="text-center">Nenhum evento encontrado</td>';
    tbody.appendChild(tr);
    return;
  }

  // Sort by date (most recent first)
  const sortedEventos = eventos.sort(
    (a, b) => new Date(b.dataSaida) - new Date(a.dataSaida)
  );

  sortedEventos.forEach((evento) => {
    const tr = document.createElement("tr");

    // Format dates
    const dataSaida =
      new Date(evento.dataSaida).toLocaleDateString("pt-BR") +
      " " +
      new Date(evento.dataSaida).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const dataEntrada = evento.dataEntrada
      ? new Date(evento.dataEntrada).toLocaleDateString("pt-BR") +
        " " +
        new Date(evento.dataEntrada).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

    // Status badge
    let statusBadge;
    if (evento.status === "PENDENTE") {
      statusBadge = '<span class="badge badge-custom-warning">Pendente</span>';
    } else if (evento.status === "CONCLUIDO") {
      statusBadge = '<span class="badge badge-custom-success">Concluído</span>';
    } else {
      statusBadge = '<span class="badge badge-custom-danger">Cancelado</span>';
    }

    // Actions based on status
    let actions = `
            <button class="btn btn-sm btn-primary btn-action view-evento" data-id="${evento.id}">
                <i class="fas fa-eye"></i>
            </button>
        `;

    if (evento.status === "PENDENTE") {
      actions += `
                <button class="btn btn-sm btn-success btn-action conclude-evento" data-id="${evento.id}">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-warning btn-action cancel-evento" data-id="${evento.id}">
                    <i class="fas fa-ban"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action delete-evento" data-id="${evento.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
    } else if (evento.status === "CONCLUIDO") {
      actions += `
                <button class="btn btn-sm btn-warning btn-action cancel-evento" data-id="${evento.id}">
                    <i class="fas fa-ban"></i>
                </button>
            `;
    }

    tr.innerHTML = `
            <td>${evento.id.substring(0, 8)}...</td>
            <td>${evento.carro?.modelo || "N/A"} (${
      evento.carro?.placa || "N/A"
    })</td>
            <td>${evento.motorista?.nome || "N/A"}</td>
            <td>${dataSaida}</td>
            <td>${dataEntrada}</td>
            <td>${statusBadge}</td>
            <td>${actions}</td>
        `;
    tbody.appendChild(tr);
  });

  // Add event listeners for buttons
  addEventoButtonListeners();
}

function addEventoButtonListeners() {
  document.querySelectorAll(".view-evento").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      viewEventDetails(id);
    });
  });

  document.querySelectorAll(".conclude-evento").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      openConcludeEventModal(id);
    });
  });

  document.querySelectorAll(".cancel-evento").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      cancelEvento(id);
    });
  });

  document.querySelectorAll(".delete-evento").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      deleteEvento(id);
    });
  });
}

async function loadCombos() {
  try {
    // Load available cars
    const carros = await apiRequest("/carros");
    const carrosSelect = document.getElementById("evento-carro");
    carrosSelect.innerHTML = '<option value="">Selecione um carro</option>';

    carros
      .filter((carro) => carro.disponivel)
      .forEach((carro) => {
        const option = document.createElement("option");
        option.value = carro.id;
        option.textContent = `${carro.modelo} (${carro.placa})`;
        carrosSelect.appendChild(option);
      });

    // Load available drivers
    const motoristas = await apiRequest("/motoristas");
    const motoristasSelect = document.getElementById("evento-motorista");
    motoristasSelect.innerHTML =
      '<option value="">Selecione um motorista</option>';

    motoristas
      .filter((motorista) => motorista.disponivel)
      .forEach((motorista) => {
        const option = document.createElement("option");
        option.value = motorista.id;
        option.textContent = motorista.nome;
        motoristasSelect.appendChild(option);
      });

    // Load events for payment modal
    const eventos = await apiRequest("/eventos");
    const eventosSelect = document.getElementById("pagamento-evento");
    eventosSelect.innerHTML = '<option value="">Selecione um evento</option>';

    eventos
      .filter((evento) => evento.status === "CONCLUIDO")
      .forEach((evento) => {
        const option = document.createElement("option");
        option.value = evento.id;
        const dataSaida = new Date(evento.dataSaida).toLocaleDateString(
          "pt-BR"
        );
        option.textContent = `${evento.carro?.modelo || "Carro"} - ${
          evento.motorista?.nome || "Motorista"
        } (${dataSaida})`;
        eventosSelect.appendChild(option);
      });
  } catch (error) {
    console.error("Error loading combos:", error);
  }
}
async function createEvento() {
  console.log("createEvento function called");

  const carroId = document.getElementById("evento-carro").value;
  const motoristId = document.getElementById("evento-motorista").value;

  if (!carroId || !motoristId) {
    showAlert("Por favor, selecione um carro e um motorista.", "warning");
    return;
  }

  try {
    // Get gestor ID from token or localStorage
    let gestorId = localStorage.getItem("gestorId");

    // Se não houver gestorId no localStorage, mostre um alerta
    if (!gestorId) {
      console.error("gestorId não encontrado no localStorage!");
      showAlert(
        "ID do gestor não encontrado. Por favor, faça login novamente.",
        "danger"
      );
      return;
    }

    // Adding console log for debugging
    console.log("Creating event with:", { carroId, motoristId, gestorId });

    const response = await apiRequest("/evento", "POST", {
      carroId,
      motoristId,
      gestorId,
    });

    console.log("Event creation response:", response);

    // Close modal and reload events
    bootstrap.Modal.getInstance(
      document.getElementById("modalAddEvento")
    ).hide();
    showAlert("Evento criado com sucesso!", "success");
    loadEventos();

    // Reload dashboard and combos
    initDashboard();
    loadCombos();
  } catch (error) {
    console.error("Event creation error:", error);
    showAlert("Erro ao criar evento: " + error.message, "danger");
  }
}

async function openConcludeEventModal(id) {
  try {
    const evento = await apiRequest(`/evento/${id}`);

    // Populate form
    document.getElementById("concluir-evento-id").value = evento.id;
    document.getElementById("concluir-evento-carro").value = `${
      evento.carro?.modelo || "N/A"
    } (${evento.carro?.placa || "N/A"})`;
    document.getElementById("concluir-evento-motorista").value =
      evento.motorista?.nome || "N/A";
    document.getElementById("concluir-evento-odometro-inicial").value =
      evento.odometroInicial;

    // Set minimum value for final odometer
    document.getElementById("concluir-evento-odometro-final").min =
      evento.odometroInicial;

    // Show modal
    new bootstrap.Modal(document.getElementById("modalConcluirEvento")).show();
  } catch (error) {
    showAlert("Erro ao carregar dados do evento: " + error.message, "danger");
  }
}

async function concludeEvento() {
  const eventoId = document.getElementById("concluir-evento-id").value;
  const odometroFinal = document.getElementById(
    "concluir-evento-odometro-final"
  ).value;
  const metodoPagamento = document.getElementById(
    "concluir-evento-metodo-pagamento"
  ).value;

  if (!odometroFinal || !metodoPagamento) {
    showAlert("Por favor, preencha todos os campos.", "warning");
    return;
  }

  // Validate odometer value is not negative
  if (parseInt(odometroFinal) < 0) {
    showAlert("O valor do odômetro não pode ser negativo.", "danger");
    return;
  }

  // Get initial odometer value for comparison
  const odometroInicial = parseInt(document.getElementById("concluir-evento-odometro-inicial").value);
  if (parseInt(odometroFinal) < odometroInicial) {
    showAlert("O odômetro final não pode ser menor que o odômetro inicial.", "danger");
    return;
  }

  try {
    await apiRequest("/evento", "PUT", {
      eventoId,
      odometroFinal: parseInt(odometroFinal),
      metodoPagamento,
    });

    // Close modal and reload events
    bootstrap.Modal.getInstance(
      document.getElementById("modalConcluirEvento")
    ).hide();
    showAlert("Evento concluído com sucesso!", "success");
    loadEventos();

    // Reload dashboard and combos
    initDashboard();
    loadCombos();

    // Update calendar
    initCalendar();
  } catch (error) {
    showAlert("Erro ao concluir evento: " + error.message, "danger");
  }
}

async function deleteEvento(id) {
  if (!confirm("Tem certeza que deseja excluir este evento?")) {
    return;
  }

  try {
    await apiRequest(`/evento/${id}`, "DELETE");
    showAlert("Evento excluído com sucesso!", "success");
    loadEventos();

    // Reload dashboard and combos
    initDashboard();
    loadCombos();

    // Update calendar
    initCalendar();
  } catch (error) {
    showAlert("Erro ao excluir evento: " + error.message, "danger");
  }
}

async function cancelEvento(id) {
  if (!confirm("Tem certeza que deseja cancelar este evento?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/evento/${id}/cancelar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        motivoCancelamento: "Cancelado pelo usuário"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Check if the error is due to trying to cancel a completed event
      if (data.error && data.error.includes("Não é possível cancelar um evento que já foi concluído")) {
        showAlert("Não é possível cancelar um evento que já foi concluído conforme regra de negócio.", "danger");
        return;
      }
      throw new Error(data.error || "Erro ao cancelar evento");
    }

    showAlert("Evento cancelado com sucesso!", "success");
    loadEventos();

    // Reload dashboard and combos
    initDashboard();
    loadCombos();

    // Update calendar
    initCalendar();
  } catch (error) {
    showAlert("Erro ao cancelar evento: " + error.message, "danger");
  }
}

function showAlert(message, type = "success") {
  const alertContainer = document.getElementById("alert-container");
  if (!alertContainer) {
    console.error("Elemento #alert-container não encontrado!");
    return;
  }

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertContainer.appendChild(alert);

  // Remove alert after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

console.log("Initializing dashboard...");

// Function to view event details when clicked from calendar or elsewhere
async function viewEventDetails(id) {
  try {
    // Get event details from API
    const evento = await apiRequest(`/evento/${id}`);

    // Create modal HTML
    const modalHTML = `
      <div class="modal fade" id="viewEventModal" tabindex="-1" aria-labelledby="viewEventModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="viewEventModalLabel">
                <i class="fas fa-calendar-day me-2"></i>
                Detalhes do Evento
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="card mb-3">
                    <div class="card-header bg-primary text-white">
                      <i class="fas fa-car me-2"></i>
                      Informações do Veículo
                    </div>
                    <div class="card-body">
                      <p><strong>Veículo:</strong> ${evento.carro?.modelo || 'N/A'} (${evento.carro?.placa || 'N/A'})</p>
                      <p><strong>Marca:</strong> ${evento.carro?.marca || 'N/A'}</p>
                      <p><strong>Cor:</strong> ${evento.carro?.cor || 'N/A'}</p>
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
                      <p><strong>Nome:</strong> ${evento.motorista?.nome || 'N/A'}</p>
                      <p><strong>CPF:</strong> ${evento.motorista?.cpf || 'N/A'}</p>
                      <p><strong>Telefone:</strong> ${evento.motorista?.telefone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card mb-3">
                <div class="card-header bg-info text-white">
                  <i class="fas fa-info-circle me-2"></i>
                  Detalhes do Evento
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>ID:</strong> ${evento.id || 'N/A'}</p>
                      <p><strong>Status:</strong>
                        <span class="badge ${evento.status === 'PENDENTE' ? 'bg-warning' :
                                            evento.status === 'CONCLUIDO' ? 'bg-success' :
                                            'bg-danger'}">
                          ${evento.status === 'PENDENTE' ? 'Pendente' :
                            evento.status === 'CONCLUIDO' ? 'Concluído' :
                            'Cancelado'}
                        </span>
                      </p>
                      <p><strong>Data de Saída:</strong> ${evento.dataSaida ? new Date(evento.dataSaida).toLocaleString('pt-BR') : 'N/A'}</p>
                      <p><strong>Data de Entrada:</strong> ${evento.dataEntrada ? new Date(evento.dataEntrada).toLocaleString('pt-BR') : 'N/A'}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Odômetro Inicial:</strong> ${evento.odometroInicial ? evento.odometroInicial.toLocaleString('pt-BR') + ' km' : 'N/A'}</p>
                      <p><strong>Odômetro Final:</strong> ${evento.odometroFinal ? evento.odometroFinal.toLocaleString('pt-BR') + ' km' : 'N/A'}</p>
                      ${evento.odometroInicial && evento.odometroFinal ?
                        `<p><strong>Distância Percorrida:</strong> ${(evento.odometroFinal - evento.odometroInicial).toLocaleString('pt-BR')} km</p>` : ''}
                    </div>
                  </div>
                </div>
              </div>

              ${evento.pagamentos && evento.pagamentos.length > 0 ? `
              <div class="card mb-3">
                <div class="card-header bg-success text-white">
                  <i class="fas fa-money-bill-wave me-2"></i>
                  Informações de Pagamento
                </div>
                <div class="card-body">
                  <p><strong>Valor:</strong> R$ ${evento.pagamentos[0].valor.toFixed(2)}</p>
                  <p><strong>Método:</strong> ${evento.pagamentos[0].metodoPagamento}</p>
                  <p><strong>Status:</strong>
                    <span class="badge ${evento.pagamentos[0].statusPagamento === 'PAGO' ? 'bg-success' :
                                        evento.pagamentos[0].statusPagamento === 'PENDENTE' ? 'bg-warning' :
                                        'bg-danger'}">
                      ${evento.pagamentos[0].statusPagamento}
                    </span>
                  </p>
                </div>
              </div>
              ` : ''}
            </div>
            <div class="modal-footer">
              ${evento.status === 'PENDENTE' ? `
                <button type="button" class="btn btn-success" id="btn-concluir-evento-modal" data-id="${evento.id}">
                  <i class="fas fa-check me-2"></i>Concluir Evento
                </button>
                <button type="button" class="btn btn-warning" id="btn-cancelar-evento-modal" data-id="${evento.id}">
                  <i class="fas fa-ban me-2"></i>Cancelar Evento
                </button>
              ` : evento.status === 'CONCLUIDO' ? `
                <button type="button" class="btn btn-warning" id="btn-cancelar-evento-modal" data-id="${evento.id}">
                  <i class="fas fa-ban me-2"></i>Cancelar Evento
                </button>
              ` : ''}
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('viewEventModal');
    if (existingModal) {
      const modalInstance = bootstrap.Modal.getInstance(existingModal);
      if (modalInstance) {
        modalInstance.hide();
      }
      existingModal.remove();
    }

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show modal
    const modalElement = document.getElementById('viewEventModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Add event listeners for action buttons
    const btnConcluir = document.getElementById('btn-concluir-evento-modal');
    if (btnConcluir) {
      btnConcluir.addEventListener('click', () => {
        modal.hide();
        openConcludeEventModal(evento.id);
      });
    }

    const btnCancelar = document.getElementById('btn-cancelar-evento-modal');
    if (btnCancelar) {
      btnCancelar.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja cancelar este evento?')) {
          modal.hide();
          cancelEvento(evento.id);
        }
      });
    }

  } catch (error) {
    console.error("Error loading event details:", error);
    showAlert("Erro ao carregar detalhes do evento: " + error.message, "danger");
  }
}

// Function to open the create event modal with a pre-selected car
function openCreateEventModal(carId) {
  // Pre-select the car in the dropdown
  const carSelect = document.getElementById("evento-carro");
  if (carSelect) {
    carSelect.value = carId;

    // Trigger the change event to load the car's odometer value
    const changeEvent = new Event('change');
    carSelect.dispatchEvent(changeEvent);
  }

  // Open the modal
  const modal = new bootstrap.Modal(document.getElementById("modalAddEvento"));
  modal.show();
}

// Function to view driver details
async function viewDriverDetails(id) {
  try {
    // Get driver details from API
    const motorista = await apiRequest(`/motorista/${id}`);

    // Create modal HTML
    const modalHTML = `
      <div class="modal fade" id="viewDriverModal" tabindex="-1" aria-labelledby="viewDriverModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="viewDriverModalLabel">
                <i class="fas fa-user me-2"></i>
                Detalhes do Motorista
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
              <div class="card mb-3">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="avatar-circle bg-primary text-white me-3">
                      <i class="fas fa-user fa-2x"></i>
                    </div>
                    <div>
                      <h5 class="mb-0">${motorista.nome || 'N/A'}</h5>
                      <p class="text-muted mb-0">ID: ${motorista.id || 'N/A'}</p>
                    </div>
                  </div>

                  <hr>

                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>CPF:</strong> ${motorista.cpf || 'N/A'}</p>
                      <p><strong>Telefone:</strong> ${motorista.telefone || 'N/A'}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Habilitação:</strong> ${motorista.habilitacao || 'N/A'}</p>
                      <p>
                        <strong>Status:</strong>
                        <span class="badge ${motorista.disponivel ? 'bg-success' : 'bg-danger'}">
                          ${motorista.disponivel ? 'Disponível' : 'Indisponível'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2">
                <a href="../motorista/DetalheMotorista.html?id=${motorista.id}" class="btn btn-primary">
                  <i class="fas fa-list me-2"></i>
                  Ver Histórico Completo
                </a>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('viewDriverModal');
    if (existingModal) {
      const modalInstance = bootstrap.Modal.getInstance(existingModal);
      if (modalInstance) {
        modalInstance.hide();
      }
      existingModal.remove();
    }

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add CSS for avatar circle
    const style = document.createElement('style');
    style.textContent = `
      .avatar-circle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
    document.head.appendChild(style);

    // Show modal
    const modalElement = document.getElementById('viewDriverModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

  } catch (error) {
    console.error("Error loading driver details:", error);
    showAlert("Erro ao carregar detalhes do motorista: " + error.message, "danger");
  }
}
