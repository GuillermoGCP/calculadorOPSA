import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  username: string
  password: string
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
})

const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema)
export default User
