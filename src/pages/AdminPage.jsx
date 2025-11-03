import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.is_admin) return;
    // reuse /orders? For admin you might create /admin/orders list endpoint.
    // For brevity we’ll reuse user orders; in real admin we’d create /admin/orders (all).
  }, [user]);

  if (!user?.is_admin) return <div className="p-6">Admin only</div>;

  async function updateStatus(order_id, status) {
    const res = await api(`/admin/orders/${order_id}`, {
      method: "PATCH",
      token,
      body: { status },
    });
    alert(`Updated ${order_id} → ${status}`);
    // refresh list if you have a dedicated admin list
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-semibold">Admin</h2>
      <p className="text-gray-600 mt-2">Use `/admin/orders/:id` API to update status from your ops tool, or extend this UI.</p>
      {/* TODO: add an orders table by adding a /admin/orders list endpoint */}
    </section>
  );
}
