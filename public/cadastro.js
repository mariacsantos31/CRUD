const form = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');
const valor = id => document.getElementById(id).value.trim();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    mensagem.className = 'notice';

    const usuarios = carregarBanco();
    const email = valor('email').toLowerCase();
    const cpf = valor('cpf');

    if (usuarios.some(u => (u.email || '').toLowerCase() === email)) {
        mensagem.textContent = 'Este e-mail já está cadastrado.';
        mensagem.className = 'notice error';
        return;
    }

    if (usuarios.some(u => (u.cpf || '') === cpf)) {
        mensagem.textContent = 'Este CPF já está cadastrado.';
        mensagem.className = 'notice error';
        return;
    }

    const novoUsuario = {
        id: Date.now(),
        nome: valor('nome'),
        sobrenome: valor('sobrenome'),
        cpf,
        email,
        senha: valor('senha'),
        rua: valor('rua'),
        cep: valor('cep'),
        cidade: valor('cidade'),
        estado: valor('estado'),
        telefone: valor('telefone'),
        admin: false
    };

    usuarios.push(novoUsuario);
    salvarBanco(usuarios);

    mensagem.textContent = 'Conta criada com sucesso! Clique no botão abaixo para ir ao login.';
    mensagem.className = 'notice success';
    form.reset();
});