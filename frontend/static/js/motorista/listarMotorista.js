import { API_BASE_URL } from "../api.js";

async function carregarMotoristas() {
    const token = localStorage.getItem('token');
    if (!token) {
        showToastMessage('Usuário não autenticado', 'error');
        return;
    }

    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/motoristas`, {
            method: 'GET',
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
        showToastMessage('Erro ao carregar motoristas', 'error');
        console.error('Erro:', error);
    } finally {
        hideLoading();
    }
}

function mascaraUltimos5Digitos(valor) {
    if (!valor) return '';
    const stringValor = valor.toString();
    const tamanho = stringValor.length;
    if (tamanho <= 5) return stringValor;
    return '*'.repeat(tamanho - 5) + stringValor.slice(-5);
}

function formatarCPF(cpf) {
    const cpfMascarado = mascaraUltimos5Digitos(cpf);
    // Formata apenas os últimos 5 dígitos visíveis
    return cpfMascarado.replace(/(\*{3})(\*{3})(\*{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    if (!telefone) return '';
    const telefoneStr = telefone.toString();
    const ultimosDigitos = telefoneStr.slice(-4);
    
    // Se o número tiver mais que 9 dígitos (com DDD), mostra 5 dígitos
    // Caso contrário, mostra 4 dígitos
    if (telefoneStr.length > 9) {
        return `*****${ultimosDigitos}`;
    } else {
        return `****${ultimosDigitos.slice(-4)}`;
    }
}

// Add new function to format ID
function formatarId(id) {
    if (!id) return '';
    const stringId = id.toString();
    if (stringId.length <= 5) return stringId;
    return `#${stringId.slice(-5)}`;  // Shows only last 3 digits with # prefix
}

// Update the renderizarMotoristas function
function renderizarMotoristas(motoristas) {
    const tbody = document.getElementById('motoristas-lista');
    tbody.innerHTML = '';

    motoristas.forEach(motorista => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarId(motorista.id)}</td>
            <td>${motorista.nome}</td>
            <td>${formatarCPF(motorista.cpf)}</td>
            <td>${formatarTelefone(motorista.telefone)}</td>
            <td>${motorista.habilitacao}</td>
            <td>
                <span class="badge ${motorista.disponivel ? 'bg-success' : 'bg-danger'}">
                    ${motorista.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarMotorista('${motorista.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" data-id="${motorista.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        // Add click event listener for delete button
        const deleteButton = tr.querySelector('.btn-danger');
        deleteButton.addEventListener('click', () => confirmarExclusao(motorista.id));

        tbody.appendChild(tr);
    });
}

function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.remove('d-none');
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.add('d-none');
    }
}

function showToastMessage(message, type) {
    const toast = document.getElementById('notificationToast');
    const toastBody = document.getElementById('toastMessage');
    
    if (toast && toastBody) {
        toastBody.textContent = message;
        toast.classList.add(`bg-${type}`);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        setTimeout(() => {
            toast.classList.remove(`bg-${type}`);
        }, 5000);
    }
}

// Initialize the list when the page loads
document.addEventListener('DOMContentLoaded', () => {
    carregarMotoristas();
});

// Export functions that might be needed by other modules
export { carregarMotoristas, renderizarMotoristas };

// Add this function to handle edit button clicks
window.editarMotorista = async (id) => {
    const { carregarDadosMotorista } = await import('./updateMotorista.js');
    carregarDadosMotorista(id);
};