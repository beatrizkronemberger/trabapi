const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Configurando o middleware para analisar os corpos das requisições
app.use(bodyParser.urlencoded({ extended: false }));

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('database.db');

// Criar tabela se não existir
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS contatos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, mensagem TEXT)");
});

// Rota para a página do formulário
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Rota para processar o formulário
app.post('/submit', (req, res) => {
  const { nome, email, mensagem } = req.body;

  // Exibir informações no console
  console.log(`Nome: ${nome}, Email: ${email}, Mensagem: ${mensagem}`);

  // Inserir dados no banco de dados
  const stmt = db.prepare("INSERT INTO contatos (nome, email, mensagem) VALUES (?, ?, ?)");
  stmt.run(nome, email, mensagem);
  stmt.finalize();

  res.send('Formulário enviado com sucesso!');
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});