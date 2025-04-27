import { Response } from "express"



const checkOtpExpiration = (res:Response,otpGeneratedTime:string,thresholdTime:number)=>{
    const currentTime = Date.now()
    if(currentTime - parseInt(otpGeneratedTime)  <= thresholdTime){
        res.status(200).json({
            message:"Valid OTP, now you can proceed to reset password 😌"
        })
    }else{
        res.status(403).json({
            message:"OTP expiredd, Sorry try again later 😭!!"
        })

    }
}

export default checkOtpExpiration