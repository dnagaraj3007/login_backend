import bcrypt from 'bcryptjs';
import {User, validate} from '../models/user.model';
let api ={}
api.test = (req,res) => {
    console.log("get");
}

api.getCurrentUser = (req,res) => {
    console.log("get");
    User.findById(req.user._id).select('-password').then((user)=>{
    	if(!user){
    		res.status(400).send({
    			message: 'User not found'
    		})
    	}
    	res.status(200).send(user);
    }).catch((err) =>{
    	res.status(500).send({
    		message : err.message || 'Error fetching current user'
    	})
    })
}

api.createNewUser = (req,res) =>{
    const result = validate(req.body)
    if(result.error){
        return res.status(400).send({
            message: result.error.details[0].message
        })
    }
    User.findOne({email:req.body.email}).then((data)=>{
        if(data){
            return res.status(400).send("User already registered with email id " +req.body.email );
        }
    }).catch((err)=>{
    	return res.status(500).send({
    		message: err.message || "Error fetching user"
    	})
    })
    let user = new User({
        name:req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    bcrypt.hash(user.password,10).then((password) =>{
        user.password = password
        return user.save()
    }).then(()=>{
        const token = user.generateAuthToken();
        return res.header("x-auth-token", token).send({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }).catch(err =>{
    	return res.status(500).send({
    		message : err.message || "Error generating token"
    	})
    })
} 

export default api