// Função para carregar carros disponíveis
async function carregarCarrosDisponiveis() {
    const tbody = document.getElementById('carros-disponiveis-list');

    try {
        const response = await fetch('http://localhost:3000/api/carros', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar carros');
        }

        const carros = await response.json();

        // Filtrar apenas carros disponíveis e limitar a 5
        const carrosDisponiveis = carros
            .filter(carro => carro.disponivel)
            .slice(0, 5);

        if (carrosDisponiveis.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">Nenhum carro disponível no momento</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = carrosDisponiveis.map(carro => `
            <tr>
                <td><span class="badge bg-secondary">${carro.placa}</span></td>
                <td>${carro.modelo} (${carro.marca}, ${carro.ano})</td>
                <td><span class="badge bg-success">Disponível</span></td>
            </tr>
        `).join('');

        console.log('Carros disponíveis carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar carros disponíveis:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">
                    Erro ao carregar carros: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Função para carregar motoristas disponíveis
async function carregarMotoristasDisponiveis() {
    const tbody = document.getElementById('motoristas-disponiveis-list');

    try {
        const response = await fetch('http://localhost:3000/api/motoristas', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar motoristas');
        }

        const motoristas = await response.json();

        // Filtrar apenas motoristas disponíveis e limitar a 5
        const motoristasDisponiveis = motoristas
            .filter(motorista => motorista.disponivel)
            .slice(0, 5);

        if (motoristasDisponiveis.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center">Nenhum motorista disponível no momento</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = motoristasDisponiveis.map(motorista => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="bg-success rounded-circle me-2" style="width: 10px; height: 10px;"></span>
                        ${motorista.nome}
                    </div>
                </td>
                <td>${formatarCPF(motorista.cpf)}</td>
            </tr>
        `).join('');

        console.log('Motoristas disponíveis carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar motoristas disponíveis:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center text-danger">
                    Erro ao carregar motoristas: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Função auxiliar para formatar CPF
function formatarCPF(cpf) {
    if (!cpf) return 'CPF não informado';
    try {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } catch (error) {
        console.error('Erro ao formatar CPF:', error);
        return cpf;
    }
}
