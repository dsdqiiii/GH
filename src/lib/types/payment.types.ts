export interface VerifyPaymentResult {
  id: string;
  order_id: string;
  status: string;
  verified_by: string | null;
  verified_at: string | null;
  notes: string | null;
}

export interface PaymentDetail {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  proof_url: string | null;
  destination_bank_name: string;
  destination_account_number: string;
  destination_account_holder: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order: {
    id: string;
    booking_code: string;
    guest_name: string | null;
    total_amount: number;
    status: string;
  } | null;
}

export interface PaymentSummaryWithSignedUrl {
  id: string;
  order_id: string;
  booking_code: string | null;
  amount: number;
  status: string; // e.g. "PENDING", "VERIFIED", "REJECTED"
  proof_url: string | null;
  signedUrl: string | null;
  destination_bank_name: string | null;
  destination_account_holder: string | null;
  destination_account_number: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}