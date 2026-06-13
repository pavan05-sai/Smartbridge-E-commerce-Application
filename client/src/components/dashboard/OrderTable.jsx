import React from 'react';

export default function OrderTable({ orders = [], onStatusUpdate }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-success/10 text-success border-success/30';
      case 'shipped':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'processing':
        return 'bg-accent-blue/15 text-accent-electric border-accent-blue/30';
      default:
        return 'bg-text-secondary/10 text-text-secondary border-text-secondary/20';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (orders.length === 0) {
    return (
      <div className="card-glass rounded-xl p-6 text-center text-text-secondary text-sm">
        No customer orders found.
      </div>
    );
  }

  return (
    <div className="card-glass border border-borderBlue rounded-xl overflow-hidden shadow-lg">
      <div className="p-5 border-b border-borderBlue/35">
        <h3 className="text-base font-bold font-heading text-text-primary">Customer Orders</h3>
        <p className="text-xs text-text-secondary">Manage statuses of purchases containing your listings</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-primary border-b border-borderBlue/40 text-xs font-accent font-semibold text-text-secondary uppercase tracking-wider">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderBlue/20 text-sm">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-surface/30 odd:bg-surface/10 transition-colors">
                {/* ID */}
                <td className="px-6 py-4 font-accent text-xs font-semibold text-text-primary">
                  {order._id.substring(order._id.length - 8).toUpperCase()}
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-text-secondary">
                  {formatDate(order.createdAt)}
                </td>

                {/* Customer Info */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">{order.buyer?.name}</span>
                    <span className="text-xs text-text-secondary">{order.buyer?.email}</span>
                  </div>
                </td>

                {/* Total */}
                <td className="px-6 py-4 font-accent font-semibold text-text-primary">
                  ₹{order.totalAmount.toFixed(2)}
                </td>

                {/* Payment */}
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-accent font-bold uppercase border bg-success/15 border-success/30 text-success">
                    {order.paymentStatus}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-accent font-bold uppercase border ${getStatusStyle(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>

                {/* Inline Status Action dropdown */}
                <td className="px-6 py-4 text-right">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                    className="bg-background-primary border border-borderBlue rounded px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-accent-bright transition-all cursor-pointer font-accent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
