/*
    Eduardo Fernando De Almeida Loschi - RA: 2509964
    João Vitor Quirino Ramos - RA: 2526428
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Pool = require('pg').Pool;
var readlineSync = require('readline-sync');
var dbConfig = {
    user: 'aluno',
    host: 'localhost',
    database: 'db_profedu',
    password: '102030',
    port: 5432,
};
var pool = new Pool(dbConfig);
function menu() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("--------- Kahoot Menu ----------");
                    console.log("1 - Cadastrar perguntas e respostas");
                    console.log("2 - Iniciar perguntas e respostas");
                    console.log("3 - Placar");
                    console.log("4 - Sair");
                    choice = readlineSync.question('Escolha uma opcao: ');
                    _a = choice;
                    switch (_a) {
                        case '1': return [3 /*break*/, 1];
                        case '2': return [3 /*break*/, 3];
                        case '3': return [3 /*break*/, 5];
                        case '4': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 1: return [4 /*yield*/, cadastrarPerguntas()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 3: return [4 /*yield*/, iniciarKahoot()];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 5: return [4 /*yield*/, placar()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 7:
                    console.log("Saindo...");
                    return [4 /*yield*/, pool.end()];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
                case 9:
                    console.log("Opcao invalida. Tente novamente.");
                    _b.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
function cadastrarPerguntas() {
    return __awaiter(this, void 0, void 0, function () {
        var loop, id, qntdPerguntas, i, pergunta, client, insertQuery, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = 0;
                    qntdPerguntas = readlineSync.questionInt("Quantas perguntas deseja cadastrar? ");
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < qntdPerguntas)) return [3 /*break*/, 7];
                    id++;
                    pergunta = {
                        perguntaid: id,
                        pergunta: readlineSync.question("Texto da pergunta: "),
                        respostasErrada1: readlineSync.question("Resposta errada 1: "),
                        respostasErrada2: readlineSync.question("Resposta errada 2: "),
                        respostasErrada3: readlineSync.question("Resposta errada 3: "),
                        respostaCerta: readlineSync.question("Resposta certa: "),
                        pontuacao: readlineSync.questionInt("Pontuacao da pergunta: ")
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, pool.connect()];
                case 3:
                    client = _a.sent();
                    insertQuery = "\n                INSERT INTO kahoot (perguntaid, pergunta, respostasErrada1, respostasErrada2, respostasErrada3, respostaCerta, pontuacao)\n                VALUES ($1, $2, $3, $4, $5, $6, $7) ";
                    return [4 /*yield*/, client.query(insertQuery, [
                            pergunta.perguntaid,
                            pergunta.pergunta,
                            pergunta.respostasErrada1,
                            pergunta.respostasErrada2,
                            pergunta.respostasErrada3,
                            pergunta.respostaCerta,
                            pergunta.pontuacao
                        ])];
                case 4:
                    _a.sent();
                    client.release();
                    console.log("Pergunta cadastrada com sucesso!\n");
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Erro ao cadastrar pergunta:", error_1);
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function iniciarKahoot() {
    return __awaiter(this, void 0, void 0, function () {
        var client, selectQuery, res, pontuacaoTotal, _i, _a, row, opcoes, i, j, resposta, client_1, insertUserQuery, nomeUsuario, error_2, error_3;
        var _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("--------- Iniciando Kahoot ----------");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, pool.connect()];
                case 2:
                    client = _d.sent();
                    selectQuery = "SELECT * FROM kahoot ORDER BY RANDOM()";
                    return [4 /*yield*/, client.query(selectQuery)];
                case 3:
                    res = _d.sent();
                    client.release();
                    pontuacaoTotal = 0;
                    for (_i = 0, _a = res.rows; _i < _a.length; _i++) {
                        row = _a[_i];
                        console.log("\n------------------------------------");
                        console.log("Pergunta: ".concat(row.pergunta));
                        opcoes = [
                            { texto: row.respostaserrada1, correta: false },
                            { texto: row.respostaserrada2, correta: false },
                            { texto: row.respostaserrada3, correta: false },
                            { texto: row.respostacerta, correta: true }
                        ];
                        // 🔹 Embaralha as opções de resposta (algoritmo Fisher–Yates)
                        for (i = opcoes.length - 1; i > 0; i--) {
                            j = Math.floor(Math.random() * (i + 1));
                            _b = [opcoes[j], opcoes[i]], opcoes[i] = _b[0], opcoes[j] = _b[1];
                        }
                        // 🔹 Exibe opções numeradas
                        opcoes.forEach(function (op, i) {
                            console.log("".concat(i + 1, ") ").concat(op.texto));
                        });
                        resposta = readlineSync.questionInt("Sua resposta (1-4): ");
                        if ((_c = opcoes[resposta - 1]) === null || _c === void 0 ? void 0 : _c.correta) {
                            console.log("Resposta correta!");
                            pontuacaoTotal += row.pontuacao;
                        }
                        else {
                            console.log("Errado!");
                        }
                    }
                    console.log("\n------------------------------------");
                    console.log("Pontua\u00E7\u00E3o final: ".concat(pontuacaoTotal));
                    console.log("------------------------------------");
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 7, , 8]);
                    return [4 /*yield*/, pool.connect()];
                case 5:
                    client_1 = _d.sent();
                    insertUserQuery = "\n                INSERT INTO usuario (nome, pontuacaoFinal)\n                VALUES ($1, $2) ";
                    nomeUsuario = readlineSync.question('Digite seu nome para registrar a pontuacao final: ');
                    return [4 /*yield*/, client_1.query(insertUserQuery, [nomeUsuario, pontuacaoTotal])];
                case 6:
                    _d.sent();
                    client_1.release();
                    console.log(" Pontua\u00E7\u00E3o de ".concat(nomeUsuario, " registrada com sucesso!"));
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _d.sent();
                    console.error("Erro ao registrar pontuacao do usuario:", error_2);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_3 = _d.sent();
                    console.error("Erro ao iniciar Kahoot:", error_3);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function placar() {
    return __awaiter(this, void 0, void 0, function () {
        var client, selectPlacarQuery, res, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n------ Placar  -------");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, pool.connect()];
                case 2:
                    client = _a.sent();
                    selectPlacarQuery = "\n            SELECT nome, pontuacaofinal\n            FROM usuario\n            ORDER BY pontuacaofinal DESC\n        ";
                    return [4 /*yield*/, client.query(selectPlacarQuery)];
                case 3:
                    res = _a.sent();
                    client.release();
                    if (res.rows.length === 0) {
                        console.log("Nenhum jogador registrado ainda.\n");
                        return [2 /*return*/];
                    }
                    res.rows.forEach(function (user, index) {
                        console.log("".concat(index + 1, ". ").concat(user.nome, " - ").concat(user.pontuacaofinal, " pontos"));
                    });
                    console.log("--------------------------------\n");
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("Erro ao buscar placar:", error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function prepararAmbiente() {
    return __awaiter(this, void 0, void 0, function () {
        var client, createTableQuery, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    createTableQuery = "\n            CREATE TABLE IF NOT EXISTS kahoot (\n            perguntaid INTEGER,\n            pergunta VARCHAR(200),\n            respostasErrada1 VARCHAR(125),\n            respostasErrada2 VARCHAR(125),\n            respostasErrada3 VARCHAR(125),\n            respostaCerta VARCHAR(125),\n            pontuacao REAL\n            ); \n            CREATE TABLE IF NOT EXISTS usuario (\n            nome VARCHAR(100),\n            pontuacaoFinal REAL\n            );\n        ";
                    return [4 /*yield*/, client.query(createTableQuery)];
                case 2:
                    _a.sent();
                    client.release();
                    console.log("Ambiente preparado com sucesso!");
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error("Erro ao preparar ambiente:", error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepararAmbiente()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, menu()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
