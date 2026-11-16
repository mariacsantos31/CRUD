const usuario = JSON.parse(sessionStorage.getItem('sonoraUsuario') || 'null');
if (!usuario) {
    window.location.href = 'index.html';
} else {
    document.getElementById('nomeNav').textContent = usuario.nome;
    document.getElementById('tituloBoasVindas').textContent = `Olá, ${usuario.nome}.`;
    document.getElementById('avatarUsuario').textContent = usuario.nome.charAt(0).toUpperCase();
}

function sair() {
    sessionStorage.removeItem('sonoraUsuario');
    window.location.href = 'index.html';
}