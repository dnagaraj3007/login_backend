import jwt from 'jsonwebtoken';
import config from 'config';

const verifyToken = (req, res, next) => {
	const token = req.headers['x-access-token'] || req.headers['authorization']
	if(!token){
		res.status(401).send({
			message: 'Access denied. No token provided'
		})
	}

	try{
		const decoded = jwt.verify(token, config.get('myprivatekey'));
		req.user = decoded;
		next()
	}catch(ex){
		res.status(400).send({
			message: 'Invalid token'
		})
	}
}

export const auth = verifyToken;