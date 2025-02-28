const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendMail = require('../helper/email')
require('dotenv').config();
const key = process.env.key
const signup = require('../helper/signup')
const resetPass = require('../helper/resetPass')


exports.createUser = async (req, res) => {
    try {
    const { fullName, email, password, address } = req.body;

        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);

        const data = {
            fullName,
            email,
            password:hash,
            address,

        }
        const newUser = await userModel.create(data)

        const token = await jwt.sign({id:newUser._id}, key, {expiresIn: '5mins'})
        const link = `${req.protocol}://${req.get('host')}/mail/${newUser._id}/${token}`
        console.log(link)
        const subject = "welcome" + " " + fullName;
        const text  =`welcome ${newUser.fullName}, Kindly use this link to verify your email ${link}`;
        sendMail({ subject:subject, email:newUser.email, html:signup(link, newUser.fullName) })
            return res.status(201).json({
            message: "New User is Created Successfully",
            data: newUser
        })
    } catch (error) {
        res.status(500).json({ 
            message: error.message });
    }
};

exports.verifyMail = async (req, res) => {
    try{

        const { id } = req.params
        console.log(req.params.token)
        const checkuser = await userModel.findById( id )
       if(checkuser.isVerified== true){
        return res.status(400).json({message: "email already been verified"})
       }
        await jwt.verify(req.params.token, key, (error)=>{
            
        if(error){
            return res.status(404).json({
                message: "Email Link Has Expired"
            })   
        }
     } )
        const verifyingMail = await userModel.findByIdAndUpdate(id, {isVerified:true})
        res.status(200).json({
            message: "email verified successfully"
        })
    }catch(error){
        console.error(error.message);
    }
}

exports.userLogin = async (req, res) => {
    try{
        const { email, passWord } = req.body
        const checkEmail = await userModel.findOne({email})
        if(!checkEmail){
            return res.status(404).json({
                message: "Email not found"
            })
        }
        const checkPassword = await bcrypt.compare(passWord, checkEmail.password)
        if(!checkPassword){
            return res.status(400).json({
                message:" InCorrect Password"
            })
        }
        if(checkEmail.isVerified == false){
            return res.status(404).json({
                message: 'Email not Verified'
            })
        }

        const token = await jwt.sign({id:checkEmail._id}, key, {expiresIn: '24hr'})
        res.status(200).json({
            message: "Login Succesfully",
            token
        })

    }catch(error){
        res.status(500).json({
            message: "Unable to Login" + error.message
        })
    }
}

exports.resetPassword = async (req, res)=>{
    try{
        const { email } = req.body;
        const checkEmail = await userModel.findOne({email})
        if(!checkEmail){
            return res.status(404).json({
                message: 'Email not found'
            })
        }
        if(checkEmail.isVerified == false ){
            return res.status(403).json({
                message: 'Please verify your email first'
            })
        }
        const token = jwt.sign({id:checkEmail._id}, process.env.key, {expiresIn: '10min'})
        const link = `${req.protocol}://${req.get('host')}/resetPassword/${checkEmail._id}/${token}`
        const subject = "Reset Password" + " " + checkEmail.fullName;
        const text = `Reset Password ${checkEmail.fullName}, kindly use this link to reset your password ${link} `;
         sendMail({subject:subject, email:checkEmail.email, html:resetPass(link, checkEmail.fullName)})
         res.status(200).json({
            message: 'Reset password link sent successfully'
        })
                        

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.resetNewPassword = async (req, res) =>{
    try{
        const {newPassword} = req.body;
        const checkUser = await userModel.findById(req.params.id)
        if(!checkUser){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(newPassword, salt);
       
        await userModel.findByIdAndUpdate(req.params.id, {password:hash})
        
        res.status(200).json({
            message: 'Password change Successfully'
        })

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.changePassword = async (req, res) =>{
    try{
        const { id, newPassword } = req.body;
        const checkUser = await userModel.findById( id )
        if(!checkUser){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        

        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(newPassword, salt);
        const findUser = await userModel.findByIdAndUpdate(id, {password: hashedPassword})
        
        if(!findUser){
            return res.status(400).json({
                message: 'Failed to change password'
            })

        }
        res.status(200).json({
            message: 'Password changed successfully'
        })
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}