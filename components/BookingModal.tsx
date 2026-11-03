"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { MonthCalendar, todayYMD } from "./DatePicker";
import { readRef } from "./RefCatcher";

declare global {
  interface Window {
    paypal?: any;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

function trackEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    window.posthog?.capture(event, props);
  } catch {
    // analytics failures must not break the booking flow
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface BookingItem {
  id: string;
  name: string;
  priceEUR: string;
  iCalURL?: string;
  iCalURLAirbnb?: string;
}

export interface BookingConfig {
  maxGuestsPerUnit?: number;
  baseGuestsPerUnit?: number;
  maxNights?: number;
  maxUnits?: number;
  unitLabel?: string;
  hasCityTax?: boolean;
  cityTaxPerNight?: number;
  extraPersonFee?: number;
  selectCheckout?: boolean;
  propertyName?: string;
  paypalContainerId?: string;
  isPerPersonPricing?: boolean; // For journeys: price × guests instead of price × nights
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BookingItem;
  config: BookingConfig;
  formatPrice: (amount: number) => string;
  paypalClientId: string;
  onBookingComplete?: (data: any) => void;
}

// ============================================================================
// CALENDAR COMPONENT
// ============================================================================

function Calendar({
  selectedCheckIn,
  selectedCheckOut,
  onSelectDate,
  bookedDates,
}: {
  selectedCheckIn: string;
  selectedCheckOut: string;
  onSelectDate: (date: string) => void;
  bookedDates: string[];
  selectCheckout: boolean;
}) {
  // The house calendar (components/DatePicker.tsx) is this calendar, shared.
  return (
    <MonthCalendar
      start={selectedCheckIn}
      end={selectedCheckOut}
      onSelect={onSelectDate}
      min={todayYMD()}
      isUnavailable={(d) => bookedDates.includes(d)}
      showLegend
    />
  );
}

// ============================================================================
// PAYPAL COMPONENT
// ============================================================================

function PayPalButton({
  amount,
  description,
  clientId,
  createServerOrder,
  onSuccess,
  onError,
}: {
  amount: string;
  description: string;
  clientId: string;
  /** Saves the booking as a hold on the server and returns the PayPal order id. */
  createServerOrder: () => Promise<string>;
  /** Called with the PayPal order id once the guest approved; the server captures it. */
  onSuccess: (orderId: string) => void;
  onError: (err: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const buttonsInstance = useRef<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let timeoutId: NodeJS.Timeout;

    const renderButton = async () => {
      if (!containerRef.current || !window.paypal || !isMounted.current) return;

      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        buttonsInstance.current = window.paypal.Buttons({
          style: { layout: "vertical", color: "black", shape: "rect", label: "pay", height: 50 },
          // The server writes the booking first, then opens the PayPal order for it.
          createOrder: () => createServerOrder(),
          // The guest approved: hand the order to the server, which takes the payment.
          onApprove: async (data: any) => {
            if (!isMounted.current) return;
            onSuccess(data.orderID);
          },
          onError: (err: any) => {
            if (!isMounted.current) return;
            onError(err);
          },
        });

        if (containerRef.current && isMounted.current) {
          await buttonsInstance.current.render(containerRef.current);
          if (isMounted.current) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("PayPal render error:", err);
        if (isMounted.current) {
          setError(true);
          setLoading(false);
        }
      }
    };

    const initPayPal = () => {
      if (window.paypal) {
        renderButton();
      } else {
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
          script.async = true;
          script.onload = () => {
            if (isMounted.current) renderButton();
          };
          script.onerror = () => {
            if (isMounted.current) {
              setError(true);
              setLoading(false);
            }
          };
          document.head.appendChild(script);
        } else {
          const checkInterval = setInterval(() => {
            if (window.paypal) {
              clearInterval(checkInterval);
              if (isMounted.current) renderButton();
            }
          }, 100);
          
          timeoutId = setTimeout(() => {
            clearInterval(checkInterval);
            if (isMounted.current && !window.paypal) {
              setError(true);
              setLoading(false);
            }
          }, 10000);
        }
      }
    };

    requestAnimationFrame(initPayPal);

    return () => {
      isMounted.current = false;
      if (timeoutId) clearTimeout(timeoutId);
      
      if (buttonsInstance.current && typeof buttonsInstance.current.close === "function") {
        try {
          buttonsInstance.current.close();
        } catch (e) {}
      }
      buttonsInstance.current = null;
    };
  }, [amount, description, clientId, createServerOrder, onSuccess, onError]);

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-foreground">Unable to load payment. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border border-foreground/20 border-t-foreground/60 animate-spin" />
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}

// ============================================================================
// QUANTITY SELECTOR
// ============================================================================

function QuantitySelector({
  label,
  value,
  min = 1,
  max = 10,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-foreground/10">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 flex items-center justify-center border border-foreground/20 text-foreground hover:border-foreground/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
        </button>
        <span className="w-8 text-center text-foreground">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 flex items-center justify-center border border-foreground/20 text-foreground hover:border-foreground/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="6" y1="2" x2="6" y2="10" />
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BookingModal({
  isOpen,
  onClose,
  item,
  config,
  formatPrice,
  paypalClientId,
  onBookingComplete,
}: BookingModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen || !item || !item.id) return null;

  return createPortal(
    <BookingModalContent
      onClose={onClose}
      item={item}
      config={config}
      formatPrice={formatPrice}
      paypalClientId={paypalClientId}
      onBookingComplete={onBookingComplete}
    />,
    document.body
  );
}

function BookingModalContent({
  onClose,
  item,
  config,
  formatPrice,
  paypalClientId,
  onBookingComplete,
}: Omit<BookingModalProps, "isOpen">) {
  const {
    maxGuestsPerUnit = 2,
    baseGuestsPerUnit = 2,
    maxNights = 30,
    maxUnits = 1,
    unitLabel = "room",
    hasCityTax = false,
    cityTaxPerNight = 2.5,
    extraPersonFee = 0,
    selectCheckout = true,
    isPerPersonPricing = false,
  } = config;

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(baseGuestsPerUnit);
  const [units, setUnits] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("");
  const [message, setMessage] = useState("");
  const [philosophyAcknowledged, setPhilosophyAcknowledged] = useState(false);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [acknowledgmentsError, setAcknowledgmentsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  // Discount code (the return-guest card, Jacqueline 1 Nov 2026). Shown for room bookings;
  // the server checks it and sets the real price again before PayPal.
  const [codeInput, setCodeInput] = useState("");
  const [applied, setApplied] = useState<{ code: string; percent: number; label: string } | null>(null);
  const [codeError, setCodeError] = useState("");
  const [codeBusy, setCodeBusy] = useState(false);

  // Calculate max guests based on units selected
  const maxGuests = maxGuestsPerUnit * units;
  const baseGuests = baseGuestsPerUnit * units;

  // Fetch booked dates from iCal + Supabase (website bookings)
  useEffect(() => {
    const allDates: string[] = [];

    const expandRange = (start: string, end: string) => {
      // Checkout day is NOT occupied — the room is free for a new arrival that day.
      // Block [check_in, check_out), excluding the checkout date itself.
      const s = new Date(start);
      const e = new Date(end);
      for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
        allDates.push(d.toISOString().split("T")[0]);
      }
    };

    const promises: Promise<void>[] = [];

    // Single source of truth: /api/availability merges Booking.com, Airbnb,
    // and direct bookings server-side and returns one blocked-date list.
    const roomParam = item.name ? `?room=${encodeURIComponent(item.name)}` : "";
    promises.push(
      fetch(`/api/availability${roomParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.bookedDates && Array.isArray(data.bookedDates)) {
            data.bookedDates.forEach((b: { start: string; end: string }) => expandRange(b.start, b.end));
          }
        })
        .catch((err) => console.error("Availability fetch failed:", err))
    );

    Promise.all(promises).then(() => {
      // Deduplicate
      setBookedDates(Array.from(new Set(allDates)));
    });
  }, [item.name]);

  // Handle date selection
  const handleDateSelect = (dateStr: string) => {
    if (selectCheckout) {
      // Date range mode: first click = check-in, second = check-out
      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(dateStr);
        setCheckOut("");
      } else if (dateStr > checkIn) {
        setCheckOut(dateStr);
      } else {
        setCheckIn(dateStr);
        setCheckOut("");
      }
    } else {
      // Single date mode (arrival only)
      setCheckIn(dateStr);
    }
  };

  // Calculate nights
  const calculatedNights = selectCheckout && checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : nights;

  // Pricing calculations
  const pricePerNight = parseFloat(item.priceEUR) || 0;
  
  // Per-person pricing mode (for journeys): price × guests
  // Standard mode (for rooms): price × nights × units + extras
  const subtotal = isPerPersonPricing 
    ? pricePerNight * guests 
    : pricePerNight * calculatedNights * units;
  const extraGuests = isPerPersonPricing ? 0 : Math.max(0, guests - baseGuests);
  const extraGuestsCost = extraGuests * extraPersonFee * calculatedNights;
  const cityTax = (hasCityTax && !isPerPersonPricing) ? cityTaxPerNight * guests * calculatedNights : 0;
  // Codes take a percentage off room nights only: never extras or city tax.
  const codeAllowed = hasCityTax && selectCheckout && !isPerPersonPricing && maxUnits === 1;
  const discount = applied && codeAllowed ? Math.round(subtotal * applied.percent) / 100 : 0;
  const total = subtotal + extraGuestsCost + cityTax - discount;

  const applyCode = async () => {
    const code = codeInput.trim();
    setCodeError("");
    if (!code) { setApplied(null); return; }
    setCodeBusy(true);
    try {
      const res = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, itemId: item.id }),
      });
      const data = await res.json();
      if (res.ok && data.code) { setApplied(data); setCodeInput(data.code); }
      else { setApplied(null); setCodeError(data.error || "That code doesn't work."); }
    } catch {
      setApplied(null); setCodeError("Couldn't check the code. Please try again.");
    } finally {
      setCodeBusy(false);
    }
  };

  const canProceedStep1 = isPerPersonPricing
    ? checkIn && guests >= 1
    : (selectCheckout ? checkIn && checkOut && calculatedNights >= 1 : checkIn && nights >= 1);

  const bookingPayload = useMemo(
    () => ({
      itemId: item.id,
      itemName: item.name,
      property: config.propertyName,
      checkIn,
      checkOut: selectCheckout ? checkOut : "",
      nights: calculatedNights,
      guests,
      units,
      totalEUR: total.toFixed(2),
      code: applied?.code || "",
      firstName,
      lastName,
      email,
      phone,
      language,
      message,
      philosophyAcknowledged,
      disclaimerAcknowledged,
      ref: readRef(),
    }),
    [item, config.propertyName, checkIn, checkOut, selectCheckout, calculatedNights, guests, units, total, applied, firstName, lastName, email, phone, language, message, philosophyAcknowledged, disclaimerAcknowledged]
  );

  // Step 1: the server saves the booking (held for the guest) and opens the PayPal order.
  const createServerOrder = useCallback(async (): Promise<string> => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });
    const data = await res.json();
    if (!res.ok || !data.orderID) throw new Error(data.error || "Could not start the payment");
    return data.orderID as string;
  }, [bookingPayload]);

  // Step 2: the guest approved in PayPal; the server takes the payment, confirms the
  // booking and sends the emails. If this browser never gets here, PayPal's own
  // notification confirms the booking anyway.
  const handlePaymentSuccess = useCallback(async (orderId: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: orderId }),
      });
      const result = await response.json();
      if (result.success) {
        setStep(4);
        onBookingComplete?.({ ...bookingPayload, bookingId: result.bookingId });
      } else {
        alert(result.error || "We could not confirm the payment. Please contact us.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("We could not confirm the payment. If you were charged, your booking is safe. Please contact us.");
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingPayload, onBookingComplete]);

  const handlePaymentError = useCallback((err: any) => {
    console.error("PayPal error:", err);
    alert("Payment failed. Please try again.");
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Reset form when item changes
  useEffect(() => {
    setStep(1);
    setCheckIn("");
    setCheckOut("");
    setNights(1);
    setGuests(baseGuestsPerUnit);
    setUnits(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setPhilosophyAcknowledged(false);
    setDisclaimerAcknowledged(false);
    setAcknowledgmentsError(false);
    setCodeInput("");
    setApplied(null);
    setCodeError("");
  }, [item.id, baseGuestsPerUnit]);

  // Cap guests when units decrease
  useEffect(() => {
    if (guests > maxGuests) {
      setGuests(maxGuests);
    }
  }, [units, maxGuests, guests]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Parse as local date (not UTC) so the label matches the stored date.
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background w-full max-w-md mx-4 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-foreground hover:text-foreground transition-colors z-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>

        <div className="p-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-foreground mb-1">{item.name}</h2>
            {maxNights > 1 || hasCityTax || maxGuestsPerUnit > baseGuestsPerUnit ? (
              <p className="text-sm text-foreground">{formatPrice(pricePerNight)} per night</p>
            ) : (
              <p className="text-sm text-foreground">{formatPrice(pricePerNight)}</p>
            )}
          </div>

          {/* Step 1: Dates */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <p className="text-[12px] tracking-[0.3em] uppercase text-foreground mb-6">
                Step 1 of 3 — {selectCheckout ? "Select dates" : "Select arrival"}
              </p>

              {/* Calendar */}
              <Calendar
                selectedCheckIn={checkIn}
                selectedCheckOut={checkOut}
                onSelectDate={handleDateSelect}
                bookedDates={bookedDates}
                selectCheckout={selectCheckout}
              />

              {/* Selected dates display */}
              {checkIn && (
                <div className="mt-6 pt-6 border-t border-foreground/10">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-foreground">Check-in: </span>
                      <span className="text-foreground">{formatDate(checkIn)}</span>
                    </div>
                    {selectCheckout && checkOut && (
                      <div>
                        <span className="text-foreground">Check-out: </span>
                        <span className="text-foreground">{formatDate(checkOut)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Nights selector (if not selectCheckout and not per-person pricing and maxNights > 1) */}
              {!selectCheckout && !isPerPersonPricing && maxNights > 1 && checkIn && (
                <div className="mt-4">
                  <QuantitySelector
                    label="Nights"
                    value={nights}
                    min={1}
                    max={maxNights}
                    onChange={setNights}
                  />
                </div>
              )}

              {/* Units selector */}
              {maxUnits > 1 && checkIn && (
                <QuantitySelector
                  label={`${unitLabel.charAt(0).toUpperCase() + unitLabel.slice(1)}s`}
                  value={units}
                  min={1}
                  max={maxUnits}
                  onChange={setUnits}
                />
              )}

              {/* Guests selector */}
              {maxGuests > 1 && checkIn && (
                <QuantitySelector
                  label="Guests"
                  value={guests}
                  min={1}
                  max={maxGuests}
                  onChange={setGuests}
                />
              )}

              {/* Discount code (optional) */}
              {codeAllowed && canProceedStep1 && (
                <div className="mt-6">
                  <label htmlFor="booking-code" className="block text-[12px] tracking-wider uppercase text-foreground mb-2">Code (optional)</label>
                  <div className="flex items-end gap-4">
                    <input
                      id="booking-code"
                      type="text"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      value={codeInput}
                      onChange={(e) => { setCodeInput(e.target.value); setApplied(null); setCodeError(""); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCode(); } }}
                      onBlur={() => { if (codeInput.trim() && !applied) applyCode(); }}
                      className="flex-1 py-3 bg-transparent border-0 border-b border-foreground/20 focus:border-foreground/40 focus:outline-none rounded-none text-foreground uppercase transition-colors"
                    />
                    <button
                      type="button"
                      onClick={applyCode}
                      disabled={codeBusy || !codeInput.trim() || !!applied}
                      className="pb-3 text-sm text-foreground underline underline-offset-4 disabled:no-underline"
                    >
                      {applied ? "Applied" : codeBusy ? "Checking…" : "Apply"}
                    </button>
                  </div>
                  {codeError && <p className="mt-2 text-sm text-foreground" role="alert">{codeError}</p>}
                </div>
              )}

              {/* Price summary */}
              {canProceedStep1 && (
                <div className="mt-6 pt-6 border-t border-foreground/10">
                  {/* Simple display for fixed-price items (1 night, 1 unit, base guests) */}
                  {calculatedNights === 1 && units === 1 && extraGuests === 0 && !hasCityTax && !discount ? (
                    <div className="flex justify-between text-base">
                      <span className="text-foreground">Total</span>
                      <span className="font-medium text-foreground">{formatPrice(total)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground">
                          {isPerPersonPricing 
                            ? `${formatPrice(pricePerNight)} × ${guests} guest${guests > 1 ? "s" : ""}`
                            : `${formatPrice(pricePerNight)} × ${calculatedNights} night${calculatedNights > 1 ? "s" : ""}${units > 1 ? ` × ${units} ${unitLabel}s` : ""}`
                          }
                        </span>
                        <span className="text-foreground">{formatPrice(subtotal)}</span>
                      </div>
                      {applied && discount > 0 && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground">{applied.label}</span>
                          <span className="text-foreground">−€{discount.toFixed(2)}</span>
                        </div>
                      )}
                      {extraGuests > 0 && extraPersonFee > 0 && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground">
                            Extra guest{extraGuests > 1 ? "s" : ""} ({extraGuests} × €{extraPersonFee})
                          </span>
                          <span className="text-foreground">€{extraGuestsCost.toFixed(2)}</span>
                        </div>
                      )}
                      {hasCityTax && !isPerPersonPricing && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground">City tax</span>
                          <span className="text-foreground">€{cityTax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base pt-3 border-t border-foreground/10">
                        <span className="text-foreground">Total</span>
                        <span className="font-medium text-foreground">{formatPrice(total)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Continue button */}
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full mt-8 py-4 bg-foreground text-background text-sm tracking-wider uppercase disabled:bg-[#7a726a] disabled:hover:bg-[#7a726a] disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Guest Details */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <p className="text-[12px] tracking-[0.3em] uppercase text-foreground mb-6">Step 2 of 3 — Your details</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] tracking-wider uppercase text-foreground mb-2">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] tracking-wider uppercase text-foreground mb-2">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] tracking-wider uppercase text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    required
                    aria-required="true"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[12px] tracking-wider uppercase text-foreground mb-2">
                    WhatsApp number <span className="normal-case text-foreground">(with country code)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    aria-required="true"
                    autoComplete="tel"
                    placeholder="+44 7700 900123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                  />
                  <p className="mt-2 text-[13px] text-foreground">We use WhatsApp to welcome you and to reach you on the day you arrive.</p>
                </div>

                <div>
                  <label className="block text-[12px] tracking-wider uppercase text-foreground mb-2">
                    Preferred language <span className="normal-case text-foreground">(optional)</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                  >
                    <option value="">Choose</option>
                    <option value="English">English</option>
                    <option value="French">Français</option>
                    <option value="Italian">Italiano</option>
                    <option value="Spanish">Español</option>
                    <option value="Portuguese">Português</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] tracking-wider uppercase text-foreground mb-2">
                    Special requests <span className="normal-case text-foreground">(optional)</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Acknowledgments — editorial, not legal */}
              <div className="mt-8">
                <div className="flex items-start gap-3">
                  <input
                    id="philosophy-acknowledged"
                    type="checkbox"
                    checked={philosophyAcknowledged}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setPhilosophyAcknowledged(next);
                      if (next) {
                        trackEvent("philosophy_acknowledged");
                        if (disclaimerAcknowledged) setAcknowledgmentsError(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    aria-required="true"
                    aria-describedby={acknowledgmentsError ? "acknowledgments-error" : undefined}
                    className="philosophy-checkbox mt-1 shrink-0 cursor-pointer"
                  />
                  <label
                    htmlFor="philosophy-acknowledged"
                    className="text-sm leading-relaxed text-[#0a0a0a] cursor-pointer"
                  >
                    I understand that the Douaria is a lived-in Medina house, not a
                    hotel.
                  </label>
                </div>
                <div className="flex items-start gap-3 mt-4">
                  <input
                    id="disclaimer-acknowledged"
                    type="checkbox"
                    checked={disclaimerAcknowledged}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setDisclaimerAcknowledged(next);
                      if (next) {
                        trackEvent("disclaimer_acknowledged");
                        if (philosophyAcknowledged) setAcknowledgmentsError(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    aria-required="true"
                    aria-describedby={acknowledgmentsError ? "acknowledgments-error" : undefined}
                    className="philosophy-checkbox mt-1 shrink-0 cursor-pointer"
                  />
                  <label
                    htmlFor="disclaimer-acknowledged"
                    className="text-sm leading-relaxed text-[#0a0a0a] cursor-pointer"
                  >
                    I have read the{" "}
                    <a
                      href="/before-you-book"
                      target="_blank"
                      rel="noopener"
                      className="underline"
                      style={{ color: "inherit" }}
                    >
                      Before you book
                    </a>{" "}
                    notes.
                  </label>
                </div>
                {acknowledgmentsError && (
                  <p
                    id="acknowledgments-error"
                    className="text-sm italic mt-2 text-[#0a0a0a]"
                    role="alert"
                  >
                    Please confirm you&rsquo;ve read both pages before continuing.
                  </p>
                )}
              </div>
              <style>{`
                .philosophy-checkbox {
                  appearance: none;
                  -webkit-appearance: none;
                  width: 20px;
                  height: 20px;
                  border: 1px solid #262626;
                  border-radius: 0;
                  background: transparent;
                  display: inline-block;
                  position: relative;
                  margin: 0;
                  padding: 0;
                }
                .philosophy-checkbox:checked {
                  background: #0a0a0a;
                  border-color: #0a0a0a;
                }
                .philosophy-checkbox:checked::after {
                  content: "";
                  position: absolute;
                  left: 5px;
                  top: 1px;
                  width: 6px;
                  height: 11px;
                  border: solid #ffffff;
                  border-width: 0 1.5px 1.5px 0;
                  transform: rotate(45deg);
                }
                .philosophy-checkbox:focus-visible {
                  outline: 2px solid #0a0a0a;
                  outline-offset: 2px;
                }
              `}</style>

              {/* Navigation */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-foreground/20 text-foreground text-sm tracking-wider uppercase hover:border-foreground/40 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="9,2 4,7 9,12" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!philosophyAcknowledged || !disclaimerAcknowledged) {
                      setAcknowledgmentsError(true);
                      trackEvent("philosophy_unchecked_submit_attempt", {
                        philosophy: philosophyAcknowledged,
                        disclaimer: disclaimerAcknowledged,
                      });
                      return;
                    }
                    setStep(3);
                  }}
                  disabled={!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) || phone.replace(/\D/g, "").length < 7}
                  className="flex-1 py-4 bg-foreground text-background text-sm tracking-wider uppercase disabled:bg-[#7a726a] disabled:hover:bg-[#7a726a] disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="5,2 10,7 5,12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <p className="text-[12px] tracking-[0.3em] uppercase text-foreground mb-6">Step 3 of 3 — Payment</p>

              {/* Booking summary with details */}
              <div className="bg-foreground/[0.03] p-6 mb-6">
                <p className="font-serif text-lg text-foreground mb-3">{item.name}</p>
                <p className="text-sm text-foreground mb-4">
                  {formatDate(checkIn)} {selectCheckout && checkOut ? `→ ${formatDate(checkOut)}` : ""}
                </p>
                
                {/* Detailed breakdown - simplified for fixed-price items */}
                <div className="space-y-2 pt-4 border-t border-foreground/10">
                  {calculatedNights === 1 && units === 1 && extraGuests === 0 && !hasCityTax && !discount ? (
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="font-medium text-foreground">{formatPrice(total)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {isPerPersonPricing 
                            ? `${guests} guest${guests > 1 ? "s" : ""}`
                            : `${units > 1 ? `${units} ${unitLabel}s × ` : ""}${calculatedNights} night${calculatedNights > 1 ? "s" : ""}`
                          }
                        </span>
                        <span className="text-foreground">{formatPrice(subtotal)}</span>
                      </div>
                      {applied && discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">{applied.label}</span>
                          <span className="text-foreground">−€{discount.toFixed(2)}</span>
                        </div>
                      )}
                      {extraGuests > 0 && extraPersonFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">
                            {extraGuests} extra guest{extraGuests > 1 ? "s" : ""} × {calculatedNights} night{calculatedNights > 1 ? "s" : ""}
                          </span>
                          <span className="text-foreground">€{extraGuestsCost.toFixed(2)}</span>
                        </div>
                      )}
                      {hasCityTax && cityTax > 0 && !isPerPersonPricing && (
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">City tax</span>
                          <span className="text-foreground">€{cityTax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base pt-3 border-t border-foreground/10 mt-3">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="font-medium text-foreground">{formatPrice(total)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <PayPalButton
                amount={total.toFixed(2)}
                description={`${item.name} - ${formatDate(checkIn)}`}
                clientId={paypalClientId}
                createServerOrder={createServerOrder}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />

              {isSubmitting && (
                <p className="text-center text-sm text-foreground mt-4">Processing payment...</p>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 py-4 border border-foreground/20 text-foreground text-sm tracking-wider uppercase hover:border-foreground/40 hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9,2 4,7 9,12" />
                </svg>
                Back
              </button>

              {/* Contact link */}
              <p className="text-center mt-6 text-[12px] text-foreground">
                <a href="/contact" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Send us a note</a>
              </p>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-16 h-16 border border-foreground/20 flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="6,14 12,20 22,8" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">Booking Confirmed</h3>
              <p className="text-sm text-foreground mb-8">
                Thank you! A confirmation has been sent to {email}
              </p>
              <button
                onClick={onClose}
                className="text-[12px] tracking-[0.2em] uppercase text-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
