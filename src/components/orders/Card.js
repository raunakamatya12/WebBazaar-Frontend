import Image from "next/image";
import ConfirmOrder from "./Confirm";
import {
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_PENDING,
} from "@/constants/orderStatus";
import OrderStatus from "./Status";

function OrderItemCard({ product, quantity }) {
  return (
    <div className="bg-white border border-gray-200 dark:border-gray-500 rounded-lg p-3 flex items-center gap-5 dark:bg-slate-700">
      <div className="w-20 h-20">
        <Image
          src={product?.imageUrls[0]}
          alt=""
          height={64}
          width={64}
          className="w-full h-full rounded-md object-cover"
        />
      </div>
      <div>
        <h3 className="font-medium text-lg">{product?.name}</h3>
        <p>
          Rs. {product?.price} x {quantity}
        </p>
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-slate-100 rounded-xl border border-gray-300 dark:text-white dark:border-gray-600 my-5 dark:bg-slate-800">
      <div className="flex items-center justify-between pt-4 px-6">
        <OrderStatus status={order.status} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4 px-6">
        {order.orderItems.map((item, index) => (
          <OrderItemCard
            key={index}
            product={item.product}
            quantity={item.quantity}
          />
        ))}
      </div>
      <div className="flex items-center justify-between bg-slate-300 py-3 px-6 rounded-b-xl dark:bg-slate-900">
        <h4 className="font-medium">Total price: {order.totalPrice}</h4>
        {order.status == ORDER_STATUS_PENDING && <ConfirmOrder order={order} />}
      </div>
    </div>
  );
}

export default OrderCard;
