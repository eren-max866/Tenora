
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS_files/AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;   
    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  }

  
async function handleSubmit(event) {
  event.preventDefault();
  setMessage("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not save product.");
      return;
    }

    setMessage("Product added successfully!");

    setProduct({
      name: "",
      category: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
    });
  } catch (error) {
    console.error("Error adding product:", error);

    setMessage(
      "Cannot connect to the server. Check whether Node.js is running."
    );
  }
}

  return (
    <div className="add-product-page">
      <header className="add-product-header">
        <h1>StoreHub</h1>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="add-product-container">
        <h2>Add New Product</h2>
        <p className="form-description">
          Enter the details of the product you want to sell.
        </p>

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Cotton T-Shirt"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Home">Home & Living</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your product"
              value={product.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                placeholder="999"
                min="0.01"
                step="0.01"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                id="stock"
                name="stock"
                type="number"
                placeholder="10"
                min="0"
                step="1"
                value={product.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Product Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={product.imageUrl}
              onChange={handleChange}
            />
          </div>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          <div className="form-actions">
            <button type="submit" className="save-product-button">
              Save Product
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddProduct;
