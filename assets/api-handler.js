// API Handler para Tracen Academy
const API_BASE_URL = 'https://tracen-beta.vercel.app';

/**
 * Validar CPF do aluno
 * @param {string} cpf - CPF do aluno (sem formatação)
 * @returns {Promise<{válido: boolean, nome: string, bloqueado: boolean, erro?: string}>}
 */
async function validarAluno(cpf) {
    try {
        // Conectar com API
        const response = await fetch(`${API_BASE_URL}/alunos/${cpf}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                válido: true,
                nome: data.nome || 'Aluno',
                bloqueado: data.bloqueado === true,
                cpf: cpf
            };
        } else if (response.status === 404) {
            return {
                válido: false,
                nome: '',
                bloqueado: false,
                erro: 'CPF não encontrado no cadastro'
            };
        } else {
            return {
                válido: false,
                nome: '',
                bloqueado: false,
                erro: 'Erro ao validar CPF'
            };
        }
    } catch (error) {
        console.error('Erro na validação:', error);
        throw error;
    }
}

/**
 * Registrar acesso na catraca
 * @param {string} cpf - CPF do aluno
 * @returns {Promise<{sucesso: boolean, mensagem: string}>}
 */
async function registrarAcesso(cpf) {
    try {
        const response = await fetch(`${API_BASE_URL}/catraca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpf: cpf
            })
        });

        if (response.ok) {
            return {
                sucesso: true,
                mensagem: 'Acesso registrado com sucesso'
            };
        } else {
            return {
                sucesso: false,
                mensagem: 'Erro ao registrar acesso'
            };
        }
    } catch (error) {
        console.error('Erro ao registrar acesso:', error);
        throw error;
    }
}

// Exportar funções para uso global
window.TracenAPI = {
    validarAluno,
    registrarAcesso
};
