import { useState } from "react";
import {useNavigate} from "react-router-dom"  //lets you navigate between pages programmatically.
import "../CSS_files/TenantDashboard.css"

function TenantDashboard(){
    const navigate=useNavigate() 

   const [tenant, setTenant] = useState(() => {
    try {
        return JSON.parse(sessionStorage.getItem("tenant"));
    } catch {
        return null;
    }
});

     if (!tenant) {
    return (
      <div className="dashboard-page">
        <p>Please log in to access your dashboard.</p>  // If tenant is null, the dashboard displays a message and a login button.
        <button onClick={() => navigate("/login")}>     // If tenant exists, the component continues to render the dashboard
          Go to Login
        </button>
      </div>
    );
    } 

    function HandleLogout(){
        sessionStorage.removeItem("tenant")
        setTenant(null)
        navigate("/login",{replace:true}) // replace:true helps prevent the Back button from returning directly to the dashboard history entry.
    }

      return (  // UI Interface
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>StoreHub</h1>
        <button onClick={HandleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <p className="dashboard-label">TENANT DASHBOARD</p>

        <h2>Welcome, {tenant.storeName}</h2>

        <p className="dashboard-description">
          Manage your online store from one place.
        </p>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Products</h3>
            <p>Manage your store products.</p>
            <button onClick={()=> navigate("/add-product")}> Add Product </button>
          </div>

         
          <div className="dashboard-card">
              <h3>Products</h3>
              <p>Manage your store products.</p>

              <button onClick={() => navigate("/add-product")}>
                  Add Product
              </button>

              <button onClick={() => navigate("/view-products")}>
                  View Products
              </button>
          </div>


          <div className="dashboard-card">
            <h3>Store Settings</h3>
            <p>Manage your store information.</p>
            <button disabled>Coming Soon</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TenantDashboard;











