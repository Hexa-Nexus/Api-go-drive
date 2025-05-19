import { API_BASE_URL } from "../api.js";

// Função para carregar os dados do motorista no modal de edição
async function carregarDadosMotorista(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        showToastMessage('Usuário não autenticado', 'danger');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/motorista/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do motorista');
        }

        const motorista = await response.json();
        
        // Preencher o formulário com os dados do motorista
        document.getElementById('edit-id').value = motorista.id;
        document.getElementById('edit-nome').value = motorista.nome;
        document.getElementById('edit-cpf').value = motorista.cpf;
        document.getElementById('edit-telefone').value = motorista.telefone;
        document.getElementById('edit-habilitacao').value = motorista.habilitacao;
        document.getElementById('edit-status').value = motorista.disponivel ? 'disponivel' : 'indisponivel';

        // Abrir o modal
        const modal = new bootstrap.Modal(document.getElementById('modalEditMotorista'));
        modal.show();

    } catch (error) {
        console.error('Erro:', error);
        showToastMessage(error.message, 'danger');
    }
}

// Função para atualizar o motorista
async function atualizarMotorista(event) {
    event.preventDefault();

    const form = event.target;
    const id = form.querySelector('#edit-id').value;
    const nome = form.querySelector('#edit-nome').value;
    const telefone = form.querySelector('#edit-telefone').value.replace(/\D/g, '');
    const habilitacao = form.querySelector('#edit-habilitacao').value.replace(/\D/g, '');
    const disponivel = form.querySelector('#edit-status').value === 'disponivel';

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${API_BASE_URL}/motorista/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                telefone,
                habilitacao,
                disponivel
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Erro ao atualizar motorista');
        }

        showToastMessage('Motorista atualizado com sucesso!', 'success');
        
        // Fechar o modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditMotorista'));
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
    const formEditMotorista = document.getElementById('form-edit-motorista');
    if (formEditMotorista) {
        formEditMotorista.addEventListener('submit', atualizarMotorista);
    }
});

// Função auxiliar para mostrar notificações
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

export { carregarDadosMotorista };