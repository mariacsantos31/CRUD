if (!sessionStorage.getItem('sonoraUsuario')) window.location.href = 'index.html';

const tbody = document.getElementById('listaUsuarios');
const normalizarCpf = v => String(v || '').replace(/\D/g, '');

function carregarUsuarios(filtroCpf = '') {
    const lista = carregarBanco();

    const termo = filtroCpf.trim().toLowerCase();
    const numeros = normalizarCpf(filtroCpf);

    const encontrados = lista.filter(u => {
        if (!termo) return true;
        return String(u.cpf || '').toLowerCase().includes(termo) ||
               (numeros && normalizarCpf(u.cpf).includes(numeros));
    });

    tbody.innerHTML = '';
    document.getElementById('contador').textContent = `${encontrados.length} usuário(s) encontrado(s)`;

    if (!encontrados.length) {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum usuário encontrado.</td></tr>';
        return;
    }

    encontrados.forEach(u => {
        const tr = document.createElement('tr');
        const endereco = `${u.rua || ''} · ${u.cidade || ''}/${u.estado || ''} · CEP ${u.cep || ''}`;
        const acoes = u.admin
            ? '<span class="muted">Conta protegida</span>'
            : `<a class="btn small secondary" href="put.html?cpf=${encodeURIComponent(u.cpf)}">Editar</a>
               <a class="btn small danger" href="delete.html?cpf=${encodeURIComponent(u.cpf)}">Apagar</a>`;

        tr.innerHTML = `
            <td>${u.nome} ${u.sobrenome}</td>
            <td>${u.cpf}</td>
            <td>${u.email}</td>
            <td>${u.telefone}</td>
            <td>${endereco}</td>
            <td>${u.admin ? 'Administrador' : 'Ouvinte'}</td>
            <td class="actions">${acoes}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('btnBuscar').addEventListener('click', () => carregarUsuarios(document.getElementById('buscaCpf').value));
document.getElementById('buscaCpf').addEventListener('keydown', e => {
    if (e.key === 'Enter') carregarUsuarios(e.target.value);
});
document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('buscaCpf').value = '';
    carregarUsuarios();
});
document.getElementById('btnSair').addEventListener('click', () => {
    sessionStorage.removeItem('sonoraUsuario');
    window.location.href = 'index.html';
});

carregarUsuarios();