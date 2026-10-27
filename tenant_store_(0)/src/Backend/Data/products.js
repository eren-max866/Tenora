import mongoose from "mongoose"

const productSchema= new mongoose.Schema( {  // tells Node.js application what a product is expected to look like.
     id: String,
    name: String,
    shortDescription: String,
    description: String,
    price: Number,
    currency: String,
    imageUrl: String,
    category: String,
    tags: [String],
    stock: Number,
    isAvailable: Boolean,
    weightGrams: Number,
    dimensions: {
      widthMm: Number,
      heightMm: Number,
      depthMm: Number,
    },
    // Store the ID of the tenant who owns this product
    tenantId: {
        type: String,
        required: true
    },

    createdAt: Date,
    updatedAt: Date,
  }, { collection: "Tenant_Product",  strict: true, })


  const productModel= mongoose.model("Tenant_Products",productSchema, "Tenant_Products")  //model gives your application methods to access the collection you already have

  export default productModel
  