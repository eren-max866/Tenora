import productModel from "../Data/products.js"
import { randomUUID } from "node:crypto"    
   


export async function addProduct(request,response) {
    let body=""
    request.on("data",(chunk)=> {body+=chunk})

    request.on("end", async()=>{  
        try{
            const product=JSON.parse(body)  // JSON text into a JavaScript object

            // Validating Required product details
            if (
        typeof product.name !== "string" ||
        !product.name.trim() ||
        typeof product.category !== "string" ||
        !product.category.trim() ||
        typeof product.description !== "string" ||
        !product.description.trim() ||
        !Number.isFinite(Number(product.price)) ||   // Number : htm form input typically provide heir values as strings so backend convert numeric 
        Number(product.price) <= 0 ||
        product.stock === "" ||
        !Number.isInteger(Number(product.stock)) ||
        Number(product.stock) < 0
      ){ // if any of these is true then

        response.writeHead(400,{"Content-Type":"application/json"}) // set response status code and content type
        response.end(JSON.stringify({message:"please provide valid product details"}))  // convert the response object into json text and finish the request
        return 
      }
      // Get tenant ID from verified JWT authentication

      //CREATE A NEW PRODUCT RECORD
      const newProduct = new productModel({
        id: randomUUID(),
        name: product.name.trim(),
        category: product.category.trim(),
        description: product.description.trim(),
        price: Number(product.price),
        currency: product.currency?.trim() || "INR",
        stock: Number(product.stock),
        imageUrl: product.imageUrl?.trim() || "",
        tenantId: request.tenantId,  
      })
      // save product to mongodb
      const savedProduct = await newProduct.save()  // save the new product to the database
     response.writeHead(201, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({
        message: "Product added successfully.",
        savedProduct: newProduct,
      })
    )

    }catch(error) {
      console.error("Error saving product:", error);

      response.writeHead(500, {
        "Content-Type": "application/json",
      });

      response.end(JSON.stringify({
        message: "Could not save the product.",
      }))
    }
})


    
}