import jwt from "jsonwebtoken";
import User from "../entities/user.js";

export async function userAuthMiddleware(req, res, next) {
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

        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(403).json({ message: "Acesso permitido apenas para usuários" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Erro no auth middleware:", error);
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
}