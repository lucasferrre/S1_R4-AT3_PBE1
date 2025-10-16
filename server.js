const express = require('express');

const fs = require('fs').promises;
const path = require('path');// aqui é uma biblioteca para manipulação do caminho dos arquivos

const app = express();
const PORT = 8081;


// nesse caso eu quero que o express entenda json, ent eu coloco esse midleware para valer para todas as rotas
app.use(express.json());

// aqui eu crio uma variavel para o caminho do arquivo(__dirname é o caminho absoluto do diretório onde o arquivo do código atual está sendo executado)
const arquivo_usuarios = path.join(__dirname, 'usuarios.json');


//Aqui eu crio uma função para Verificar se o arquivo existe 
async function verificarArquivo() {
    const existe = await fs
      .access(arquivo_usuarios)
      .then(() => true)
      .catch(() => false);
  
    // aqui se ele não existir eu crio esse arquivo
    if (!existe) {
      await fs.writeFile(arquivo_usuarios, JSON.stringify([], null, 2));
      console.log('Arquivo usuarios.json criado com conteúdo inicial.');
    }
  }

  verificarArquivo();

// função para validar as informações de nome, email, e senha
async function validaUsuario(pNome, pEmail, pSenha) {
    if (typeof pNome !== 'string' || pNome.length < 3) {
      throw new Error('O nome é obrigatório e deve ter no mínimo 3 caracteres.');
    }
  
    if (typeof pEmail !== 'string' || !pEmail.includes('@')) {
      throw new Error('O email é obrigatório e deve ser um endereço válido (conter @).');
    }

    // aqui eu considero a senha um array pra poder validar certinho a quantidade de elementos
    if (!Array.isArray(pSenha) ||  pSenha.length < 4) {
        throw new Error('A senha deve ser um array com no mínimo 4 elementos.');
    }

    // aqui eu crio uma variavel para guardar essas informações de nome, email e senha
    const novoUsuario = { nome: pNome, email: pEmail, senha: pSenha };

    // Lê o conteúdo atual
    const dadosAtuais = await fs.readFile(arquivo_usuarios, 'utf-8');

    const usuarios = JSON.parse(dadosAtuais);

    // Adiciona novo usuário e grava novamente sem apagar o antigo se existir
    usuarios.push(novoUsuario);
    await fs.writeFile(arquivo_usuarios, JSON.stringify(usuarios, null, 2));

    return { novoUsuario };
}

// rota POST /usuarios
app.post('/usuarios',async (req, res) => {
    try {
        //desestruturação
        const { nome, email, senha } = req.body;// no post a gente requere ele com body que é o corpo da rquisição
        const resultado = await validaUsuario(nome, email, senha);
        console.log(`Dados recebidos!: Nome = ${nome}, Email = ${email}, Senha = ${senha}`)
        
        // coloco o status 201 pois quando faço um post eu 
        // estou criando uma novo registro/requisição, sempre que usarmos post usamos o 201
        res.status(201).json({message:`Dados recebidos com sucesso no servidor.`,
            mensagem: 'Usuário cadastrado com sucesso!',Nome: `${nome}`, Email:`${email}`, Senha:`${senha}`
            });


    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Ocorreu um erro ao processar a solicitação!',
        errorMessage: error.message});
    }

});

// rota para erro 404 quando a página não for encontrada em relação a URL
app.use((req, res) => {
    res.status(404).send('Página não encontrada!');
});

// start do servidor
app.listen(PORT, ()=>{
    console.log(`servidor respondendo em: http://localhost:${PORT}`);
});
