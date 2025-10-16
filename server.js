const express = require('express');
const app = express();
const PORT = 8081;

// nesse caso eu quero que o express entenda json, ent eu coloco esse midleware para valer para todas as rotas
app.use(express.json());

// função para validar as informações dos números 
async function validaNumeros(pNumeros) {

    // aqui eu valido se não é um array e se a estring está vazia
    if (!Array.isArray(pNumeros) || pNumeros.length === 0 ) {
        throw new Error("O array de numeros é inválido ou está vazio. Por favor, tente novamente");
    }

     // Aqui eu estou filtrando somente os números válidos
    /*  O filter é um método de array que percorre todos os elementos
        e cria um novo array apenas com os itens que passam em uma condição.
        E ele não altera o array original. nesse caso eu to validando se os números 
        são validos ent ele cria uma nova array só com os números válidos */
    const numerosValidos = pNumeros.filter(num => typeof num === 'number' && !isNaN(num));

    // Aqui ele entra no if se dentro do array não tiver nenhum número válido
    if (numerosValidos.length === 0) {
        throw new Error("Nenhum valor numérico válido foi encontrado no array.");
    }
    
    // aqui eu faço o calculo da soma com base nos numeros validados e utilizando o reduce
    const soma = numerosValidos.reduce((acumulador, numero) => acumulador + numero);

    return {soma, numerosValidos};

}

// rota POST /soma 
app.post('/soma',async (req, res) => {
    try {
        //desestruturação
        const { numeros } = req.body;// no post a gente requere ele com body que é o corpo da rquisição
        const { soma, numerosValidos } = await validaNumeros(numeros);
        console.log(`Dados recebidos: Numeros = ${numerosValidos}, soma = ${soma}`);

        // coloco o status 201 pois quando faço um post eu 
        // estou criando uma novo registro/requisição, sempre que usarmos post usamos o 201
        res.status(201).json (
                {message:`Dados recebidos com sucesso no servidor.`,numerosValidos:`${numerosValidos}`,soma:`${soma}`
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