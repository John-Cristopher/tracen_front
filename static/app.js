/**
 * Tracen Academy - App Logic Controller
 */

const MOTIVATIONAL_PHRASES = [
    "Cada galope uma história! Dê o seu melhor na pista hoje!",
    "Você é capaz de alcançar grandes alturas! 🏇",
    "Coragem e determinação são suas melhores amigas!",
    "A pista espera por você! Vá em frente!",
    "Seu sucesso começa aqui! 💪",
    "Cada dia é uma nova oportunidade de brilhar!",
    "Você tem o que é preciso para vencer!"
];

const TracenApp = {
    // --- UTILITÁRIOS COMPARTILHADOS ---
    formatCPF: (value) => value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),

    showToast: (id, message, isError = false) => {
        const toast = document.getElementById(id);
        const msgEl = toast.querySelector('span');
        if (!toast || !msgEl) return;

        msgEl.textContent = message;
        toast.classList.remove('hidden', 'toast-exit');

        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 4000);
    },

    // --- LÓGICA: INDEX (Acesso Aluno) ---
    initIndex: () => {
        const cpfInput = document.getElementById('cpfInput');
        const btnSubmit = document.getElementById('btnSubmit');
        if (!cpfInput) return;

        const updateButton = () => {
            const cpf = cpfInput.value.replace(/\D/g, '');
            btnSubmit.disabled = cpf.length !== 11;
        };

        document.querySelectorAll('[data-num]').forEach(btn => {
            btn.addEventListener('click', () => {
                const current = cpfInput.value.replace(/\D/g, '');
                if (current.length < 11) {
                    cpfInput.value = TracenApp.formatCPF(current + btn.getAttribute('data-num'));
                    updateButton();
                }
            });
        });

        document.getElementById('btnClear')?.addEventListener('click', () => {
            cpfInput.value = '';
            updateButton();
        });

        document.getElementById('btnDelete')?.addEventListener('click', () => {
            const current = cpfInput.value.replace(/\D/g, '');
            cpfInput.value = TracenApp.formatCPF(current.slice(0, -1));
            updateButton();
        });

        btnSubmit?.addEventListener('click', async () => {
            const cpf = cpfInput.value.replace(/\D/g, '');
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Validando...';

            try {
                const res = await window.TracenAPI.validarAluno(cpf);
                if (res.válido && !res.bloqueado) {
                    localStorage.setItem('userCPF', cpf);
                    localStorage.setItem('userName', res.nome);
                    window.location.href = 'student-validation.html?valid=true';
                } else {
                    TracenApp.showToast('errorToast', res.erro || 'Acesso negado.');
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Confirmar Acesso';
                }
            } catch (e) {
                TracenApp.showToast('errorToast', 'Erro de conexão.');
                btnSubmit.disabled = false;
            }
        });
    },

    // --- LÓGICA: STUDENT VALIDATION ---
    initStudentValidation: () => {
        const params = new URLSearchParams(window.location.search);
        const isValid = params.get('valid') === 'true';
        const userCPF = localStorage.getItem('userCPF');
        const accessTimeEl = document.getElementById('accessTime');

        if (accessTimeEl) {
            const now = new Date();
            // Utiliza o locale string para um horário preciso (HH:mm:ss)
            accessTimeEl.textContent = now.toLocaleTimeString('pt-BR');
        }

        const startTimer = (id, target) => {
            let s = 5;
            const el = document.getElementById(id);
            const timer = setInterval(() => {
                if (--s <= 0) { clearInterval(timer); window.location.href = target; }
                if (el) el.textContent = s;
            }, 1000);
        };

        if (isValid && userCPF) {
            document.getElementById('validationCard')?.classList.remove('hidden');
            document.getElementById('timeoutBar')?.classList.add('timeout-bar-valid');
            startTimer('countdown', 'student-access.html');
        } else {
            document.getElementById('errorCard')?.classList.remove('hidden');
            document.getElementById('timeoutBar')?.classList.add('timeout-bar-invalid');
            startTimer('errorCountdown', 'index.html');
        }
    },

    // --- LÓGICA: STUDENT ACCESS (Catraca 20s) ---
    initStudentAccess: () => {
        const nameEl = document.getElementById('studentName');
        const dateEl = document.getElementById('currentDate');
        const phraseEl = document.getElementById('motivationalPhrase');
        const successCard = document.getElementById('successCard');
        const errorCard = document.getElementById('errorCard');

        const params = new URLSearchParams(window.location.search);
        const isError = params.get('error') === 'true';

        if (isError) {
            errorCard?.classList.remove('hidden');
            const errorCountdownEl = document.getElementById('errorCountdown');
            let s = 20;
            const timer = setInterval(() => {
                if (--s <= 0) { clearInterval(timer); window.location.href = 'index.html'; }
                if (errorCountdownEl) errorCountdownEl.textContent = s;
            }, 1000);
        } else {
            successCard?.classList.remove('hidden');
            if (nameEl) nameEl.textContent = localStorage.getItem('userName') || 'Aluno';
            if (dateEl) {
                const now = new Date();
                const dataRef = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
                dateEl.textContent = `${dataRef} às ${now.toLocaleTimeString('pt-BR')}`;
            }
            if (phraseEl) phraseEl.textContent = `"${MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)]}"`;

            const countdownEl = document.getElementById('countdown');
            let s = 20;
            const timer = setInterval(() => {
                if (--s <= 0) { clearInterval(timer); window.location.href = 'index.html'; }
                if (countdownEl) countdownEl.textContent = s;
            }, 1000);

            const cpf = localStorage.getItem('userCPF');
            if (cpf) window.TracenAPI.registrarAcesso(cpf).catch(console.error);
        }
    }
};

// Inicialização Automática por Rota (Detecta ID único no Body ou URL)
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        TracenApp.initIndex();
    } else if (path.includes('student-validation.html')) {
        TracenApp.initStudentValidation();
    } else if (path.includes('student-access.html')) {
        TracenApp.initStudentAccess();
    }
});

// Exportar para window para botões com 'onclick' (como no dashboard)
window.TracenApp = TracenApp;