import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        // posterId: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
        posterId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            trim: true,
            maxlength: 500
        },
        picture: {
            type: String,
        },
        video: {
            type: String,
        },
        likers: {
            type: [String],
            required: true
        },
        comments: {
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number
                }
            ],
            required: true
        }
    },
    {
        timestamps: true 
    }
);

const PostModel = mongoose.model('post', PostSchema);
export default PostModel