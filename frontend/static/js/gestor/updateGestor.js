document.addEventListener('DOMContentLoaded', function() {
    // Event delegation for edit buttons
    document.getElementById('gestores-lista').addEventListener('click', async function(e) {
        if (e.target.classList.contains('btn-edit') || e.target.parentElement.classList.contains('btn-edit')) {
            const gestorId = e.target.closest('.btn-edit').dataset.id;
            await loadGestorData(gestorId);
        }
    });

    // Update form submission
    document.getElementById('form-update-gestor').addEventListener('submit', async function(e) {
        e.preventDefault();
        await updateGestor();
    });
});

async function loadGestorData(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/gestor/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do gestor');
        }

        const gestor = await response.json();

        // Preencher o formulário com os dados
        document.getElementById('update-id').value = gestor.id;
        document.getElementById('update-name').value = gestor.name;
        document.getElementById('update-cpf').value = gestor.cpf;
        document.getElementById('update-email').value = gestor.email;
        document.getElementById('update-password').value = ''; // Limpa o campo de senha

        // Abrir o modal
        const modal = new bootstrap.Modal(document.getElementById('modalUpdateGestor'));
        modal.show();

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados do gestor');
    }
}

async function updateGestor() {
    const id = document.getElementById('update-id').value;
    const formData = {
        name: document.getElementById('update-name').value,
        cpf: document.getElementById('update-cpf').value.replace(/\D/g, ''),
        email: document.getElementById('update-email').value
    };

    // Apenas inclui a senha se foi preenchida
    const password = document.getElementById('update-password').value;
    if (password.trim()) {
        formData.password = password;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/gestor/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar gestor');
        }

        alert('Gestor atualizado com sucesso!');
        
        // Fecha o modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalUpdateGestor'));
        modal.hide();

        // Recarrega a lista de gestores
        loadGestores();

    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
}