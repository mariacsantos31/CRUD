const ADMIN_PADRAO = {
    id: 1,
    nome: "Administrador",
    sobrenome: "SONORA",
    cpf: "000.000.000-00",
    email: "admin@admin",
    senha: "admin",
    rua: "Av. Paulista, 1000",
    cep: "01310-100",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 99999-9999",
    admin: true
};

function carregarBanco() {
    let lista = [];
    const salvo = localStorage.getItem('sonora_usuarios');

    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            if (Array.isArray(parsed)) {
                lista = parsed.filter(u =>
                    u.admin !== true &&
                    String(u.email || '').trim().toLowerCase() !== 'admin@admin'
                );
            }
        } catch {
            lista = [];
        }
    }

    lista.unshift({ ...ADMIN_PADRAO });
    salvarBanco(lista);
    return lista;
}

function salvarBanco(lista) {
    localStorage.setItem('sonora_usuarios', JSON.stringify(lista));
}