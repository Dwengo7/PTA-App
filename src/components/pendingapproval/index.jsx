import React from 'react';

const PendingApproval = () => {
  return (
    <div className="p-6 mt-12 text-center">
      <h1 className="text-2xl font-bold text-yellow-600">Pending Approval</h1>
      <p className="mt-4 text-gray-600">
        Your request to join the school has been sent. You’ll be notified once a teacher approves your request.
      </p>
    </div>
  );
};

export default PendingApproval;
