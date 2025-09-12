import jwt from "jsonwebtoken";
import Artist from "../entities/artist.js";

export async function artistAuthMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token inválido" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const artist = await Artist.findOne({ where: { email: decoded.email } });

        if (!artist) {
            return res.status(403).json({ message: "Acesso permitido apenas para artistas" });
        }

        req.artist = artist;
        next();
    } catch (error) {
        console.error("Erro no auth middleware:", error);
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
}