import {useEffect, useState} from "react"
import "../CSS_files/enquiry.css"


function EnquiryPage(){
    const [enquiries, setEnquiries]=useState([])
    const [loading, setLoading]=useState(true)
    const [message, setmessage] = useState()
    useEffect(()=>{
    // fetch enquires from backend 
    async function fetchEnquiries(){
        try{
            const token = sessionStorage.getItem("token")

            const response= await fetch("http://localhost:5000/api/enquiries",
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

                    <div className="enquiry-card" key={enquiry._id}>

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

    </div>
);
}

export default EnquiryPage