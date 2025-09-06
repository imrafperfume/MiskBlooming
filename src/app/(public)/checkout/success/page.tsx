"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GET_ORDER_BY_ID } from "@/src/modules/order/operations";
import { useQuery } from "@apollo/client";
import Loading from "@/src/components/layout/Loading";
import SuccessPage from "./SuccessPage";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  
  const { data, loading } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId },
    skip: !orderId,
  });
  
  if (loading) return <Loading />;
  const order = data?.orderById;

  return <SuccessPage order={order} />;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
