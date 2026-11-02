import {useEffect, useState} from "react"
import "../CSS_files/enquiry.css"


function EnquiryPage(){
    const [enquiries, setEnquiries]=useState([])
    const [loading, setLoading]=useState(true)
    const [message, setmessage] = useState()
    const [newStatus, setNewStatus] = useState("");
    const [updating, setUpdating] = useState(false);


    // store the enquiry selected by the tenant
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    useEffect(()=>{
    // fetch enquires from backend 
    async function fetchEnquiries(){
        try{
            const token = sessionStorage.getItem("token")

            const response= await fetch("http://localhost:4052/api/enquiries",
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                })

            const data= await response.json()
            if (!response.ok) {
                    setmessage(data.message || "Unable to fetch enquiry");
                    return;
                }

            setEnquiries(data);

     }catch(error){
                console.error("Error fetching ENQUIRY:", error);
                
            } finally {
                setLoading(false);
            }
        }
        
        fetchEnquiries();
    },[]
    )


    if (loading) {
        return <h2>Loading enquiries...</h2>;
    }


    async function updateStatus(){
        try{
            setUpdating(true);
            const token = sessionStorage.getItem("token");
            const response = await fetch(`http://localhost:4052/api/enquiries/${selectedEnquiry._id}/status`, {
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
                
            const data= await response.json();
            if (!response.ok) {
                setmessage(data.message || "Unable to update enquiry status");
                return;
            }

            // update the enquiry list
            setEnquiries((prevEnquiries) =>
                prevEnquiries.map((enquiry) =>
                    enquiry._id === selectedEnquiry._id ?data.enquiry: enquiry))
            // Update the currently opened popup
        setSelectedEnquiry(data.enquiry);

        setmessage("Enquiry status updated successfully");

    } catch (error) {
        console.error("Error updating status:", error);
        setmessage("Unable to connect to server");

    } finally {
        setUpdating(false);
    }
        
    }   
return (
    <div className="enquiries-page">

        <div className="enquiries-header">
            <h1>Customer Enquiries</h1>
            <p>View enquiries received from customers about your products.</p>
        </div>

       

        {enquiries.length === 0 ? (

            <p className="enquiries-message">
                No enquiries received yet.
            </p>

        ) : (

            <div className="enquiries-container">

                {enquiries.map((enquiry) => (

                    <div className="enquiry-card" key={enquiry._id} onClick={()=> {
                        setSelectedEnquiry(enquiry);  {/* this selectes the card to popup */}
                        setNewStatus(enquiry.status);  {/* this sets the status of the selected enquiry */}
                        setmessage("");  {/* this clears any previous message */}
                    }
                    }>
                          {/* Small label */}
                         <span className="enquiry-label">
                            PRODUCT ENQUIRY
                        </span>

                        <h3>{enquiry.productName}</h3>

                        <p>
                            <strong>Customer:</strong> {enquiry.customerName}
                        </p>

                        <p>
                            <strong>Email:</strong> {enquiry.customerEmail}
                        </p>

                        <p>
                            <strong>Message:</strong> {enquiry.message}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            <span className="enquiry-status">
                                {enquiry.status}
                            </span>
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                        </p>

                    </div>

                ))}

            </div>
        )}


        // {/* enquiry details popup*/}
         {/* Enquiry Details Popup */}
            {selectedEnquiry && (

                <div className="enquiry-overlay">

                    <div className="enquiry-modal">

                        <h2>Enquiry Details</h2>

                        <button
                            className="close-button"
                            onClick={() => setSelectedEnquiry(null)}
                        >
                            ×
                        </button>

                        <hr />

                        <h3>{selectedEnquiry.productName}</h3>

                        <p>
                            <strong>Customer:</strong>{" "}
                            {selectedEnquiry.customerName}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {selectedEnquiry.customerEmail}
                        </p>

                        <p>
                            <strong>Message:</strong>
                        </p>

                        <div className="enquiry-full-message">
                            {selectedEnquiry.message}
                        </div>

                        <p>
                            <strong>Status:</strong>{" "}
                            {selectedEnquiry.status}
                        </p>
                        
<div className="status-update-section">

    <label>Update Enquiry Status</label>

    <select
        value={newStatus}
        onChange={(event) => setNewStatus(event.target.value)}
    >
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="in progress">in progress</option>
        <option value="pending">pending</option>
        <option value="resolved">resolved</option>
    </select>

    <button
        onClick={updateStatus}
        disabled={updating || newStatus === selectedEnquiry.status}
    >
        {updating ? "Updating..." : "Update Status"}
    </button>

</div>


                        <p>
                            <strong>Enquiry Date:</strong>{" "}
                            {new Date(selectedEnquiry.createdAt).toLocaleString()}
                        </p>

                        <button
                            className="close-modal"
                            onClick={() => setSelectedEnquiry(null)}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

    </div>
);
}

export default EnquiryPage