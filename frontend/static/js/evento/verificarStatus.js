// Script para verificar os status dos eventos no banco de dados
async function verificarStatusEventos() {
    try {
        const response = await fetch('http://localhost:3000/api/eventos/status-check', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao verificar status dos eventos');
        }

        const data = await response.json();
        console.log("=== VERIFICAÇÃO DE STATUS DOS EVENTOS ===");
        console.log(`Total de eventos: ${data.total}`);
        console.log("Contagem por status:", data.countByStatus);

        // Exibir os primeiros 10 eventos
        console.log("Primeiros eventos:");
        data.eventos.slice(0, 10).forEach(evento => {
            console.log(`ID: ${evento.id.substring(0, 8)}... | Status: ${evento.status}`);
        });

        return data;
    } catch (error) {
        console.error("Erro ao verificar status:", error);
        return null;
    }
}

// Executar a verificação
verificarStatusEventos();
