const { boolean } = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Email is required!'],
			trim: true,
			unique: [true, 'Email must be unique!'],
			minLength: [5, 'Email must have 5 characters!'],
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Password must be provided!'],
			trim: true,
			select: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		verificationCode: {
			type: String,
			select: false,
		},
		verificationCodeValidation: {
			type: Number,
			select: false,
		},
		forgotPasswordCode: {
			type: String,
			select: false,
		},
		forgotPasswordCodeValidation: {
			type: Number,
			select: false,
		},
	
	role: { 
		type: String, 
		enum: ["user", "moderator", "admin"], 
		default: "user"  
	  },
	
	  isMfaActive: {
		type: Boolean, // Corrected 'Boolean' with uppercase B
		default: false
	},
	mfaCode: {
		type: String,  // 'String' should be fine
		required: false // Optional, unless you want to enforce it
	}
},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);