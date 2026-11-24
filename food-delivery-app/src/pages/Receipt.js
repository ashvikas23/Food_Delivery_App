import React, { useRef } from "react";
import jsPDF from "jspdf";
import "../style.css";

function Receipt() {
  const receiptRef = useRef();

  const order = JSON.parse(localStorage.getItem("latestOrder"));

  if (!order) {
    return <h2 style={{ textAlign: "center" }}>No Order Found</h2>;
  }

  const handlePrint = () => {
    const printContents = receiptRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.html(receiptRef.current, {
      callback: function (doc) {
        doc.save("receipt.pdf");
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.6 },
    });
  };

  return (
    <div className="receipt-page">

      {/* ✅ SUCCESS / TRACKING CARD */}
      <div className="success-card">
        <div className="success-icon">✔</div>
        <h2>Payment Successful!</h2>

        <div className="delivery-status">
          <p className="status-title">ON THE WAY</p>
          <p>Arriving in 20 minutes</p>
        </div>

        <div className="map-box">
          🚴 Delivery in progress...
        </div>

        <div className="delivery-info">
          <p><strong>Address:</strong></p>
          <p>
            {order.delivery.address}, {order.delivery.city} -{" "}
            {order.delivery.pincode}
          </p>
        </div>

        <div className="rider-info">
          <p><strong>Rider:</strong> Rahul V</p>

          <div className="rider-buttons">
            <button>Call</button>
            <button>Message</button>
          </div>
        </div>
      </div>

      {/* ✅ RECEIPT BOX */}
      <div className="receipt-box" ref={receiptRef}>
        <h2 className="receipt-title">Spotlight Cooky</h2>
        <p className="receipt-sub">Order Receipt</p>

        <hr />

        {order.items.map((item, index) => (
          <div className="receipt-item" key={index}>
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <hr />

        <div className="receipt-info">
          <p><strong>Address:</strong> {order.delivery.address}</p>
          <p><strong>City:</strong> {order.delivery.city}</p>
          <p><strong>Pincode:</strong> {order.delivery.pincode}</p>
          {order.delivery.landmark && (
            <p><strong>Landmark:</strong> {order.delivery.landmark}</p>
          )}
          <p><strong>Payment:</strong> {order.payment}</p>
        </div>

        <hr />

        <h3 className="receipt-total">Total: ₹{order.total}</h3>

        <p className="receipt-thank">Thank you for ordering ❤️</p>
      </div>

      {/* ✅ BUTTONS */}
      <div className="receipt-buttons">
        <button onClick={handlePrint}>Print</button>
        <button onClick={handleDownload}>Download PDF</button>
      </div>
    </div>
  );
}

export default Receipt;