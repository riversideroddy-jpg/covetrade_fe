"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Info,
  AlertCircle,
  Copy,
  Check,
  Upload,
  CheckCircle,
  Loader2,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { BACKEND_URL } from "@/lib/constants";
import { AdminWallet } from "./types";
import { getCryptoIcon, getNetworkName } from "./crypto-icons";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DepositStep = "select" | "card" | "amount" | "address" | "success";

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [step, setStep] = useState<DepositStep>("select");
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<AdminWallet | null>(
    null,
  );
  const [dollarAmount, setDollarAmount] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingIntent, setSendingIntent] = useState(false);
  const [depositReference, setDepositReference] = useState("");

  // Card step state
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [submittingCard, setSubmittingCard] = useState(false);
  const [cardError, setCardError] = useState("");

  // Address / receipt step state
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchDepositOptions();
    }
  }, [isOpen]);

  // Calculate currency amount when dollar amount changes
  useEffect(() => {
    if (dollarAmount && selectedWallet) {
      const dollars = parseFloat(dollarAmount);
      const rate = parseFloat(selectedWallet.amount);
      if (!isNaN(dollars) && !isNaN(rate) && rate > 0) {
        setCurrencyAmount((dollars / rate).toFixed(8));
      } else {
        setCurrencyAmount("");
      }
    } else {
      setCurrencyAmount("");
    }
  }, [dollarAmount, selectedWallet]);

  const fetchDepositOptions = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/deposits/options/");
      const data = await res.json();
      if (data.success) {
        setWallets(data.wallets);
      } else {
        toast.error(data.error || "Failed to load deposit options");
      }
    } catch {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWallet = (wallet: AdminWallet) => {
    setSelectedWallet(wallet);
    setCopied(false);
    setStep("amount");
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError("");

    const rawNumber = cardNumber.replace(/\s/g, "");
    if (!cardholderName.trim()) {
      setCardError("Cardholder name is required");
      return;
    }
    if (rawNumber.length < 13 || rawNumber.length > 19) {
      setCardError("Invalid card number");
      return;
    }
    const expiryParts = cardExpiry.split("/");
    const expMonth = expiryParts[0]?.trim() || "";
    const expYear = expiryParts[1]?.trim() || "";
    if (expMonth.length !== 2 || expYear.length !== 2) {
      setCardError("Enter a valid expiry date (MM/YY)");
      return;
    }
    const monthNum = parseInt(expMonth, 10);
    if (monthNum < 1 || monthNum > 12) {
      setCardError("Invalid expiry month");
      return;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      setCardError("Invalid CVV");
      return;
    }

    setSubmittingCard(true);
    try {
      const res = await apiFetch("/cards/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardholder_name: cardholderName.trim(),
          card_number: rawNumber,
          expiry_month: expMonth,
          expiry_year: `20${expYear}`,
          cvv,
          billing_address: billingAddress.trim(),
          billing_zip: billingZip.trim(),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setCardError(data.error);
      } else {
        toast.info(
          data.message ||
            "Card payment is not available at this time. Please use cryptocurrency deposit options instead.",
        );
        // Reset card fields and go back to select
        setCardholderName("");
        setCardNumber("");
        setCardExpiry("");
        setCvv("");
        setBillingAddress("");
        setBillingZip("");
        setCardError("");
        setStep("select");
      }
    } catch {
      setCardError("Failed to connect to server");
    } finally {
      setSubmittingCard(false);
    }
  };

  const handleCopy = () => {
    if (!selectedWallet) return;
    navigator.clipboard.writeText(selectedWallet.wallet_address);
    setCopied(true);
  };

  const handleAmountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dollarAmount || parseFloat(dollarAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (!currencyAmount || !selectedWallet) return;
    setError("");
    setSendingIntent(true);

    try {
      await apiFetch("/deposits/payment-intent/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: selectedWallet.currency,
          dollar_amount: dollarAmount,
          currency_unit: currencyAmount,
        }),
      });
    } catch {
      // Non-blocking: proceed even if email fails
    } finally {
      setSendingIntent(false);
    }

    setCopied(false);
    setChecked(false);
    setReceipt(null);
    setStep("address");
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    const file = files?.[0];

    if (!file) return;

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setReceipt(file);
    setError("");
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.[0];

    if (!file) return;

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setReceipt(file);
    setError("");
  };

  const handleConfirmDeposit = async () => {
    if (!selectedWallet || !checked) {
      setError("Please confirm that you have funded your wallet");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("currency", selectedWallet.currency);
      formData.append("dollar_amount", dollarAmount);
      formData.append("currency_unit", currencyAmount);
      if (receipt) {
        formData.append("receipt", receipt);
      }

      const res = await fetch(`${BACKEND_URL}/deposits/create/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setDepositReference(data.transaction.reference);
        setStep("success");
        toast.success("Deposit request submitted successfully!");
      } else {
        toast.error(data.error || "Failed to submit deposit");
      }
    } catch {
      toast.error("Failed to submit deposit request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("select");
    setSelectedWallet(null);
    setDollarAmount("");
    setCurrencyAmount("");
    setReceipt(null);
    setError("");
    setCopied(false);
    setChecked(false);
    setDepositReference("");
    setCardholderName("");
    setCardNumber("");
    setCardExpiry("");
    setCvv("");
    setBillingAddress("");
    setBillingZip("");
    setCardError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full sm:max-w-[360px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0f1a2e] border border-gray-200 dark:border-white/10 shadow-2xl"
        >
          {/* ==================== STEP: SELECT PAYMENT METHOD ==================== */}
          {step === "select" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Choose Payment Method
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 max-w-[300px]">
                    Scroll and select your preferred payment method to deposit funds.
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Card Payment Option - Always at top */}
              <div
                className="bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl p-3 hover:border-[#5edc1f] dark:hover:border-[#5edc1f]/30 transition-all mb-3 cursor-pointer"
                onClick={() => setStep("card")}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#5edc1f] to-green-700">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Card Payment
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Visa, Mastercard, Amex, Discover
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStep("card");
                  }}
                  className="w-full py-2 bg-[#5edc1f] hover:bg-[#4cc015] text-white rounded-lg font-semibold transition-colors text-xs"
                >
                  Pay with Card
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
                </div>
              ) : wallets.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No deposit options available
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl p-3 hover:border-[#5edc1f] dark:hover:border-[#5edc1f]/30 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-[#0f1a2e] [&_svg]:!w-6 [&_svg]:!h-6">
                          {getCryptoIcon(wallet.currency)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {wallet.currency_display}
                          </h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {getNetworkName(wallet.currency)}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Rate: ${parseFloat(wallet.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} per unit
                            {wallet.rate_is_live && (
                              <span className="ml-1.5 text-[8px] font-semibold uppercase tracking-wide text-lime-500 bg-lime-500/10 px-1.5 py-0.5 rounded-full">Live</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectWallet(wallet)}
                        className="w-full py-2 bg-[#5edc1f] hover:bg-[#4cc015] text-white rounded-lg font-semibold transition-colors text-xs"
                      >
                        Deposit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== STEP: CARD ENTRY ==================== */}
          {step === "card" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCardError("");
                      setStep("select");
                    }}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Card Payment
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Enter your card details
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCardSubmit} className="space-y-3">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#5edc1f] text-sm placeholder-gray-400 dark:placeholder-gray-600"
                    placeholder="John Doe"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      className="w-full px-3.5 py-2.5 pr-11 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#5edc1f] text-sm font-mono placeholder-gray-400 dark:placeholder-gray-600"
                      placeholder="4242 4242 4242 4242"
                      maxLength={23}
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Expiry + CVV Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardExpiry}
                      onChange={(e) => {
                        const prev = cardExpiry;
                        const raw = e.target.value;
                        // Strip everything except digits
                        const digits = raw.replace(/\D/g, "").slice(0, 4);

                        // If user is deleting, allow raw backspace behavior
                        if (raw.length < prev.length) {
                          // If they backspaced into "MM/" → just show "MM"
                          if (prev.endsWith("/") && !raw.endsWith("/")) {
                            setCardExpiry(digits.slice(0, 2));
                            return;
                          }
                          // Otherwise format normally from remaining digits
                          if (digits.length <= 2) {
                            setCardExpiry(digits);
                          } else {
                            setCardExpiry(
                              digits.slice(0, 2) + "/" + digits.slice(2),
                            );
                          }
                          return;
                        }

                        // Typing forward: auto-insert slash after MM
                        if (digits.length <= 2) {
                          setCardExpiry(digits);
                        } else {
                          setCardExpiry(
                            digits.slice(0, 2) + "/" + digits.slice(2),
                          );
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#5edc1f] text-sm font-mono placeholder-gray-400 dark:placeholder-gray-600"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#5edc1f] text-sm font-mono placeholder-gray-400 dark:placeholder-gray-600"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Billing Address{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#5edc1f] text-sm placeholder-gray-400 dark:placeholder-gray-600"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>

                {/* Billing Zip */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Billing Zip Code{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#5edc1f] text-sm placeholder-gray-400 dark:placeholder-gray-600"
                    placeholder="10001"
                  />
                </div>

                {/* Error */}
                {cardError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-400">{cardError}</p>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCardError("");
                      setStep("select");
                    }}
                    className="flex-1 py-3 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCard}
                    className="flex-1 py-3 bg-[#5edc1f] hover:bg-[#4cc015] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {submittingCard ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Add Card
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== STEP: ENTER AMOUNT ==================== */}
          {step === "amount" && selectedWallet && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Enter Amount
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Currency Info */}
              <div className="bg-[#5edc1f]/10 border border-[#5edc1f]/30 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 dark:bg-[#0f1a2e] [&_svg]:!w-5 [&_svg]:!h-5">
                    {getCryptoIcon(selectedWallet.currency)}
                  </div>
                  <div>
                    <p className="text-sm text-[#5edc1f] dark:text-lime-400 font-semibold">
                      {selectedWallet.currency_display}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      Rate: ${parseFloat(selectedWallet.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} per unit
                      {selectedWallet.rate_is_live && (
                        <span className="text-[8px] font-semibold uppercase tracking-wide text-lime-500 bg-lime-500/10 px-1.5 py-0.5 rounded-full">Live</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-[#5edc1f]/10 border border-[#5edc1f]/20 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-lime-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-gray-700 dark:text-gray-300 mb-1.5">
                      Don&apos;t have cryptocurrency? Purchase from:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: "Binance", url: "https://www.binance.com" },
                        { name: "Coinbase", url: "https://www.coinbase.com" },
                        { name: "Crypto.com", url: "https://crypto.com" },
                        { name: "Kraken", url: "https://www.kraken.com" },
                      ].map((ex) => (
                        <a
                          key={ex.name}
                          href={ex.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-gray-200 dark:bg-white/5 rounded-md text-[9px] text-gray-700 dark:text-gray-300 font-medium hover:bg-[#5edc1f]/10 dark:hover:bg-[#5edc1f]/10 hover:text-[#5edc1f] dark:hover:text-lime-400 transition-colors"
                        >
                          {ex.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Form */}
              <form onSubmit={handleAmountSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1.5 font-medium">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dollarAmount}
                    onChange={(e) => {
                      setDollarAmount(e.target.value);
                      setError("");
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#5edc1f] text-base font-semibold placeholder-gray-400 dark:placeholder-gray-600"
                    placeholder="0.00"
                  />
                  <p className="text-[11px] text-center mt-1.5" style={{ color: "rgba(255,165,0,0.8)" }}>
                    All deposits are converted to USD for ease of use
                  </p>
                  {error && (
                    <p className="text-red-400 text-xs mt-1">{error}</p>
                  )}
                </div>

                {currencyAmount && dollarAmount && (
                  <div className="bg-gray-100 dark:bg-white/[0.04] rounded-lg p-3 border border-gray-200 dark:border-white/10">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                      You will send:
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-base font-bold text-[#5edc1f] dark:text-lime-400">
                        {currencyAmount}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedWallet.currency}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("select");
                      setDollarAmount("");
                      setError("");
                    }}
                    className="flex-1 py-3 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!dollarAmount || !currencyAmount || sendingIntent}
                    className="flex-1 py-3 bg-[#5edc1f] hover:bg-[#4cc015] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                  >
                    {sendingIntent ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== STEP: FUND WALLET + UPLOAD PROOF (fused) ==================== */}
          {step === "address" && selectedWallet && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => {
                    setStep("amount");
                    setReceipt(null);
                    setError("");
                    setCopied(false);
                    setChecked(false);
                  }}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large coin icon */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden mb-3 border-2 border-[#5edc1f]/20 [&_svg]:!w-16 [&_svg]:!h-16">
                  {getCryptoIcon(selectedWallet.currency)}
                </div>
                <h3 className="text-[16px] font-bold text-gray-900 dark:text-white">
                  {selectedWallet.currency}
                  {selectedWallet.currency !== getNetworkName(selectedWallet.currency) &&
                    ` (${getNetworkName(selectedWallet.currency)})`}
                </h3>

                {/* Wallet address */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[12px] font-mono truncate max-w-[260px] text-[#5edc1f] dark:text-lime-400">
                    {selectedWallet.wallet_address}
                  </span>
                  <button
                    onClick={handleCopy}
                    title={copied ? "Copied!" : "Copy address"}
                    className={`shrink-0 transition-colors ${
                      copied ? "text-[#5edc1f] dark:text-lime-400" : "text-gray-400 dark:text-white/40"
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px mb-5 bg-gray-200 dark:bg-white/10" />

              {/* Checkbox */}
              <div
                className="flex items-center gap-3 mb-5 cursor-pointer select-none"
                onClick={() => setChecked((v) => !v)}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                    checked
                      ? "bg-[#5edc1f] border-2 border-[#5edc1f]"
                      : "border-2 border-gray-300 dark:border-white/25"
                  }`}
                >
                  {checked && <Check className="w-3 h-3 text-[#0a1f00]" strokeWidth={3} />}
                </div>
                <span className="text-sm text-gray-700 dark:text-white/70">
                  I have funded my wallet
                </span>
              </div>

              {/* Upload area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-2xl border-1.5 border-dashed p-5 transition-all mb-5 ${
                  isDragging
                    ? "border-[#5edc1f] bg-[#5edc1f]/[0.06]"
                    : "border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/[0.03]"
                }`}
              >
                <input
                  type="file"
                  id="deposit-proof"
                  accept="image/*,.pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {receipt ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 bg-gray-100 dark:bg-white/8">
                      {receipt.type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={URL.createObjectURL(receipt)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 dark:text-white font-medium truncate">{receipt.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40">{(receipt.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      onClick={() => setReceipt(null)}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-red-500/15"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="deposit-proof" className="flex items-center gap-4 cursor-pointer">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-[#5edc1f]/10">
                      <Upload className="w-5 h-5 text-[#5edc1f] dark:text-lime-400" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900 dark:text-white">
                        Upload payment proof <span className="font-normal text-gray-400 dark:text-white/30">(optional)</span>
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40">PNG, JPG or PDF (max. 5MB)</p>
                    </div>
                  </label>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleConfirmDeposit}
                disabled={!checked || submitting}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  checked
                    ? "bg-[#5edc1f] hover:bg-[#4cc015] text-white cursor-pointer"
                    : "bg-[#5edc1f]/20 text-[#5edc1f]/50 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Top up complete"
                )}
              </button>
            </div>
          )}

          {/* ==================== STEP: SUCCESS ==================== */}
          {step === "success" && (
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-[#5edc1f]/12">
                <CheckCircle className="w-8 h-8 text-[#5edc1f] dark:text-lime-400" />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-2">
                Deposit Submitted!
              </h3>
              <p className="text-[13px] leading-relaxed mb-2 text-gray-500 dark:text-white/40">
                Your deposit is pending confirmation.
              </p>
              {depositReference && (
                <p className="text-[11px] font-mono mb-6 text-[#5edc1f] dark:text-lime-400">
                  Ref: {depositReference}
                </p>
              )}
              <p className="text-[12px] mb-8 text-gray-500 dark:text-white/40">
                Funds will be credited within 30 minutes to 24 hours after verification.
              </p>
              <button
                onClick={handleClose}
                className="w-full h-11 rounded-xl text-[13px] font-bold bg-[#5edc1f] hover:bg-[#4cc015] text-white transition-opacity hover:opacity-90"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
