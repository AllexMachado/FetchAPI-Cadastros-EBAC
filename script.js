// Função para formatar CEP enquanto digita
document.getElementById('cep').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;
});

// Função para buscar CEP ao sair do campo (evento blur)
document.getElementById('cep').addEventListener('blur', function(e) {
    const cep = e.target.value.replace(/\D/g, '');
    const statusElement = document.getElementById('cepStatus');
    
    if (cep.length !== 8) {
        statusElement.textContent = '';
        return;
    }

    statusElement.textContent = 'Buscando CEP...';
    statusElement.style.color = '#0066cc';

    // Chamada à API ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                statusElement.textContent = 'CEP não encontrado';
                statusElement.style.color = '#cc0000';
                limparEndereco();
            } else {
                statusElement.textContent = '✓ CEP encontrado';
                statusElement.style.color = '#00cc00';
                preencherEndereco(data);
            }
        })
        .catch(error => {
            statusElement.textContent = 'Erro ao buscar CEP';
            statusElement.style.color = '#cc0000';
            console.error('Erro:', error);
        });
});

// Função para preencher os campos de endereço
function preencherEndereco(dados) {
    document.getElementById('logradouro').value = dados.logradouro || '';
    document.getElementById('bairro').value = dados.bairro || '';
    document.getElementById('cidade').value = dados.localidade || '';
    document.getElementById('estado').value = dados.uf || '';
    
    // Foca no campo número após preencher
    document.getElementById('numero').focus();
}

// Função para limpar campos de endereço
function limparEndereco() {
    document.getElementById('logradouro').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

// Função para salvar dados no Web Storage
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        dataRegistro: new Date().toLocaleString('pt-BR')
    };

    // Salvar no localStorage
    try {
        localStorage.setItem('ultimoUsuario', JSON.stringify(usuario));
        
        // Mensagem de sucesso
        const mensagem = document.getElementById('mensagem');
        mensagem.textContent = 'Usuário cadastrado com sucesso!';
        mensagem.className = 'mensagem sucesso';
        mensagem.style.display = 'block';
        
        // Limpar formulário após 2 segundos
        setTimeout(() => {
            limparFormulario();
            mensagem.style.display = 'none';
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao salvar:', error);
        const mensagem = document.getElementById('mensagem');
        mensagem.textContent = 'Erro ao cadastrar usuário';
        mensagem.className = 'mensagem erro';
        mensagem.style.display = 'block';
    }
});

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('cadastroForm').reset();
    document.getElementById('cepStatus').textContent = '';
}

// Restaurar dados ao carregar a página
window.addEventListener('load', function() {
    const usuarioSalvo = localStorage.getItem('ultimoUsuario');
    
    if (usuarioSalvo) {
        const dados = JSON.parse(usuarioSalvo);
        
        // Opção de restaurar dados
        const restaurar = confirm('Deseja restaurar os dados do último cadastro?');
        
        if (restaurar) {
            document.getElementById('nome').value = dados.nome || '';
            document.getElementById('email').value = dados.email || '';
            document.getElementById('telefone').value = dados.telefone || '';
            document.getElementById('cep').value = dados.cep || '';
            document.getElementById('logradouro').value = dados.logradouro || '';
            document.getElementById('numero').value = dados.numero || '';
            document.getElementById('complemento').value = dados.complemento || '';
            document.getElementById('bairro').value = dados.bairro || '';
            document.getElementById('cidade').value = dados.cidade || '';
            document.getElementById('estado').value = dados.estado || '';
        }
    }
});