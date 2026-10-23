import CustomerModel from "../Data_models/data.js"
import ProductModel from "../Data_models/products.js"

export function Backend(request,response){
    response.send("hey, Backend is running ") // just to check backend is running
}

// Signup
export const Signup=(request,response)=>{
    CustomerModel.create(request.body) //  whatever the data is coming is inside the request.body
    .then((customer) => {
            response.json(customer)
        })
        .catch((error) => { response.json(error)
            });
        };


// Login with mongodb
export async function  Login (request,response){
     const {email,password}=request.body
        const user = await CustomerModel.findOne({email:email})  // if record exist?
        .then((user)=>{
            if(user){
                if (user.password===password){
                    
                    request.session.customerId = user._id.toString();    // When the customer logs in successfully, the server records their ID in the session. The browser receives a session cookie; subsequent requests send that cookie, allowing the server to identify the customer without trusting a customer ID supplied by React.
                    
                    response.json("Success") 
                }
                else{response.json("Incorrect Password")}
            }else {response.json("No Record was found")}
        })
        .catch((error) => { response.json(error)})
    }


// Logout + delete Cookies
export function Logout(request,response){
        request.session.destroy((error)=>{  //destroys the customer's server-side session.
        if (error){
            console.log(error);
            return response.status(500).json({message:"could not logout"})
        }else{
            response.clearCookie("customer.sid",{ //clears the session cookie from the browser.
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/"         
          })
                response.json({message:"logged out successfully "})
        }
        });
}

//Fetches all products from MongoDB and sends them to your React frontend.
export function FetchData(request,response){
    ProductModel.find()
    .then((products)=>{response.json(products)}) // if successful then whatever result come from ProductModel.find, give it to products and send it as response 
    .catch((err)=>{console.error("Error fetching products:", err)
            response.status(500).json({
                message: "Failed to fetch products"
            })
        })
}


export async function FetchDataProfile (request, response) {
    try {
        // Check whether the customer is logged in
        if (!request.session.customerId) {
            return response.status(401).json({
                message: "Please log in first"
            });
        }

        // Find the logged-in customer in MongoDB
        const customer = await CustomerModel.findById(
            request.session.customerId
        ).select("name username email");
        // if no data is present
        if (!customer) {
            return response.status(404).json({
                message: "Customer not found"
            });
        }
        // else the data is present so Send customer details to React
        response.json({
            name: customer.name,
            username: customer.username,
            email: customer.email
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: "Could not fetch profile"
        });
    }
}




