"use client";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";

// Opens the house booking modal (dates from every channel, server-priced, PayPal).
export default function BookButton({
  id, name, price, maxGuests, cityTax, label = "Check dates", className = "",
}: { id: string; name: string; price: number; maxGuests: number; cityTax: number; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu";
  return (
    <>
      <button onClick={() => setOpen(true)} className={className || "bg-ink px-7 py-3.5 text-[15px] text-plaster hover:bg-cobalt transition-colors"}>
        {label}
      </button>
      <BookingModal
        isOpen={open}
        onClose={() => setOpen(false)}
        item={{ id, name, priceEUR: String(price) }}
        config={{
          maxGuestsPerUnit: maxGuests,
          baseGuestsPerUnit: maxGuests,
          maxUnits: 1,
          hasCityTax: true,
          cityTaxPerNight: cityTax,
          selectCheckout: true,
          propertyName: "The Douaria",
          paypalContainerId: `paypal-${id}`,
          unitLabel: id === "douaria-house" ? "house" : "room",
        }}
        formatPrice={(n) => `€${Math.round(n).toLocaleString("en-GB")}`}
        paypalClientId={clientId}
      />
    </>
  );
}
