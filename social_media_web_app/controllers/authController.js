const jwt = require("jsonwebtoken")
const userModel = require('../models/usersModel');
const postModel = require('../models/postsModel');
const {signupSchema,postsSchema} = require('../middlewares/validator');
const {doHash,doPassValidation,hmacProcess} = require("../utils/hashing");
const emaill = require("../middlewares/sendMail");




exports.signup = async (req,res)=>{
	const {email,password} = req.body;
     
     console.log(req.body)

		const {error,value} = signupSchema.validate({email,password});
		if(error){
		return res.status(401).json({success:false, message:"error in validating signing up",error:error.details[0].message});
	    }

	 const existingUser = await userModel.findOne({email});

	 if(existingUser){
		return res.status(401).json({success:false, message:"user already exists"});
	 }
	 else{

		// hash the password
		const hashedPassword = await doHash(password,12);
		//console.log(password);
		//console.log(hashedPassword)

		const newUser= new userModel({
			email:email,
			password:hashedPassword
		})

		const result = await newUser.save();
		console.log(newUser)
		// store pass and email in DB

		return res.status(200).json({succuss:true,message:"done signing up"})
	 }


}
exports.signup_get = (req,res)=>{

	//res.json({message:"hiiiiiiiiiiiii"});
     res.render('signup')
}
/////////////////
exports.signin = async (req,res)=>{
	const {email,password} = req.body;
        
	const existingUser = await userModel.findOne({email}).select("+password");
     if(existingUser){
		const result = await doPassValidation(password,existingUser.password)
		//console.log(result)
       console.log("is the user active :",existingUser.isMfaActive)
        if(result){

			/*const token = jwt.sign({
				userId :existingUser._id,
				email:existingUser.email,
				verified:existingUser.verified,
				role:existingUser.role,
				isMfaActive:existingUser.isMfaActive
				
			},"elfeel",
			{
				expiresIn:"8h"
			}
		);*/
		//console.log(token)
		console.log(existingUser)
/*
		return res.cookie("Authorization", "Bearer " + token, {
			expires: new Date(Date.now() + 8 * 3600000),
			httpOnly: true,
			secure: true
		  }).json({
			success: true,
			token,
			message: "signed in successfully",
			isverified:existingUser.verified,
			isMfaActive:existingUser.isMfaActive
		  });
		  */
		  return res.status(200).json({success:true,message:"signed in successfully"})

			
		}else{
			return res.status(401).json({message:"username or password is not correct"})
		}

	 }else{
     return res.status(401).json({message:"user is not found"})
	 }
	 


	
}
exports.signin_get = (req,res)=>{
    
     res.render('signin')
}
/////////////////
exports.signout = (req,res)=>{
    res.clearCookie("Authorization");
	res.redirect('signin')
}
/////////////////
exports.sendCode = async(req,res)=>{
	const { email } = req.body;
       console.log(email)
		const existingUser = await userModel.findOne({ email });

		if (!existingUser) {
			return res.status(404).json({ success: false, message: 'User does not exists!' });
		}
		if (existingUser.verified && !existingUser.isMfaActive) {
			
			return res.status(200).json({ success: true, message: 'Done signing in' });
		}
        
		const codeValue = Math.floor(Math.random() * 1000000).toString();
		const message = `We have received a email verification OTP . :\n\n${codeValue}`;

		console.log(codeValue)



		try{
			await emaill({
			  email: existingUser.email,
			  subject: 'email verification Request',
			  message: message,
			});

		   console.log('await emaill.sendEmail')
		   const hashedCodeValue = await hmacProcess(
			codeValue,
			"elfeel"
		);
		console.log(hashedCodeValue)
		
	
		existingUser.verificationCode = hashedCodeValue;
		existingUser.verificationCodeValidation = Date.now();
		
		console.log(await existingUser.verificationCode)
		console.log("Date.now()")
		await existingUser.save();
		console.log(".save()")
		 return res.status(200).json({ success: true, message: 'Code sent!' });

		}
			catch (err) {
				res.status(400).json({ success: false, message: 'Code sent failed!'});
			}


}
/////////////////
exports.verifyCode = async (req,res)=>{

	const {email,code} = req.body;
       console.log(email)
	const existingUser = await userModel.findOne({email}).select("+verificationCode");

	if (!existingUser) {
		return res
			.status(401)
			.json({ success: false, message: 'User does not exists!' });
	}
	if (existingUser.verified && !existingUser.isMfaActive) {
		return res
			.status(400)
			.json({ success: false, message: 'you are already verified!' });
	}

	if (
		!existingUser.verificationCode 
	) {
		return res
			.status(400)
			.json({ success: false, message: 'something is wrong with the code!' });
	}

	if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
		return res
			.status(400)
			.json({ success: false, message: 'code has been expired!' });
	}

	const hashedCodeValue = await hmacProcess(
        code,
        "elfeel"
    );

	if(hashedCodeValue === existingUser.verificationCode){

		existingUser.verified = true;
		existingUser.verificationCode = undefined;
		existingUser.verificationCodeValidation = undefined;
		await existingUser.save();
		console.log(existingUser.verified)
		console.log(existingUser.verificationCode)
		console.log(existingUser.verificationCodeValidation)

		const token = jwt.sign({
			userId :existingUser._id,
			email:existingUser.email,
			verified:existingUser.verified,
			role:existingUser.role,
			isMfaActive:existingUser.isMfaActive
			
		},"elfeel",
		{
			expiresIn:"8h"
		}
	);
		return res.cookie("Authorization", "Bearer " + token, {
			expires: new Date(Date.now() + 8 * 3600000),
			httpOnly: true,
			secure: true
		  }).json({
			success: true,
			token,
			message: "signed in successfully",
			isverified:existingUser.verified,
			isMfaActive:existingUser.isMfaActive
		  });
	}else{
		return res.status(401).json({success:false,message:"wrong code"})

	}


}
exports.verifyCode_get = async(req,res)=>{
	//const existingUser = req.user;
	//console.log("existingUser nigggggga :" ,existingUser)
	//console.log("existingUser nigggggga :" ,existingUser.isMfaActive)

	res.render('verifyCode')
}
/////////////////
exports.sendforgotPasswordCode = async(req,res)=>{
	const { email } = req.body;
       console.log(email)
		const existingUser = await userModel.findOne({ email });

		if (!existingUser) {
			return res.status(404).json({ success: false, message: 'User does not exists!' });
		}
        
		const codeValue = Math.floor(Math.random() * 1000000).toString();
		const message = `We have received a email verification OTP . :\n\n${codeValue}`;

		console.log(codeValue)



		try{
			await emaill({
			  email: existingUser.email,
			  subject: 'forgot password Request',
			  message: message,
			});

		   console.log('await emaill.sendEmail')
		   const hashedCodeValue = await hmacProcess(
			codeValue,
			"elfeel"
		);
		console.log(hashedCodeValue)
		
	
		existingUser.forgotPasswordCode = hashedCodeValue;
		existingUser.forgotPasswordCodeValidation = Date.now();
		
		console.log(await existingUser.forgotPasswordCode)
		console.log("Date.now()")
		await existingUser.save();
		console.log(".save()")
		 return res.status(200).json({ success: true, message: 'Code sent!' });

		}
			catch (err) {
				res.status(400).json({ success: false, message: 'Code sent failed!'});
			}


}
exports.forgotPassword_get = (req,res)=>{
   res.render('forgotPassword')
}

