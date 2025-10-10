const express = require('express');
const app = express();
const PORT = 8081;

// nesse caso eu quero que o express entenda json, ent eu coloco esse midleware para valer para todas as rotas
app.use(express.json());

// função para validar as informações de nome e notas no array
async function validaNumeros(pNumeros) {

    // aqui eu valido se não é um array e se a estring está vazia
    if (!Array.isArray(pNumeros) || pNumeros.length === 0 ) {
        throw new Error("O array de notas é inválido ou está vazio. Por favor, tente novamente");
    }

     // Aqui verifica se todos os itens são números válidos
    /*  O some é uma função que testa se pelo menos um item do array atende a uma condição.
        Se um ou mais elementos passarem no teste, ele retorna true.
        Se nenhum passar, ele retorna false. */
    const numInvalido = pNumeros.some(num => typeof num !== 'number' || isNaN(num));

    // Aqui ele entra no if se algum valor do array não for um número
    if (numInvalido) {
        throw new Error("O array contém valores inválidos (como strings ou NaN). Use apenas números.");
    }
    
    // nesse caso se for false o retorno de num
    // aqui eu faço o calculo da soma utilizando o reduce
    const soma = pNumeros.reduce((acumulador, numero) => acumulador + numero);

    return {soma};

}

// Crie uma projeto com que tenha uma rota POST /mensagem que atenda as seguintes necessidades:
app.post('/soma',async (req, res) => {
    try {
        //desestruturação
        const { numeros } = req.body;// no post a gente requere ele com body que é o corpo da rquisição
        const { soma } = await validaNumeros(numeros);
        console.log(`Dados recebidos: Numeros = ${numeros}, soma = ${soma}`);

        // coloco o status 201 pois quando faço um post eu 
        // estou criando uma novo registro/requisição, sempre que usarmos post usamos o 201
        res.status(201).json (
                {message:`Dados recebidos com sucesso no servidor.`, soma:`${soma}`
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