document.addEventListener('DOMContentLoaded', function() {
    loadGestores();

    // Event delegation for delete buttons
    document.getElementById('gestores-lista').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-delete')) {
            const gestorId = e.target.dataset.id;
            if (confirm('Tem certeza que deseja deletar este gestor?')) {
                deletarGestor(gestorId);
            }
        }
    });
});

function formatPartialCPF(cpf) {
    const cleanCPF = cpf.replace(/\D/g, '');
    return '*****' + cleanCPF.slice(-5);
}

function formatPartialId(id) {
    return '...' + id.slice(-5);
}

function formatPartialEmail(email) {
    const [localPart, domain] = email.split('@');
    const maskedLocalPart = localPart.slice(0, 5) + '*'.repeat(Math.max(0, localPart.length - 5));
    return `${maskedLocalPart}@${domain}`;
}

async function loadGestores() {
    try {
        const response = await fetch('http://localhost:3000/api/gestores', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar gestores');
        }

        const gestores = await response.json();
        const tbody = document.getElementById('gestores-lista');
        tbody.innerHTML = '';

        gestores.forEach(gestor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatPartialId(gestor.id)}</td>
                <td>${gestor.name}</td>
                <td>${formatPartialEmail(gestor.email)}</td>
                <td>${formatPartialCPF(gestor.cpf)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-primary btn-edit" data-id="${gestor.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-delete" data-id="${gestor.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar gestores');
    }
}

async function deletarGestor(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/gestor/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar gestor');
        }

        alert('Gestor deletado com sucesso!');
        loadGestores(); // Recarrega a lista
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar gestor');
    }
}