exports.verifyForgotPasswordCode = async (req,res)=>{

	const {email,code} = req.body;
       console.log(email)
	const existingUser = await userModel.findOne({email}).select("+forgotPasswordCode");

	if (!existingUser) {
		return res
			.status(401)
			.json({ success: false, message: 'User does not exists!' });
	}

	if (
		!existingUser.forgotPasswordCode 
	) {
		return res
			.status(400)
			.json({ success: false, message: 'something is wrong with the code!' });
	}

	if (Date.now() - existingUser.forgotPasswordCodeValidation > 5 * 60 * 1000) {
		return res
			.status(400)
			.json({ success: false, message: 'code has been expired!' });
	}

	const hashedCodeValue = await hmacProcess(
        code,
        "elfeel"
    );

	if(hashedCodeValue === existingUser.forgotPasswordCode){

		return res.status(200).json({success:true,message:"you can now reset your password"})
	}else{
		return res.status(401).json({success:false,message:"wrong code"})

	}


}
exports.verifyForgotPasswordCode_get = (req,res)=>{
	res.render('verifyForgotPasswordCode')
}

exports.resetPassword = async(req,res)=>{
	 const {email,isverified,password,newPassword} = req.body;
     console.log(email);

     const existingUser = await userModel.findOne({email}).select("+forgotPasswordCode");

	        if(isverified){
				if(password === newPassword){
		        const hashedPassword = await doHash(password,12);
                 existingUser.password = hashedPassword;
				 existingUser.save();

				 return res
			        .status(201)
			        .json({ success: true, message: 'done changing the password' });
				}else{
					return res
					.status(401)
					.json({ success: false, message: 'passwords don\'t match' });
				}
				
			}else{
				return res
				.status(401)
				.json({ success: false, message: 'U are not allowed to change the password' });
			}
	        
		
}
exports.resetPassword_get = (req,res)=>{
	res.render("resetPassword");
}
////////////////////

