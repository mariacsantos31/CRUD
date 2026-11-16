const usuarioLogado = (() => {
    try {
        return JSON.parse(sessionStorage.getItem('sonoraUsuario'));
    } catch {
        return null;
    }
})();

if (!usuarioLogado) {
    window.location.href = 'index.html';
}

document.getElementById('badgePerfil').textContent = usuarioLogado.admin
    ? 'ADMINISTRADOR'
    : `LOGADO COMO: ${usuarioLogado.nome.toUpperCase()}`;

const tbody = document.getElementById('listaUsuarios');
const mensagem = document.getElementById('mensagem');
const painelEdicao = document.getElementById('painelEdicao');

const normalizarCpf = valor => String(valor || '').replace(/\D/g, '');

function carregarUsuarios(filtroCpf = '') {
    const lista = carregarBanco();
    const termoOriginal = filtroCpf.trim().toLowerCase();
    const termoNumeros = normalizarCpf(filtroCpf);

    const encontrados = lista.filter(u => {
        if (!termoOriginal) return true;
        const cpfUsuario = String(u.cpf || '').toLowerCase();
        const cpfNumeros = normalizarCpf(u.cpf);
        return cpfUsuario.includes(termoOriginal) || (termoNumeros && cpfNumeros.includes(termoNumeros));
    });

    renderizar(encontrados);
    document.getElementById('contador').textContent = `${encontrados.length} usuário(s) encontrado(s)`;
}

function renderizar(lista) {
    tbody.innerHTML = '';
    if (!lista.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 7;
        td.textContent = 'Nenhum usuário encontrado com esse CPF.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    lista.forEach(u => {
        const tr = document.createElement('tr');
        const nomeCompleto = `${u.nome || ''} ${u.sobrenome || ''}`.trim();
        const endereco = [u.rua, u.cidade && u.estado ? `${u.cidade}/${u.estado}` : u.cidade, u.cep]
            .filter(Boolean)
            .join(' · ');
        const tipoConta = u.admin ? 'Administrador' : 'Ouvinte';

        [nomeCompleto, u.cpf, u.email, u.telefone, endereco, tipoConta].forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor || '—';
            tr.appendChild(td);
        });

        const tdAcoes = document.createElement('td');
        tdAcoes.className = 'actions';

        if (u.admin) {
            const protegido = document.createElement('span');
            protegido.className = 'muted';
            protegido.textContent = 'Conta protegida';
            tdAcoes.appendChild(protegido);
        } else {
            const editar = document.createElement('button');
            editar.className = 'btn small secondary';
            editar.textContent = 'Editar';
            editar.addEventListener('click', () => abrirEdicao(u));

            const apagar = document.createElement('button');
            apagar.className = 'btn small danger';
            apagar.textContent = 'Apagar';
            apagar.addEventListener('click', () => apagarUsuario(u));

            tdAcoes.append(editar, apagar);
        }

        tr.appendChild(tdAcoes);
        tbody.appendChild(tr);
    });
}

function abrirEdicao(u) {
    if (u.admin) return;
    document.getElementById('editId').value = u.id;
    document.getElementById('editNome').value = u.nome || '';
    document.getElementById('editSobrenome').value = u.sobrenome || '';
    document.getElementById('editCpf').value = u.cpf || '';
    document.getElementById('editTelefone').value = u.telefone || '';
    document.getElementById('editEmail').value = u.email || '';
    document.getElementById('editSenha').value = u.senha || '';
    document.getElementById('editCep').value = u.cep || '';
    document.getElementById('editRua').value = u.rua || '';
    document.getElementById('editCidade').value = u.cidade || '';
    document.getElementById('editEstado').value = u.estado || '';
    painelEdicao.classList.remove('hidden');
    painelEdicao.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('formEdicao').addEventListener('submit', e => {
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

    if (usuarioLogado.id === id) {
        sessionStorage.setItem('sonoraUsuario', JSON.stringify({
            id: lista[index].id,
            nome: lista[index].nome,
            sobrenome: lista[index].sobrenome,
            email: lista[index].email,
            admin: false
        }));
    }

    mensagem.textContent = 'Dados atualizados com sucesso.';
    mensagem.className = 'notice success';
    painelEdicao.classList.add('hidden');
    carregarUsuarios(document.getElementById('buscaCpf').value);
});

function apagarUsuario(u) {
    if (u.admin) return;
    if (!confirm(`Deseja realmente apagar a conta de ${u.nome}?`)) return;

    const listaAtualizada = carregarBanco().filter(item => item.id !== u.id);
    salvarBanco(listaAtualizada);

    if (usuarioLogado.id === u.id) {
        sessionStorage.removeItem('sonoraUsuario');
        window.location.href = 'index.html';
        return;
    }

    mensagem.textContent = 'Usuário apagado com sucesso.';
    mensagem.className = 'notice success';
    painelEdicao.classList.add('hidden');
    carregarUsuarios(document.getElementById('buscaCpf').value);
}

document.getElementById('btnBuscar').addEventListener('click', () => {
    carregarUsuarios(document.getElementById('buscaCpf').value);
});

document.getElementById('buscaCpf').addEventListener('keydown', e => {
    if (e.key === 'Enter') carregarUsuarios(e.target.value);
});

document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('buscaCpf').value = '';
    carregarUsuarios();
});

document.getElementById('btnCancelar').addEventListener('click', () => {
    painelEdicao.classList.add('hidden');
});

document.getElementById('btnSair').addEventListener('click', () => {
    sessionStorage.removeItem('sonoraUsuario');
    window.location.href = 'index.html';
});

carregarUsuarios();