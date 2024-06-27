//iniciar el servidor
const express = require("express");
const db = require("./db");

//Creamos el servidor
const app = express();

// Datos en memoria
let products = [];
let nextId = 1;

//Utilizamos Minddlewares
app.use(express.text());
app.use(express.json());

//Creamos las rutas
//Pagina de Inicio
app.get("/", (req, res) => {
    res.send("Pagina de Productos");
});

//Obtenemos la lista de los productos
app.get("/products", (req, res) =>{
res.json(db);
});


//Devuelve un único producto según el id recibido por el parámetro
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});



//Crear un producto
app.post("/products", (req, res) => {
    const { name, quantity, price } = req.body;
    if (!name || quantity == null || price == null) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }
    const newProduct = {
        id: nextId++,
        name,
        quantity,
        price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

//Actualizar un producto
app.put("/products/:id", (req,res) => {
    const id = parseInt(req.params.id);
    const {name, quantity, price} = req.body;
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (!name && quantity == null && price == null) {
        return res.status(400).json({ message: 'No se obtuvo datos para actualizar' });
    }

    if (name) products[productIndex].name = name;
    if (quantity != null) products[productIndex].quantity = quantity;
    if (price != null) products[productIndex].price = price;

    res.json(products[productIndex]);
});


//Eliminar Producto
app.delete("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);
    res.status(204).send();
});


//Corremos el servidor en el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`servidor en puerto ${PORT}`));