exports.changePassword_get = (req,res)=>{
	res.render("changePassword");
}

exports.changePassword = async (req, res) => {
	console.log(req.user)
	const email = req.user.email;
	
    try {
        const { oldPassword, newPassword, newPassword2 } = req.body;
        const existingUser = await userModel.findOne({email});
        // Verify JWT token

            // Find user based on token info
            //const existingUser = await userModel.findById(decodedToken.userId).select("+password");
            if (!existingUser) {
                return res.status(401).json({ success: false, message: "User doesn't exist" });
            }

            // Validate old password
            const isPasswordValid = await doPassValidation(oldPassword, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: "Old password is incorrect" });
            }

            // Ensure new passwords match
            if (newPassword !== newPassword2) {
                return res.status(400).json({ success: false, message: "New passwords do not match" });
            }

            // Hash and update password
            const hashedPassword = await doHash(newPassword, 12);
            existingUser.password = hashedPassword;
            await existingUser.save();

            return res.status(200).json({ success: true, message: "Password changed successfully" });
        

    } catch (error) {
        console.error("Error in changePassword:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.adminPanel = async (req,res)=>{
res.render("adminPanel")
}

exports.adminPanel_users = async (req,res)=>{
	const { page } = req.query;
	const usersPerPage = 10;

	try {
		let pageNum = 0;
		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await userModel.find({role:"user"})
			.sort({ createdAt: -1 })
			.skip(pageNum * usersPerPage)
			.limit(usersPerPage)
			.populate({
				path: 'role',
				select: 'enum',
			});
		//res.status(200).json({ success: true, message: 'posts', data: result });
		res.render('adminPanel_users',{users:result});
	} catch (error) {
		console.log(error);
	}	
}
exports.adminPanel_moderators = async (req,res)=>{
	const { page } = req.query;
	const moderatorsPerPage = 10;

	try {
		let pageNum = 0;
		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await userModel.find({role:"moderator"})
			.sort({ createdAt: -1 })
			.skip(pageNum * moderatorsPerPage)
			.limit(moderatorsPerPage)
			.populate({
				path: 'role',
				select: 'enum',
			});
		//res.status(200).json({ success: true, message: 'posts', data: result });
		res.render('adminPanel_moderators',{moderators:result});
	} catch (error) {
		console.log(error);
	}	
}
exports.adminPanel_posts = async (req,res)=>{
const { page } = req.query;
	const postsPerPage = 10;

	try {
		let pageNum = 0;
		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await postModel.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * postsPerPage)
			.limit(postsPerPage)
			.populate({
				path: 'userId',
				select: 'email',
			});
		//res.status(200).json({ success: true, message: 'posts', data: result });
		res.render('getAllPosts',{posts:result});
	} catch (error) {
		console.log(error);
	}
}


