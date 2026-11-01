import EnquiryModel from "../Data/enquiry.js"
import {verifyToken} from "../middleware/jwt.js"
import mongoose from "mongoose";

export async function fetchEnquiries(request, response) {
    try{
        // veriy the logged tenat using JWT token
        const isTokenValid= verifyToken(request, response)
        if (!isTokenValid) {
            return false; 
         }
         //get tenant id from verified JWT token
         const tenantId= request.tenant.id
        console.log("Tenant MongoDB connection:", mongoose.connection.readyState);
console.log("Enquiry Model connection:", EnquiryModel.db.readyState);
         // find enqueries belonging to this specific tenant 
         const enquiries = await EnquiryModel.find({tenantId: tenantId})
         response.writeHead(200,{"Content-Type":"application/json"})
         response.end(JSON.stringify(enquiries))

         
    }catch(error){
        console.error("Error reading enquiries:",error)
        response.writeHead(500,{"Content-Type":"application/json"})
        response.end(JSON.stringify({message:"unable to fetch enquiries"}))
        
    }

}