if (!sessionStorage.getItem('sonoraUsuario')) window.location.href = 'index.html';

const mensagem = document.getElementById('mensagem');
const cardConfirmacao = document.getElementById('cardConfirmacao');
const normalizarCpf = v => String(v || '').replace(/\D/g, '');
let usuarioSelecionado = null;

function buscarPorCpf(cpfDigitado) {
    mensagem.className = 'notice';
    cardConfirmacao.classList.add('hidden');
    usuarioSelecionado = null;

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
        mensagem.textContent = 'A conta do Administrador é protegida e não pode ser apagada.';
        mensagem.className = 'notice error';
        return;
    }

    usuarioSelecionado = usuario;
    document.getElementById('dadosUsuario').textContent =
        `Usuário encontrado: ${usuario.nome} ${usuario.sobrenome} (CPF: ${usuario.cpf} | E-mail: ${usuario.email})`;
    cardConfirmacao.classList.remove('hidden');
}

document.getElementById('btnConfirmarExclusao').addEventListener('click', () => {
    if (!usuarioSelecionado || usuarioSelecionado.admin) return;

    const listaAtualizada = carregarBanco().filter(u => u.id !== usuarioSelecionado.id);
    salvarBanco(listaAtualizada);

    mensagem.textContent = 'Usuário apagado com sucesso!';
    mensagem.className = 'notice success';
    cardConfirmacao.classList.add('hidden');
    usuarioSelecionado = null;
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