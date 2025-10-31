/*
    Eduardo Fernando De Almeida Loschi - RA: 2509964
    João Vitor Quirino Ramos - RA: 2526428 
 */

const { Pool } = require('pg');
const readlineSync = require('readline-sync');

const dbConfig = {
  user: 'aluno',
  host: 'localhost',
  database: 'db_profedu',
  password: '102030',
  port: 5432,
};

const pool = new Pool(dbConfig);

type Pergunta = {
    perguntaid: number;
    pergunta: string;
    respostasErrada1: string;
    respostasErrada2: string;
    respostasErrada3: string;
    respostaCerta: string;
    pontuacao: number;
}

async function menu() {
    console.log("--------- Kahoot Menu ----------");
    console.log("1 - Cadastrar perguntas e respostas");
    console.log("2 - Iniciar perguntas e respostas");
    console.log("3 - Placar")
    console.log("4 - Sair");
    const choice = readlineSync.question('Escolha uma opcao: ');

    switch (choice) {
        case '1':
            await cadastrarPerguntas();
            break;
        case '2':
            await iniciarKahoot();
            break;
        case '3':
            await placar();
            break;
        case '4':
            console.log("Saindo...");
            await pool.end();
            return;
    default:
        console.log("Opcao invalida. Tente novamente.");
    }
}

async function cadastrarPerguntas() {
    let loop: boolean;
    let id = 0;
    let qntdPerguntas = readlineSync.questionInt("Quantas perguntas deseja cadastrar? ");
    for (let i = 0; i < qntdPerguntas; i++) {
        id++;
        let pergunta: Pergunta = {
            perguntaid: id,
            pergunta: readlineSync.question("Texto da pergunta: "),
            respostasErrada1: readlineSync.question("Resposta errada 1: "),
            respostasErrada2: readlineSync.question("Resposta errada 2: "),
            respostasErrada3: readlineSync.question("Resposta errada 3: "),
            respostaCerta: readlineSync.question("Resposta certa: "),
            pontuacao: readlineSync.questionInt("Pontuacao da pergunta: ")
        }

        try {
            const client = await pool.connect();
            const insertQuery = `
                INSERT INTO kahoot (perguntaid, pergunta, respostasErrada1, respostasErrada2, respostasErrada3, respostaCerta, pontuacao)
                VALUES ($1, $2, $3, $4, $5, $6, $7) `;
            await client.query(insertQuery, [
                pergunta.perguntaid,
                pergunta.pergunta,
                pergunta.respostasErrada1,
                pergunta.respostasErrada2,
                pergunta.respostasErrada3,
                pergunta.respostaCerta,
                pergunta.pontuacao
            ]);
            client.release();
            console.log("Pergunta cadastrada com sucesso!\n");
        } catch (error) {
            console.error("Erro ao cadastrar pergunta:", error);
        }
         
        
}
    return;
}

async function iniciarKahoot() {
    console.log("--------- Iniciando Kahoot ----------");
    try {
        const client = await pool.connect();

        // 🔹 Randomiza a ordem das perguntas diretamente no banco
        const selectQuery = `SELECT * FROM kahoot ORDER BY RANDOM()`;
        const res = await client.query(selectQuery);
        client.release();

        let pontuacaoTotal = 0;
        for (const row of res.rows) {
            console.log("\n------------------------------------");
            console.log(`Pergunta: ${row.pergunta}`);

            // 🔹 Cria array com todas as respostas
            let opcoes = [
                { texto: row.respostaserrada1, correta: false },
                { texto: row.respostaserrada2, correta: false },
                { texto: row.respostaserrada3, correta: false },
                { texto: row.respostacerta, correta: true }
            ];

            // 🔹 Embaralha as opções de resposta (algoritmo Fisher–Yates)
            for (let i = opcoes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [opcoes[i], opcoes[j]] = [opcoes[j], opcoes[i]];
            }

            // 🔹 Exibe opções numeradas
            opcoes.forEach((op, i) => {
                console.log(`${i + 1}) ${op.texto}`);
            });

            // 🔹 Recebe a escolha do usuário
            const resposta = readlineSync.questionInt("Sua resposta (1-4): ");

            if (opcoes[resposta - 1]?.correta) {
                console.log("Resposta correta!");
                pontuacaoTotal += row.pontuacao;
            } else {
                console.log("Errado!");
            }
        }

        console.log("\n------------------------------------");
        console.log(`Pontuação final: ${pontuacaoTotal}`);
        console.log("------------------------------------");
        
        try {
            const client = await pool.connect();
            const insertUserQuery = `
                INSERT INTO usuario (nome, pontuacaoFinal)
                VALUES ($1, $2) `;
            const nomeUsuario = readlineSync.question('Digite seu nome para registrar a pontuacao final: ');
            await client.query(insertUserQuery, [nomeUsuario, pontuacaoTotal]);
            client.release();
            console.log(` Pontuação de ${nomeUsuario} registrada com sucesso!`);
        } catch (error) {
            console.error("Erro ao registrar pontuacao do usuario:", error);
        }
    } catch (error) {
        console.error("Erro ao iniciar Kahoot:", error);
    }
}

async function placar() {
    console.log("\n------ Placar  -------");

    try {
        const client = await pool.connect();
        const selectPlacarQuery = `
            SELECT nome, pontuacaofinal
            FROM usuario
            ORDER BY pontuacaofinal DESC
        `;
        const res = await client.query(selectPlacarQuery);
        client.release();

        if (res.rows.length === 0) {
            console.log("Nenhum jogador registrado ainda.\n");
            return;
        }

        res.rows.forEach((user, index) => {
            console.log(`${index + 1}. ${user.nome} - ${user.pontuacaofinal} pontos`);
        });
        console.log("--------------------------------\n");
    } catch (error) {
        console.error("Erro ao buscar placar:", error);
    }
}


async function prepararAmbiente() {
    try {
        const client = await pool.connect();
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS kahoot (
            perguntaid INTEGER,
            pergunta VARCHAR(200),
            respostasErrada1 VARCHAR(125),
            respostasErrada2 VARCHAR(125),
            respostasErrada3 VARCHAR(125),
            respostaCerta VARCHAR(125),
            pontuacao REAL
            ); 
            CREATE TABLE IF NOT EXISTS usuario (
            nome VARCHAR(100),
            pontuacaoFinal REAL
            );
        `;
        await client.query(createTableQuery);
        client.release();
        console.log("Ambiente preparado com sucesso!");
    } catch (error) {
        console.error("Erro ao preparar ambiente:", error);

}
}

async function main() {
    await prepararAmbiente();
    await menu();
}

main();