import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("websocket");
});



router.get("/realtimeproducts", (req, res) => {
    console.log("Ruta '/realtimeproducts' alcanzada");
    res.render("realTimeProducts");
});

export default router;
