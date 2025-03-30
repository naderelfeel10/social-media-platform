const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required!'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Description is required!'],
			trim: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		likes: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			},
		],
		comments: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				text: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Post', postSchema);
