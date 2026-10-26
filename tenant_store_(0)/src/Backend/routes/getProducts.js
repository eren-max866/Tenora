import productModel from "../Data/products.js"


export async function getProducts(request, response ) {
    try{
    const tenantId = request.tenantId; // Get the logged-in tenant's ID
    const Product = await productModel.find({ tenantId: tenantId }) // Fetch products for the specific tenant
        response.writeHead(200,{ "Content-Type": "application/json"})
        response.end(JSON.stringify(Product))
    }catch(error){
        console.error("Error reading Products:",error)
        response.writeHead(500,{"Content-Type": "application/json"})
        response.end(JSON.stringify({message:"Failed to load product"}))
    }

}