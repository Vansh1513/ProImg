import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import TryCatch from "../utils/TryCatch.js";
import bcrypt from 'bcrypt';



export const registerUser=TryCatch(async (req, res) => {
    const { name, email, password } = req.body;
  
    let user = await User.findOne({ email });
  
    if (user)
      return res.status(400).json({
        message: "Already have an account with this email",
      });
  
    const hashPassword = await bcrypt.hash(password, 10);
  
    user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    generateToken(user._id,res);

    res.status(201).json({
        user,
        message:"user registered",
    });

    

});


export const loginUser=TryCatch(async(req,res)=>{
    const{email,password }=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"No user found",
        });
    }
    const comaparePassword=await bcrypt.compare(password,user.password);


    if(!comaparePassword){
        return res.status(400).json({
            message:"Incorrect Password",
        });

    }
    generateToken(user._id,res);


    res.json({
        user,
        message:"Logged In",

    })

});

export const myProfile=TryCatch(async(req,res)=>{
    const user=await User.findById(req.user._id)
    res.json(user);
})

export const userProfile= TryCatch(async(req,res)=>{
    const user= await User.findById(req.params.id).select("-password");
    res.json(user);
})


export const followAndUnfollow=TryCatch(async(req,res)=>{
    const user= await User.findById(req.params.id);
    const loggedInUser=await User.findById(req.user._id);
    if(!user)
        return res.status(400).json({
            message:"No user with this id",
    });

    if(user._id.toString()===loggedInUser._id)
        return res.status(400).json({
            message:"you can't follow yourself",
    });

    if(user.followers.includes(loggedInUser._id)){
        const indexFollowing=loggedInUser.following.indexOf(user._id);
        const indexFollower =user.followers.indexOf(loggedInUser._id);
        loggedInUser.following.splice(indexFollowing,1);
        user.followers.splice(indexFollower,1);

        await loggedInUser.save();
        await user.save();

        res.json({
            message:"user unfollowed",
        })
    }else{
        loggedInUser.following.push(user._id);
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();

        res.json({
            message:"user followed",
        })

    }
})

export const logOutUser=TryCatch(async(req,res)=>{
    res.cookie("token","",{maxAge:0});
    res.json({
        message:"Logged out successfully",
    });
});