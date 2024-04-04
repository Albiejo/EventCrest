

//Interfaces for backend

export interface UserSession {
    otpSetTimestamp: number | undefined;
    email: string;
    password: string;
    name: string;
    phone: number;
    otpCode: string | undefined;
  }



export interface OTP {
    otp: string | undefined;
    email: string;
    otpSetTimestamp: number | undefined;
  }


export interface DecodedData {
    name: string;
    email: string;
    picture: string;
    jti: string;
  }


export interface vendorSession{
    email: string;
    password: string;
    name: string;
    phone: number;
    city:string;
    otpCode: string | undefined;
    vendor_type:string;
    otpSetTimestamp: number | undefined;
  }