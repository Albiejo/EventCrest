import {Document,Schema,model} from "mongoose";


export interface AdminDocument extends Document{
    email:string;
    password:string;
    createdAt:Date;
    isAdmin:boolean;
    refreshToken:string
}

const adminSchema=new Schema<AdminDocument>({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    refreshToken:{type:String}
})

export default model<AdminDocument>('Admin',adminSchema)

