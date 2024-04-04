import mongoose, { Schema, Document } from 'mongoose';


export interface User {
    email : string;
    password : string;
    name : string;
    phone : number;
    isActive:boolean;
    favorite:Array<string>;
    image:string;
    imageUrl:string;
    refreshToken:string
    
}

export interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true},
    password:{type:String, required:true} , 
    name :{type:String , required:true} ,
    phone :{type:Number  , unique:true},
    isActive :{type:Boolean , required:true},
    favorite:{type:Array},
    image:{type:String},
    imageUrl:{type:String},
    refreshToken: { type: String }

});

export default mongoose.model<UserDocument>('User', UserSchema);