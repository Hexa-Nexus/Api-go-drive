import { API_BASE_URL } from "../api.js";

// Função para verificar status do motorista antes de confirmar exclusão
async function confirmarExclusao(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        showToastMessage('Usuário não autenticado', 'danger');
        return;
    }

    try {
        // Primeiro, buscar os dados do motorista para verificar o status
        const response = await fetch(`${API_BASE_URL}/motorista/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do motorista');
        }

        const motorista = await response.json();

        // Verificar se o motorista está disponível
        if (!motorista.disponivel) {
            showToastMessage('Não é possível excluir um motorista indisponível', 'warning');
            return;
        }

        // Se estiver disponível, mostrar modal de confirmação
        const modal = new bootstrap.Modal(document.getElementById('modalDeleteMotorista'));
        document.getElementById('delete-id').value = id;
        modal.show();

    } catch (error) {
        console.error('Erro:', error);
        showToastMessage(error.message, 'danger');
    }
}

// Função para deletar o motorista
async function deletarMotorista(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        showToastMessage('Usuário não autenticado', 'danger');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/motorista/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || data.message || 'Erro ao deletar motorista');
        }

        showToastMessage('Motorista deletado com sucesso!', 'success');
        
        // Fechar o modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalDeleteMotorista'));
        modal.hide();

        // Recarregar a lista de motoristas
        window.location.reload();

    } catch (error) {
        console.error('Erro:', error);
        showToastMessage(error.message, 'danger');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            const id = document.getElementById('delete-id').value;
            deletarMotorista(id);
        });
    }
});

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

// Make confirmarExclusao available globally
window.confirmarExclusao = confirmarExclusao;

export { confirmarExclusao };