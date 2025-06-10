import { API_BASE_URL } from "../api.js";
import { renderizarMotoristas } from "./listarMotorista.js";

document.addEventListener('DOMContentLoaded', () => {
    setupBuscaMotorista();
});

function setupBuscaMotorista() {
    // Busca por CPF
    const btnBuscarCPF = document.getElementById('btn-buscar-cpf');
    if (btnBuscarCPF) {
        btnBuscarCPF.addEventListener('click', buscarPorCPF);
    }

    // Filtro por disponibilidade
    const selectDisponibilidade = document.getElementById('filtro-motorista-disponibilidade');
    if (selectDisponibilidade) {
        selectDisponibilidade.addEventListener('change', filtrarPorDisponibilidade);
    }

    // Adicionar listener para o botão de atualizar
    const btnRefresh = document.getElementById('btn-refresh');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', async () => {
            try {
                // Adicionar classe de rotação ao ícone
                const icon = btnRefresh.querySelector('i');
                icon.classList.add('fa-spin');
                
                // Desabilitar o botão durante a atualização
                btnRefresh.disabled = true;
                
                // Recarregar a lista
                await carregarTodosMotoristas();
                
                showToastMessage('Lista atualizada com sucesso!', 'success');
            } catch (error) {
                showToastMessage('Erro ao atualizar lista', 'danger');
            } finally {
                // Remover classe de rotação e reabilitar o botão
                const icon = btnRefresh.querySelector('i');
                icon.classList.remove('fa-spin');
                btnRefresh.disabled = false;
            }
        });
    }
}

async function buscarPorCPF() {
    const cpfInput = document.getElementById('busca-cpf');
    const cpf = cpfInput.value.replace(/\D/g, '');

    if (!cpf || cpf.length !== 11) {
        showToastMessage('Digite um CPF válido com 11 dígitos', 'warning');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        showToastMessage('Usuário não autenticado', 'danger');
        return;
    }

    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/motorista?cpf=${cpf}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Handle 404 case before attempting to parse JSON
        if (response.status === 404) {
            showToastMessage('Motorista não encontrado com este CPF', 'warning');
            await carregarTodosMotoristas();
            return;
        }

        // For other error status codes
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao buscar motorista');
        }

        const data = await response.json();
        renderizarMotoristas([data]);
        showToastMessage('Motorista encontrado!', 'success');

    } catch (error) {
        console.error('Erro na busca:', error);
        showToastMessage(error.message || 'Erro ao buscar motorista', 'danger');
        await carregarTodosMotoristas();
    } finally {
        hideLoading();
    }
}

async function carregarTodosMotoristas() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/motoristas`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar motoristas');
        }

        const motoristas = await response.json();
        renderizarMotoristas(motoristas);

    } catch (error) {
        console.error('Erro:', error);
        showToastMessage('Erro ao carregar motoristas', 'danger');
    }
}

function filtrarPorDisponibilidade(event) {
    const disponibilidade = event.target.value;
    const rows = document.querySelectorAll('#motoristas-lista tr');

    rows.forEach(row => {
        const statusCell = row.querySelector('td:nth-child(6)');
        if (!statusCell) return;

        if (disponibilidade === 'todos') {
            row.style.display = '';
        } else {
            const isDisponivel = statusCell.textContent.trim().includes('Disponível');
            row.style.display = (
                (disponibilidade === 'disponivel' && isDisponivel) || 
                (disponibilidade === 'indisponivel' && !isDisponivel)
            ) ? '' : 'none';
        }
    });
}

function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.classList.remove('d-none');
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.classList.add('d-none');
}

function showToastMessage(message, type) {
    const toast = document.getElementById('notificationToast');
    const toastBody = document.getElementById('toastMessage');
    
    toastBody.textContent = message;
    toast.classList.add(`bg-${type}`);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    setTimeout(() => {
        toast.classList.remove(`bg-${type}`);
    }, 5000);
}

export { buscarPorCPF, filtrarPorDisponibilidade };