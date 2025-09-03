"use client";

// import { Suspense } from "react";
// import { useSearchParams } from "next/navigation";
import { GET_ORDER_BY_ID } from "@/src/modules/order/operations";
import { useQuery } from "@apollo/client";
import Loading from "@/src/components/layout/Loading";
import SuccessPage from "./SuccessPage";

export default function CheckoutSuccessPage() {
  // const searchParams = useSearchParams();
  // const orderId = searchParams?.get("orderId");
  const { data, loading } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: "orderId" },
  });
  if (loading) return <Loading />;
  const order = data?.orderById;

  return (
    // <Suspense fallback={<>Loading...</>}>
    <SuccessPage order={order} />
    // </Suspense>
  );
}
