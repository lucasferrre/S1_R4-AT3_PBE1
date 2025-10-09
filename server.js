const express = require('express');
const app = express();
const PORT = 8081;

// nesse caso eu quero que o express entenda json, ent eu coloco esse midleware para valer para todas as rotas
app.use(express.json());

// função para validar as informações de nome e notas no array
async function validaDados(pNome, pNotas) {
    if (typeof pNome !== "string") {
        throw new Error("O nome é inválido ou está vazio.por favor tente novamente!");   
    }
    // aqui eu valido se não é um array e se a estring está vazia
    if (!Array.isArray(pNotas) || pNotas.length === 0) {
        throw new Error("O array de notas é inválido ou está vazio. Por favor, tente novamente");
    }
    let soma = 0;

    for (let i = 0; i < pNotas.length; i++) {
        const nota = pNotas[i];
        soma += nota; // somando os valores dentro do array
      }

      // calculando a média em relação ao tamanho da array
    const media = soma / pNotas.length;

    let status;
    if (media >= 6) {
        status = "Aprovado";
    } else {
        status = "Reprovado";
    }

    return { media, status };

}

// Crie uma projeto com que tenha uma rota POST /mensagem que atenda as seguintes necessidades:
app.post('/alunos',async (req, res) => {
    try {
        //desestruturação
        const { nome, notas } = req.body;// no post a gente requere ele com body que é o corpo da rquisição
        console.log(`Dados recebidos: Nome=${nome}, Notas=[${notas}]`);

        const { media, status } = await validaDados(nome, notas);
        // coloco o status 201 pois quando faço um post eu 
        // estou criando uma novo registro/requisição, sempre que usarmos post usamos o 201
        res.status(201).json (
                {message:`Dados recebidos com sucesso no servidor.`, aluno:`${nome}`,
                media:`Sua média é de: ${media}`, status:`Seus status é: ${status}`
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