import express from 'express';
import {auth} from '../middleware/auth';
import bcrypt from 'bcryptjs';
import {User, validate} from '../models/user.model';

const router = express.Router();
console.log("route");

router.get('/current', auth, (req,res) => {
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
})

router.post('/', (req,res) =>{
    console.log("post");
    const error = validate(req.body);
    if(error){
        return res.status(400).send({
            message: error.details[0].message
        })
    }
    User.findOne({email:req.body.email}).then((data)=>{
        if(data){
            res.status(400).send("User already registered with email id " +req.body.email );
        }
    })
    let user = new User({
        name:req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    bcrypt.hash(user.password,10).then((data)=>{
        user.password = data;
        user.save().then((data)=>{
            if(data){
                const token= user.generateAuthToken();
                res.header('x-auth-token', token).status(200).send({
                    id:user._id,
                    name:user.name,
                    email: user.email
                })
            }
        }).catch((err)=>{
            res.status(500).send({
                message: err.message
            })
        })
    }).catch((err)=>{
        res.status(500).send({
            message: err.message
        })
    })
} )

export default router;