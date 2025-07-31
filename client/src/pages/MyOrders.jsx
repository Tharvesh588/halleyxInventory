import { useOrders } from '../context/OrdersContext';

const MyOrders = () => {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <div key={idx} className="border rounded p-4 shadow">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold">Order Date: </span>
                {new Date(order.date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Status: </span>
                <span
                  className={`px-2 py-1 rounded text-white ${
                    order.status === 'Processing' ? 'bg-yellow-500' :
                    order.status === 'Shipped' ? 'bg-blue-600' :
                    order.status === 'Delivered' ? 'bg-green-600' :
                    'bg-gray-500'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="font-semibold">Shipping Address:</h2>
              <p>{order.shipping.fullName}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.postalCode}</p>
              <p>{order.shipping.country}</p>
            </div>

            <div>
              <h2 className="font-semibold mb-1">Items:</h2>
              <ul className="list-disc list-inside">
                {order.items.map(item => (
                  <li key={item._id}>
                    {item.name} x {item.quantity} — ${ (item.price * item.quantity).toFixed(2) }
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2 font-semibold">
              Total: ${order.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
