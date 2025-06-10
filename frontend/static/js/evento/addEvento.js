document.addEventListener('DOMContentLoaded', () => {
    // Buscar elementos do formulário
    const formAddEvento = document.getElementById('form-add-evento');
    const carroSelect = document.getElementById('carroId');
    const motoristaSelect = document.getElementById('motoristId');

    // Carregar dados iniciais
    carregarCarros();
    carregarMotoristas();

    // Função para decodificar o token JWT
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            console.log('Token payload:', payload); // Debug log
            return payload;
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }

    // Função para obter ID do gestor do token
    function getGestorIdFromToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado');
            window.location.href = '../auth/login.html';
            return null;
        }

        const decodedToken = parseJwt(token);
        console.log('Token decodificado:', decodedToken); // Debug log

        // Verifica diferentes possíveis localizações do ID do gestor no token
        const gestorId = decodedToken?.gestorId || 
                        decodedToken?.gestor_id || 
                        decodedToken?.user?.gestorId ||
                        decodedToken?.id;

        if (!gestorId) {
            console.error('ID do gestor não encontrado no token');
            localStorage.removeItem('token'); // Limpa o token inválido
            window.location.href = '../auth/login.html';
            return null;
        }

        return gestorId;
    }

    // Carregar carros disponíveis
    async function carregarCarros() {
        try {
            const response = await fetch('http://localhost:3000/api/carros', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const carros = await response.json();
            
            carroSelect.innerHTML = '<option value="" disabled selected>Selecione um carro</option>';
            carros.filter(carro => carro.disponivel).forEach(carro => {
                carroSelect.innerHTML += `
                    <option value="${carro.id}">${carro.modelo} - ${carro.placa}</option>
                `;
            });
        } catch (error) {
            console.error('Erro ao carregar carros:', error);
            alert('Erro ao carregar lista de carros');
        }
    }

    // Carregar motoristas disponíveis
    async function carregarMotoristas() {
        try {
            const response = await fetch('http://localhost:3000/api/motoristas', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const motoristas = await response.json();
            
            motoristaSelect.innerHTML = '<option value="" disabled selected>Selecione um motorista</option>';
            motoristas.filter(motorista => motorista.disponivel).forEach(motorista => {
                motoristaSelect.innerHTML += `
                    <option value="${motorista.id}">${motorista.nome}</option>
                `;
            });
        } catch (error) {
            console.error('Erro ao carregar motoristas:', error);
            alert('Erro ao carregar lista de motoristas');
        }
    }

    // Manipular envio do formulário
    formAddEvento.addEventListener('submit', async (e) => {
        e.preventDefault();

        const gestorId = getGestorIdFromToken();
        if (!gestorId) {
            alert('Erro: ID do gestor não encontrado. Por favor, faça login novamente.');
            return;
        }

        const eventoData = {
            carroId: carroSelect.value,
            motoristId: motoristaSelect.value,
            gestorId: gestorId,
            tipoEvento: 'SAIDA',
            status: 'PENDENTE'
        };

        try {
            const response = await fetch('http://localhost:3000/api/evento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(eventoData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Evento criado com sucesso!');
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalAddEvento'));
                modal.hide();
                // Recarregar a lista de eventos
                window.location.reload();
            } else {
                throw new Error(data.error || 'Erro ao criar evento');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message || 'Erro ao criar evento');
        }
    });
});