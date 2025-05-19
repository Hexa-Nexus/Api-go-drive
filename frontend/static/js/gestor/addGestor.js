document.addEventListener('DOMContentLoaded', function() {
    const formAddGestor = document.getElementById('form-add-gestor');
    
    formAddGestor.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            cpf: document.getElementById('cpf').value.replace(/\D/g, ''), // Remove non-digits
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('http://localhost:3000/api/gestor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao adicionar gestor');
            }

            // Success message
            alert('Gestor adicionado com sucesso!');
            
            // Clear form
            formAddGestor.reset();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAddGestor'));
            modal.hide();

            // Refresh managers list if it exists
            if (typeof loadGestores === 'function') {
                loadGestores();
            }

        } catch (error) {
            alert(error.message);
            console.error('Erro:', error);
        }
    });

    // CPF mask
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value;
        }
    });
});