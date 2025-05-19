document.addEventListener('DOMContentLoaded', function() {
    // Profile button click handler
    document.getElementById('btn-profile').addEventListener('click', function(e) {
        e.preventDefault();
        showProfileModal();
    });

    // Settings button click handler
    document.getElementById('btn-settings').addEventListener('click', function(e) {
        e.preventDefault();
        showSettingsModal();
    });
});

async function showProfileModal() {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/api/gestor/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do perfil');
        }

        const data = await response.json();

        // Create and show modal
        const modalHtml = `
            <div class="modal fade" id="profileModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Perfil do Gestor</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Nome</label>
                                <input type="text" class="form-control" value="${data.name}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" value="${data.email}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">CPF</label>
                                <input type="text" class="form-control" value="${data.cpf}" readonly>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to document
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('profileModal'));
        modal.show();

        // Remove modal from DOM after it's hidden
        document.getElementById('profileModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados do perfil');
    }
}

async function showSettingsModal() {
    // Create and show modal
    const modalHtml = `
        <div class="modal fade" id="settingsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Configurações</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="changePasswordForm">
                            <div class="mb-3">
                                <label class="form-label">Senha Atual</label>
                                <input type="password" class="form-control" id="currentPassword" required 
                                    minlength="6" maxlength="20">
                                <div class="form-text text-muted">Digite sua senha atual</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nova Senha</label>
                                <input type="password" class="form-control" id="newPassword" required 
                                    minlength="6" maxlength="20">
                                <div class="form-text text-muted">Mínimo 6 caracteres</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirmar Nova Senha</label>
                                <input type="password" class="form-control" id="confirmPassword" required 
                                    minlength="6" maxlength="20">
                            </div>
                            <div id="passwordError" class="alert alert-danger d-none"></div>
                            <button type="submit" class="btn btn-primary">Alterar Senha</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to document and show it
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
    modal.show();

    // Handle form submission
    document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const errorDiv = document.getElementById('passwordError');
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        try {
            // Reset error message
            errorDiv.classList.add('d-none');
            
            // Client-side validation
            if (newPassword.length < 6) {
                throw new Error('A nova senha deve ter pelo menos 6 caracteres');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('As senhas não coincidem');
            }

            if (currentPassword === newPassword) {
                throw new Error('A nova senha deve ser diferente da senha atual');
            }

            const userId = localStorage.getItem('userId');
            
            // Get current user data first
            const getUserResponse = await fetch(`http://localhost:3000/api/gestor/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const userData = await getUserResponse.json();

            // Prepare update data
            const updateData = {
                name: userData.name,
                email: userData.email,
                cpf: userData.cpf,
                password: newPassword,
                currentPassword: currentPassword
            };

            // Send update request
            const response = await fetch(`http://localhost:3000/api/gestor/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Senha atual incorreta');
            }

            // Success handling
            modal.hide();
            alert('Senha atualizada com sucesso!');

        } catch (error) {
            // Error handling
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('d-none');
            console.error('Erro:', error);
        }
    });

    // Cleanup on modal close
    document.getElementById('settingsModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}