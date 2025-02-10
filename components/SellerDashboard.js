import React from "react";

function SellerDashboard() {
  const mockBids = [
    { id: 1, product: "Laptop", amount: "$500", status: "Pending" },
    { id: 2, product: "Mobile Phone", amount: "$300", status: "Accepted" },
  ];

  return (
    <div className="col-md-12">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Your Bids</h5>
        </div>
        <div className="card-body">
          {mockBids.length > 0 ? (
            <ul className="list-group">
              {mockBids.map((bid) => (
                <li key={bid.id} className="list-group-item d-flex justify-content-between">
                  <span>{bid.product}</span>
                  <span>
                    {bid.amount} -{" "}
                    <span className={`badge bg-${bid.status === "Accepted" ? "success" : "warning"}`}>
                      {bid.status}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">You have no bids yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
