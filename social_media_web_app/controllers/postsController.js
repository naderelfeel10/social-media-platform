const jwt = require("jsonwebtoken")
const userModel = require('../models/usersModel');
const postModel = require('../models/postsModel');
const {signupSchema,createPostSchema} = require('../middlewares/validator');
const {doHash,doPassValidation,hmacProcess} = require("../utils/hashing");




exports.getPosts = async (req, res) => {
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
			const userId  = result[0].userId;
			
			console.log(userId)  
		//res.status(200).json({ success: true, message: 'posts', data: result });
		res.render('getAllPosts',{posts:result});
	} catch (error) {
		console.log(error);
	}
};
exports.singlePost = async (req, res) => {
	const { _id } = req.query;

	try {
		const existingPost = await postModel.findOne({ _id }).populate({
			path: 'userId',
			select: 'email',
		})
		if (!existingPost) {
			return res
				.status(404)
				.json({ success: false, message: 'Post unavailable' });
		}
		console.log("Post Exists")
		//res.status(200).json({ success: true, message: 'single post', data: existingPost });
		
		res.render('singlePost',{Post:existingPost});
	} catch (error) {
		console.log(error);
	}
};
exports.createPost = async (req, res) => {
	const { title, description } = req.body;
	const { userId } = req.user;
	try {
		const { error, value } = createPostSchema.validate({
			title,
			description,
			userId,
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		const result = await postModel.create({
			title,
			description,
			userId,
		});
		console.log(result)
		res.status(201).json({ success: true, message: 'created', data: result });
	} catch (error) {
		console.log(error);
	}
};
exports.createPost_get = (req,res)=>{
    res.render("createPost")
}
exports.updatePost = async (req, res) => {
	const { _id } = req.query;
	const { title, description } = req.body;
	const { userId } = req.user;
	try {
		const { error, value } = createPostSchema.validate({
			title,
			description,
			userId,
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}
		const existingPost = await postModel.findOne({ _id });
		if (!existingPost) {
			return res
				.status(404)
				.json({ success: false, message: 'Post unavailable' });
		}
		if (existingPost.userId.toString() !== userId) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}
		existingPost.title = title;
		existingPost.description = description;

		const result = await existingPost.save();
		res.status(200).json({ success: true, message: 'Updated', data: result });
	} catch (error) {
		console.log(error);
	}
};

module.exports.updatePost_get = async (req, res) => {
	const _id = req.query;
	const existingPost = await postModel.findOne({ _id }).populate({
		path: 'userId',
		select: 'email',
	})

    res.render('updatePost',{Post:existingPost});
};

exports.deletePost = async (req, res) => {
	const { _id } = req.query;

	const { userId } = req.user;
	const existingUser = await userModel.findById(userId);
	const existingPost = await postModel.findOne({ _id });
	const postOwner = await userModel.findById(existingPost.userId);
	console.log(postOwner)
	console.log(existingPost)

	try {
		if (!existingPost) {
			return res
				.status(404)
				.json({ success: false, message: 'Post already unavailable' });
		}

       if(postOwner.role.toString()=="user"){
		if (existingPost.userId.toString() !== userId && ((existingUser.role.toString() !== "admin")  ) && ((existingUser.role.toString() !== "moderator")  ) ) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}
	   }

	   if(postOwner.role.toString()=="moderator"){
		if (existingPost.userId.toString() !== userId && ((existingUser.role.toString() !== "admin") ) ) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}
	   }
	   if(postOwner.role.toString()=="admin"){
		if (existingPost.userId.toString() !== userId  ) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}
	   }


		await postModel.deleteOne({ _id });
		return res.status(200).json({ success: true, message: 'deleted' });
	} catch (error) {
		console.log(error);
	}

	
};

exports.addComment = async (req,res)=>{
	const postId =  req.query;
	const comment = req.body.comment;
	const commenterId = req.user.userId.toString();
    const existingPost = await postModel.findById(postId);
	if(!existingPost){
	return res.status(401).json({success:false,message:"Post is not found"})
	}
	if(!comment){
	return res.status(401).json({success:false,message:"comment can't be empty"})

	}
	
	existingPost.comments.push({userId:commenterId,text:comment});
	existingPost.save();
	console.log(existingPost);

	return res.status(200).json({message:"hhhhh"})
}

exports.deleteComment = async (req, res) => {
	const { _id,commentId } = req.query;
	console.log(_id)
	console.log(commentId)

	const { userId } = req.user;
	const existingUser = await userModel.findById(userId);
	const existingPost = await postModel.findOne({ _id });
	console.log(existingPost)

	const comment = existingPost.comments.find(comment => comment._id.toString() === commentId);
	const commenterId = comment.userId;
	console.log(comment)

	try {
		if (!existingPost) {
			return res
				.status(404)
				.json({ success: false, message: 'Post already unavailable' });
		}

		if (commenterId.toString() !== userId && ((existingUser.role.toString() !== "admin")  ) && ((existingUser.role.toString() !== "moderator")  ) ) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}
	   



		//await postModel.deleteOne({ _id });
		existingPost.comments = existingPost.comments.filter(comment => comment._id.toString() !== commentId);

        // Save the updated post without the deleted comment
        await existingPost.save();
		return res.status(200).json({ success: true, message: 'deleted' });
	} catch (error) {
		console.log(error);
	}

	
};
exports.addLike = async (req,res)=>{
	const postId =  req.query;
	const likerId = req.user.userId.toString();
    const existingPost = await postModel.findById(postId);

	if(!existingPost){
	return res.status(401).json({success:false,message:"Post is not found"})
	}
	if (existingPost.likes.some(like => like.userId && like.userId.toString() === likerId.toString())) {
		// Unlike: Remove the like object
		existingPost.likes = existingPost.likes.filter(like => 
			like.userId && like.userId.toString() !== likerId.toString()
		);
			// Save changes to the database
	await existingPost.save();
	
	console.log(existingPost);
	return res.status(201).json({success:true,message:"Post unliked successfully"})

	} else {
		// Like: Add a new like object
		existingPost.likes.push({ userId: likerId });
			// Save changes to the database
	await existingPost.save();
	
	console.log(existingPost);
	return res.status(200).json({message:"you liked this post"})


	}
	


}