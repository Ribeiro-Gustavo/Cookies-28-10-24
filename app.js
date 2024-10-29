// importando express
const express = require("express");

//cookies e sessions
const session = require("express-session");
const cookieParser = require("cookie-parser");

//inicializar express
const app = express();

app.use(cookieParser());

app.use(session(
    {
        secret: "123456789", // chave para acessar os cookies
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // habilitar cookies over HTTPS
    }
));

// dados de exemplo
const produtos = [
        {id: 1, nome: "Notebook", preco: 2500,},
        { id: 2 , nome: "Celular", preco:3500,},
        { id: 3, nome: "Tablet", preco: 1500,},
        { id: 4 , nome: "Videogame", preco:5000,}
    ];

app.get('/produtos', (req, res) => {
    res.send(`
        <h1>Produtos</h1>
        <ul>
        <li>
            ${produtos.map(produto => `<li>${produto.nome} - R$ ${produto.preco}</li>`).join("")}
            <a href="/adicionar/${produtos.id}
            ">Adicionar ao carrinho</a>
        </li>
        </ul>
        <a href="/carrinho">Carrinho</a>
    `)
});

//rota de adicionar produto 
        app.get("/adicionar/:id", (req, res) => {
            const id = parseInt(req.params.id);

            const produto = produtos.find((p) => p.id === id);

            if(produto) {
                if (!req.session.carrinho){
                    req.session.carrinho = [];
                }
                req.session.carrinho.push(produto);
            }

            res.redirect("/produtos");
        });

// rota do carrinho
app.get("/carrinho", (req, res) => {
    const carrinho = req.session.carrinho || [];

    res.send(`
        <h1>Carrinho</h1>
        <ul>
        <li>
            ${carrinho.map(produtos => `<li>${produtos.nome} - R$ ${produtos.preco}</li>`).join("")}
        </li>
        </ul>
        <a href="/finalizar">Finalizar compra</a>
    `)
})

app.listen(8080);