if (!sessionStorage.getItem('sonoraUsuario')) window.location.href = 'index.html';

const mensagem = document.getElementById('mensagem');
const formEdicao = document.getElementById('formEdicao');
const normalizarCpf = v => String(v || '').replace(/\D/g, '');

function buscarPorCpf(cpfDigitado) {
    mensagem.className = 'notice';
    formEdicao.classList.add('hidden');

    const lista = carregarBanco();
    const numeros = normalizarCpf(cpfDigitado);

    const usuario = lista.find(u =>
        (u.cpf || '').trim() === cpfDigitado.trim() || (numeros && normalizarCpf(u.cpf) === numeros)
    );

    if (!usuario) {
        mensagem.textContent = 'CPF não encontrado.';
        mensagem.className = 'notice error';
        return;
    }

    if (usuario.admin) {
        mensagem.textContent = 'A conta do Administrador é protegida e não pode ser editada.';
        mensagem.className = 'notice error';
        return;
    }

    document.getElementById('editId').value = usuario.id;
    document.getElementById('editNome').value = usuario.nome;
    document.getElementById('editSobrenome').value = usuario.sobrenome;
    document.getElementById('editCpf').value = usuario.cpf;
    document.getElementById('editTelefone').value = usuario.telefone;
    document.getElementById('editEmail').value = usuario.email;
    document.getElementById('editSenha').value = usuario.senha;
    document.getElementById('editCep').value = usuario.cep;
    document.getElementById('editRua').value = usuario.rua;
    document.getElementById('editCidade').value = usuario.cidade;
    document.getElementById('editEstado').value = usuario.estado;
    formEdicao.classList.remove('hidden');
}

formEdicao.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(document.getElementById('editId').value);
    const lista = carregarBanco();

    const index = lista.findIndex(u => u.id === id);
    if (index === -1 || lista[index].admin) return;

    lista[index] = {
        id,
        nome: document.getElementById('editNome').value.trim(),
        sobrenome: document.getElementById('editSobrenome').value.trim(),
        cpf: document.getElementById('editCpf').value.trim(),
        telefone: document.getElementById('editTelefone').value.trim(),
        email: document.getElementById('editEmail').value.trim().toLowerCase(),
        senha: document.getElementById('editSenha').value,
        cep: document.getElementById('editCep').value.trim(),
        rua: document.getElementById('editRua').value.trim(),
        cidade: document.getElementById('editCidade').value.trim(),
        estado: document.getElementById('editEstado').value.trim(),
        admin: false
    };

    salvarBanco(lista);

    mensagem.textContent = 'Usuário atualizado com sucesso!';
    mensagem.className = 'notice success';
    formEdicao.classList.add('hidden');
});

document.getElementById('btnBuscar').addEventListener('click', () => buscarPorCpf(document.getElementById('buscaCpf').value));
document.getElementById('buscaCpf').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarPorCpf(e.target.value);
});
document.getElementById('btnSair').addEventListener('click', () => {
    sessionStorage.removeItem('sonoraUsuario');
    window.location.href = 'index.html';
});

const cpfUrl = new URLSearchParams(window.location.search).get('cpf');
if (cpfUrl) {
    document.getElementById('buscaCpf').value = cpfUrl;
    buscarPorCpf(cpfUrl);
}