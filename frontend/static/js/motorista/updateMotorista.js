import { API_BASE_URL } from "../api.js";

// Função para carregar os dados do motorista no modal de edição
async function carregarDadosMotorista(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        showErrorModal('Erro de Autenticação', 'Usuário não autenticado');
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
        showErrorModal('Erro', error.message);
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
            // Verifica se é o erro específico de motorista em evento ativo
            if (data.error && data.error.includes("motorista enquanto ele estiver em um evento ativo")) {
                showErrorModal(
                    'Restrição de Alteração',
                    'Não é possível alterar a disponibilidade do motorista enquanto ele estiver em um evento ativo.',
                    true
                );
            } else {
                throw new Error(data.error || data.message || 'Erro ao atualizar motorista');
            }
            return;
        }

        // Mostrar modal de sucesso
        showSuccessModal('Motorista atualizado com sucesso!');

        // Fechar o modal de edição
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditMotorista'));
        modal.hide();

        // Recarregar a lista de motoristas após um tempo
        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (error) {
        console.error('Erro:', error);
        showErrorModal('Erro na Atualização', error.message);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const formEditMotorista = document.getElementById('form-edit-motorista');
    if (formEditMotorista) {
        formEditMotorista.addEventListener('submit', atualizarMotorista);
    }

    // Adicionar botão de fechar ao modal de erro
    document.querySelectorAll('.btn-close-error').forEach(button => {
        button.addEventListener('click', () => {
            const errorModal = bootstrap.Modal.getInstance(document.getElementById('errorModal'));
            if (errorModal) errorModal.hide();
        });
    });
});

// Função para exibir o modal de erro personalizado
function showErrorModal(title, message, isWarning = false) {
    const modalTitle = document.getElementById('errorModalTitle');
    const modalBody = document.getElementById('errorModalBody');
    const modalIcon = document.getElementById('errorModalIcon');

    modalTitle.textContent = title;
    modalBody.textContent = message;

    // Define o ícone e cor baseado no tipo de erro
    if (isWarning) {
        modalIcon.className = 'bi bi-exclamation-triangle text-warning display-1';
        document.getElementById('errorModalHeader').classList.remove('bg-danger');
        document.getElementById('errorModalHeader').classList.add('bg-warning');
    } else {
        modalIcon.className = 'bi bi-x-circle text-danger display-1';
        document.getElementById('errorModalHeader').classList.remove('bg-warning');
        document.getElementById('errorModalHeader').classList.add('bg-danger');
    }

    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}

// Função para exibir modal de sucesso
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

// Função auxiliar para mostrar notificações toast (mantida para compatibilidade)
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