exports.updateUser = async (req, res) => {
	const { _id } = req.query;
	console.log(_id)
	const { role:userRole } = req.body;

	console.log("user Role",userRole)
	console.log("user Role",req.body)

	console.log("user ID ",_id)

	const { userId } = req.user;
	try {

		const existingUser = await userModel.findOne({ _id });
		if (!existingUser) {
			return res
				.status(404)
				.json({ success: false, message: 'User unavailable' });
		}
console.log(existingUser)
		existingUser.role = userRole;

		const result = await existingUser.save();
console.log(existingUser)

		res.status(200).json({ success: true, message: 'Updated', data: result });
	} catch (error) {
		console.log(error);
	}
};

module.exports.updateUser_get = async (req, res) => {
	const _id = req.query;
	const existingUser = await userModel.findOne({ _id });

    res.render('updateUser',{User:existingUser});
};


exports.updateModerator = async (req, res) => {
	const { _id } = req.query;
	console.log(_id)
	const { role:userRole } = req.body;

	console.log("user Role",userRole)
	console.log("user Role",req.body)

	console.log("user ID ",_id)

	const { userId } = req.user;
	try {

		const existingUser = await userModel.findOne({ _id });
		if (!existingUser) {
			return res
				.status(404)
				.json({ success: false, message: 'Moderator unavailable' });
		}
console.log(existingUser)
		existingUser.role = userRole;

		const result = await existingUser.save();
console.log(existingUser)

		res.status(200).json({ success: true, message: 'Updated', data: result });
	} catch (error) {
		console.log(error);
	}
};

module.exports.updateModerator_get = async (req, res) => {
	const _id = req.query;
	const existingUser = await userModel.findOne({ _id });

    res.render('updateModerator',{Moderator:existingUser,_id});
};

exports.deleteUser = async (req, res) => {
	const { _id } = req.query;

	const { adminId } = req.user;

	const deletedUser = await userModel.findOne({_id});
	console.log(deletedUser)

	try {
		if (!deletedUser) {
			return res
				.status(404)
				.json({ success: false, message: 'User is unavailable' });
		}


		 await userModel.deleteOne({ _id });
           
		return res.status(200).json({ success: true, message: 'deleted' });
	} catch (error) {
		console.log(error);
	}

	
};

exports.deleteModerator = async (req, res) => {
	const { _id } = req.query;

	const { adminId } = req.user;

	const deletedUser = await userModel.findOne({_id});
	console.log(deletedUser)

	try {
		if (!deletedUser) {
			return res
				.status(404)
				.json({ success: false, message: 'Moderator is unavailable' });
		}


		 await userModel.deleteOne({ _id });
           
		return res.status(200).json({ success: true, message: 'deleted' });
	} catch (error) {
		console.log(error);
	}

	
};

exports.singleUser = async (req, res) => {
	const { _id } = req.query;
      console.log("idddddddddddddd",_id)
	try {
		const existingUser = await userModel.findOne({ _id });
		if (!existingUser) {
			return res
				.status(404)
				.json({ success: false, message: 'User unavailable' });
		}
		console.log("User Exists")
		console.log(existingUser)
		console.log(existingUser._id.toString())
        const userPosts = await postModel.find({ userId: _id });

		//res.status(200).json({ success: true, message: 'single post', data: existingPost });
		
		res.render('singleUser',{User:existingUser,posts:userPosts});
	} catch (error) {
		console.log(error);
	}
};

exports.activateMFA = async(req,res)=>{
	const _id = req.user.userId;
    const existingUser = await userModel.findById(_id)
	if(!existingUser){
		return res.status(401).json({success:false,message:"user is not found!"})
	}
    console.log("the mf user",existingUser.isMfaActive)
	 if(existingUser.isMfaActive){
	  existingUser.isMfaActive = false;
	 }
	else{
		existingUser.isMfaActive = true;

	}
	  console.log("the mf user",existingUser.isMfaActive)

	  const result = await existingUser.save();
	  console.log("the mf user :",existingUser)
	  console.log(existingUser)
	 return res.status(201).json({success:true,message:"2fa is activated now"})

}


