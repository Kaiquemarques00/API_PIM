import jwt from "jsonwebtoken";


class Token {

    checkToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if(!token) return res.status(401).json("Acesso negado");

        try {
            
            const secret = process.env.SECRET;

            jwt.verify(token, secret, (err, decoded) => {
                if (err) return res.status(401).json("Falha na autenticação do token!");
                req.id = decoded.id;
                req.role = decoded.role;
                next();
            });

        } catch (error) {
            res.status(400).json("Token inválido");
        }
    }
}

export default Token;