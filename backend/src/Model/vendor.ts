import mongoose, { Schema, Document, Types } from 'mongoose';
import { Notification } from '../util/Interfaces';
import { Review } from '../util/Interfaces';




export interface Vendor {
    email : string;
    password : string;
    name:string;
    city:string;
    about:string;
    phone:number;
    logo:string;
    coverpic:string;
    reviews:Array<Review>;
    isVerified:boolean;
    verificationRequest:boolean;
    totalBooking:number;
    vendor_type:Schema.Types.ObjectId;
    isActive:boolean;
    coverpicUrl:string;
    logoUrl:string;
    bookedDates:Array<string>;
    refreshToken:string;
    notifications:Array<Notification>;
    OverallRating:Number;

}

export interface VendorDocument extends Vendor, Document {}

const VendorSchema: Schema = new Schema({
    email :{type:String , required:true, unique:true},
    password:{type:String, required:true} , 
    name :{type:String , required:true} ,
    phone :{type:Number , required:true , unique:true},
    city:{type:String , required:true},
    about:{type:String},
    logo:{type:String},
    coverpic:{type:String},
    reviews:{type:Array<Review>},
    isVerified:{type:Boolean},
    verificationRequest:{type:Boolean},
    totalBooking:{type:Number},
    vendor_type:{type:Schema.Types.ObjectId},
    isActive:{type:Boolean},
    coverpicUrl:{type:String},
    logoUrl:{type:String},
    bookedDates:{type:Array<String>},
    refreshToken:{type:String},
    notifications:[{
        _id: { type: Schema.Types.ObjectId, default: Types.ObjectId },
        message: String,
        timestamp: { type: Date, default: Date.now },
        Read:{type:Boolean, default: false}
    }],
    OverallRating:{ type: Number, default: 0 }

});

export default mongoose.model<VendorDocument>('Vendor', VendorSchema);