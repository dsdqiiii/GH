CREATE OR REPLACE FUNCTION complete_order(
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
    v_uncompleted_count integer;
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
        RAISE EXCEPTION 'Order % tidak bisa diselesaikan dari status %', p_order_id, v_order.status;
    END IF;

    -- 3. Validasi: Pastikan SEMUA item di order ini sudah CHECKED_OUT
    SELECT count(*) INTO v_uncompleted_count
    FROM order_items
    WHERE order_id = p_order_id
      AND (status_item <> 'CHECKED_OUT' OR checked_out_at IS NULL);

    IF v_uncompleted_count > 0 THEN
        RAISE EXCEPTION 'Order % tidak bisa diselesaikan karena masih ada % item yang belum CHECKED_OUT',
            p_order_id, v_uncompleted_count;
    END IF;

    -- 4. Update HANYA status order utama ke COMPLETED
    UPDATE orders
    SET status = 'COMPLETED',
        updated_at = now()
    WHERE id = p_order_id
    RETURNING * INTO v_order;

    -- 5. Logging Aktivitas
    INSERT INTO activity_logs (
        actor_type, actor_id, event, entity_type, entity_id, metadata
    ) VALUES (
        'admin', v_admin_id, 'order.completed', 'order', v_order.id,
        jsonb_build_object(
            'notes', p_notes
        )
    );

    RETURN v_order;
END;
$$;