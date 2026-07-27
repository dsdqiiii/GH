import { NextRequest, NextResponse } from 'next/server'
// Sesuaikan import Supabase client atau DB client project-mu
import { supabaseAdmin } from '@/lib/supabase/admin' 

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 1. Ambil Parameter Query
    const unitId = searchParams.get('unit_id')
    const startDate = searchParams.get('start_date') // contoh: 2026-08-01
    const endDate = searchParams.get('end_date')     // contoh: 2026-08-31

    if (!unitId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Param unit_id, start_date, dan end_date wajib diisi.' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // 2. Fetch Order Items yang Mengunci Kalender
    // Hanya ambil order item dari order yang statusnya BUKAN CANCELLED/EXPIRED
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        id,
        unit_id,
        type_booking,
        guest_amount,
        status_item,
        check_in,
        check_out,
        orders!inner (
          id,
          booking_code,
          guest_name,
          guest_phone,
          status
        )
      `)
      .eq('unit_id', unitId)
      // Hanya ambil status order yang mengunci slot (exclude CANCELLED/REFUNDED)
      .in('orders.status', ['BOOKED', 'PENDING_PAYMENT'])
      // Exclude status_item CANCELLED jika ada
      .neq('status_item', 'CANCELLED')
      // Filter rentang tanggal yang overlapping dengan rentang filter kalender
      .lt('check_in', `${endDate}T23:59:59+07:00`)
      .gt('check_out', `${startDate}T00:00:00+07:00`)

    if (error) {
      console.error('Error fetching calendar data:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 3. Transform Data untuk Kalender Frontend
    const events = (orderItems || []).map((item) => {
      // Direct access property order
      const order = Array.isArray(item.orders) ? item.orders[0] : item.orders

      return {
        id: item.id,
        order_id: order?.id,
        booking_code: order?.booking_code,
        guest_name: order?.guest_name,
        type_booking: item.type_booking, // 'inap' | 'transit'
        status: order?.status,           // 'BOOKED' | 'PENDING_PAYMENT'
        start: item.check_in,            // ISO string (e.g. 2026-08-05T14:00:00+07:00)
        end: item.check_out,             // ISO string
        
        // Metadata tambahan untuk styling UI kalender (opsional)
        display_color: order?.status === 'BOOKED' 
          ? (item.type_booking === 'transit' ? '#eab308' : '#22c55e') // Kuning untuk transit, Hijau untuk inap
          : '#f97316' // Oranye untuk pending payment
      }
    })

    return NextResponse.json({
      success: true,
      unit_id: unitId,
      total_events: events.length,
      data: events
    })

  } catch (err) {
    console.error('Internal Server Error:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    )
  }
}