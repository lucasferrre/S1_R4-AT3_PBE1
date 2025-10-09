const express = require('express');
const app = express();
const PORT = 8081;

// nesse caso eu quero que o express entenda json, ent eu coloco esse midleware para valer para todas as rotas
app.use(express.json());

// função para validar as informações de nome e notas no array
async function validaNumeros(pNumeros) {

    // aqui eu valido se não é um array e se a estring está vazia
    if (!Array.isArray(pNumeros) || pNumeros.length === 0) {
        throw new Error("O array de notas é inválido ou está vazio. Por favor, tente novamente");
    }
    let soma = 0;

    for (let i = 0; i < pNumeros.length; i++) {
        const nota = pNumeros[i];
        soma += nota; // somando os valores dentro do array
      }

    return {soma};

}

// Crie uma projeto com que tenha uma rota POST /mensagem que atenda as seguintes necessidades:
app.post('/soma',async (req, res) => {
    try {
        //desestruturação
        const { numeros } = req.body;// no post a gente requere ele com body que é o corpo da rquisição
        console.log(`Dados recebidos: Nome=${nome}, Notas=[${notas}`);

        const { soma } = await validaNumeros(numeros);
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