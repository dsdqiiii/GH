CREATE OR REPLACE FUNCTION cancel_order(
    p_order_id uuid,
    p_notes text DEFAULT NULL
)
RETURNS orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order orders;
    v_admin_id uuid := auth.uid();
    v_item_ids uuid[];
BEGIN
    -- 1. Validasi Autentikasi Admin
    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: admin harus login';
    END IF;

    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Forbidden: hanya admin/staff yang boleh melakukan aksi ini';
    END IF;

    -- 2. Lock & Ambil data order
    SELECT * INTO v_order
    FROM orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order % tidak ditemukan', p_order_id;
    END IF;

    IF v_order.status IN ('CANCELLED', 'EXPIRED', 'COMPLETED') THEN
        RAISE EXCEPTION 'Order % tidak bisa dibatalkan dari status %', p_order_id, v_order.status;
    END IF;

    -- 3. Lock & Kumpulkan ID item yang terkait (Solusi subquery untuk FOR UPDATE)
    SELECT array_agg(id) INTO v_item_ids
    FROM (
        SELECT id 
        FROM order_items 
        WHERE order_id = p_order_id 
        FOR UPDATE
    ) locked_items;

    -- 4. Update order_items ke status CANCELLED 
    -- (Serta set cancelled_at, cancelled_by, dan cancel_reason sesuai constraint)
    IF v_item_ids IS NOT NULL THEN
        UPDATE order_items
        SET status_item = 'CANCELLED',
            cancelled_at = now(),
            cancelled_by = v_admin_id,
            cancel_reason = p_notes
        WHERE id = ANY(v_item_ids);
    END IF;

    -- 5. Update status order utama ke CANCELLED
    UPDATE orders
    SET status = 'CANCELLED',
        cancel_reason = p_notes,
        updated_at = now()
    WHERE id = p_order_id
    RETURNING * INTO v_order;

    -- 6. Logging Aktivitas
    INSERT INTO activity_logs (
        actor_type, actor_id, event, entity_type, entity_id, metadata
    ) VALUES (
        'admin', v_admin_id, 'order.cancelled', 'order', v_order.id,
        jsonb_build_object(
            'notes', p_notes,
            'cancelled_item_ids', v_item_ids
        )
    );

    RETURN v_order;
END;
$$;