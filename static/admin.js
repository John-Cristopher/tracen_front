/**
 * Tracen Academy - Admin/Staff Logic
 */
const TracenAdmin = {
    formatCPF: (value) => value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),

    initStaffLogin: () => {
        const form = document.getElementById('staffForm');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('emailInput').value;
            const pass = document.getElementById('passwordInput').value;
            const res = await window.TracenAdminAPI.validarStaff(email, pass);

            if (res.válido) {
                // SALVE O TOKEN REAL AQUI
                localStorage.setItem('staffToken', res.token);
                window.location.href = 'staff-dashboard.html';
            }
        });
    },

    initStaffDashboard: () => {
        const token = localStorage.getItem('staffToken');

        // Verifica se o token existe e se parece um JWT (mínimo de caracteres)
        if (!token || token === 'true' || token.length < 20) {
            window.location.href = 'staff-login.html';
            return;
        }

        const render = async () => {
            const alunos = await window.TracenAdminAPI.obterAlunos();
            document.getElementById('studentTable').innerHTML = alunos.map(a => `
                <tr>
                    <td>${a.nome}</td>
                    <td>${TracenAdmin.formatCPF(a.cpf)}</td>
                    <td><button onclick="TracenAdmin.toggleStudent('${a.cpf}')">Bloquear/Desbloquear</button></td>
                </tr>
            `).join('');
        };

        TracenAdmin.toggleStudent = async (cpf) => {
            console.log("Ação administrativa no CPF:", cpf);
            // Lógica de API aqui
            render();
        };

        render();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('staff-login.html')) TracenAdmin.initStaffLogin();
    if (path.includes('staff-dashboard.html')) TracenAdmin.initStaffDashboard();
});

window.TracenAdmin = TracenAdmin;