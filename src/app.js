import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Mantén una lista de productos en el servidor
const products = [];

// Ruta para "realTimeProducts"
app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {
        realTimeProducts: products // Pasa la lista de productos en tiempo real a la vista
    });
});

// Configuración de Socket.io
const httpServer = app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });

    socket.emit("welcome", "welcome to websocket");

    socket.on("newPrice", (product) => {
        // Agrega el nuevo producto a la lista de productos
        products.push(product);

        // Emite la lista completa de productos actualizada
        socketServer.emit("priceUpdated", products);
    });

    socket.on("deleteProduct", (productId) => {
        const productIndex = products.findIndex((product) => product.id === productId);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            socketServer.emit("priceUpdated", products); // Emitir la lista actualizada
        }
    });
    
});
