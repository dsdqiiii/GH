-- =========================================================
-- check_in_order_item (+ logging)
-- =========================================================
CREATE OR REPLACE FUNCTION check_in_order_item(
    p_order_item_id uuid
)
RETURNS order_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_item order_items;
    v_admin_id uuid := auth.uid();
BEGIN
    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: admin harus login';
    END IF;

    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Forbidden: hanya admin/staff yang boleh melakukan aksi ini';
    END IF;

    SELECT * INTO v_item
    FROM order_items
    WHERE id = p_order_item_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order item % tidak ditemukan', p_order_item_id;
    END IF;

    IF v_item.status_item <> 'BOOKED' THEN
        RAISE EXCEPTION 'Order item % tidak bisa check-in dari status % (harus BOOKED)',
            p_order_item_id, v_item.status_item;
    END IF;

    IF now() < v_item.check_in THEN
        RAISE EXCEPTION 'Belum waktunya check-in. Jadwal check-in: %', v_item.check_in;
    END IF;

    UPDATE order_items
    SET status_item = 'CHECKED_IN',
        checked_in_by = v_admin_id,
        checked_in_at = now()
    WHERE id = p_order_item_id
    RETURNING * INTO v_item;

    -- logging
    INSERT INTO activity_logs (
        actor_type, actor_id, event, entity_type, entity_id, metadata
    ) VALUES (
        'admin', v_admin_id, 'order_item.checked_in', 'order_item', v_item.id,
        jsonb_build_object(
            'order_id', v_item.order_id,
            'unit_id', v_item.unit_id,
            'checked_in_at', v_item.checked_in_at
        )
    );

    RETURN v_item;
END;
$$;