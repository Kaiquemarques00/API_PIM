import jwt from "jsonwebtoken";


class Role {

    checkRole(roles) {
        return (req, res, next) => {
            if (!roles.includes(req.role)) return res.status(403).json("Acesso negado!" );
            next();
        }
    }
}

export default Role;