import jwt from "jsonwebtoken";

export default (request, response, next) => {
    
    const token = (request.headers.authorization || '').split(' ')[1];
    console.log(token);
    if (token) {
        try {
            const decoded = jwt.verify(token, 'todosSK');
            request.userId = decoded._id;
            next();
        } catch (error) {
            console.log(error)
            return response.status(403).json({
                message: 'Invalid token'
            })
        }
    } else {
        return response.status(403).json({
            message: 'Not allow'
        })
    }
}