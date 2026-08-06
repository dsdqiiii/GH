-- =========================================================
-- verify_payment (+ logging)
-- =========================================================
CREATE OR REPLACE FUNCTION verify_payment(
    p_payment_id uuid,
    p_notes text DEFAULT NULL
)
RETURNS payments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_payment payments;
    v_order   orders;
    v_admin_id uuid := auth.uid();
BEGIN
    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: admin harus login';
    END IF;

    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Forbidden: hanya admin/staff yang boleh melakukan aksi ini';
    END IF;

-- lanjut ke SELECT ... FOR UPDATE seperti biasa

    SELECT * INTO v_payment
    FROM payments
    WHERE id = p_payment_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment % tidak ditemukan', p_payment_id;
    END IF;

    IF v_payment.status NOT IN ('PENDING', 'SUBMITTED') THEN
        RAISE EXCEPTION 'Payment % sudah diproses sebelumnya (status: %)', p_payment_id, v_payment.status;
    END IF;

    SELECT * INTO v_order
    FROM orders
    WHERE id = v_payment.order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order terkait payment % tidak ditemukan', p_payment_id;
    END IF;

    IF v_order.status <> 'PENDING_PAYMENT' THEN
        RAISE EXCEPTION 'Order % bukan dalam status PENDING_PAYMENT (status: %)', v_order.id, v_order.status;
    END IF;

    UPDATE payments
    SET status = 'VERIFIED',
        verified_by = v_admin_id,
        verified_at = now(),
        notes = COALESCE(p_notes, notes),
        updated_at = now()
    WHERE id = p_payment_id
    RETURNING * INTO v_payment;

    -- logging
    INSERT INTO activity_logs (
        actor_type, actor_id, event, entity_type, entity_id, metadata
    ) VALUES (
        'admin', v_admin_id, 'payment.verified', 'payment', v_payment.id,
        jsonb_build_object(
            'order_id', v_payment.order_id,
            'amount', v_payment.amount,
            'notes', p_notes
        )
    );

    RETURN v_payment;
END;
$$;