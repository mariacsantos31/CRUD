const formLogin = document.getElementById('formLogin');
const formLoginAdmin = document.getElementById('formLoginAdmin');
const areaRodapeComum = document.getElementById('areaRodapeComum');
const mensagem = document.getElementById('mensagem');

function iniciarSessao(usuario) {
    sessionStorage.setItem('sonoraUsuario', JSON.stringify({
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome || '',
        email: usuario.email,
        admin: usuario.admin === true
    }));
    window.location.href = 'boas-vindas.html';
}

document.getElementById('btnAbrirAdmin').addEventListener('click', () => {
    mensagem.className = 'notice';
    formLogin.classList.add('hidden');
    areaRodapeComum.classList.add('hidden');
    formLoginAdmin.classList.remove('hidden');
    document.getElementById('cardKicker').textContent = 'PAINEL ADMINISTRATIVO';
    document.getElementById('tituloLogin').textContent = 'Acesso Administrador';
    document.getElementById('subtituloLogin').textContent = 'Informe as credenciais de administração.';
});

document.getElementById('btnVoltarLogin').addEventListener('click', () => {
    mensagem.className = 'notice';
    formLoginAdmin.classList.add('hidden');
    formLogin.classList.remove('hidden');
    areaRodapeComum.classList.remove('hidden');
    document.getElementById('cardKicker').textContent = 'BEM-VINDO DE VOLTA';
    document.getElementById('tituloLogin').textContent = 'Entre na sua conta';
    document.getElementById('subtituloLogin').textContent = 'Sua próxima música favorita está esperando por você.';
});

formLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    mensagem.className = 'notice';

    const usuarios = carregarBanco();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value.trim();

    if (email === 'admin@admin') {
        mensagem.textContent = 'Use o botão "Entrar como Administrador" logo abaixo para acessar com esta conta.';
        mensagem.className = 'notice error';
        return;
    }

    const usuario = usuarios.find(u =>
        String(u.email || '').trim().toLowerCase() === email &&
        String(u.senha || '').trim() === senha &&
        u.admin !== true
    );

    if (!usuario) {
        mensagem.textContent = 'E-mail ou senha incorretos. Confira seus dados ou crie uma conta.';
        mensagem.className = 'notice error';
        return;
    }

    iniciarSessao(usuario);
});

formLoginAdmin.addEventListener('submit', (event) => {
    event.preventDefault();
    mensagem.className = 'notice';

    const usuarios = carregarBanco();
    const email = document.getElementById('adminEmail').value.trim().toLowerCase();
    const senha = document.getElementById('adminSenha').value.trim();

    if (email === 'admin@admin' && senha === 'admin') {
        const admin = usuarios.find(u => u.admin === true) || ADMIN_PADRAO;
        iniciarSessao({ ...admin, admin: true });
        return;
    }

    mensagem.textContent = 'Credenciais de administrador inválidas.';
    mensagem.className = 'notice error';
});