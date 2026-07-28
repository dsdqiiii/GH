// // supabase/functions/send-booking-email/index.ts
// //
// // Deploy: supabase functions deploy send-booking-email
// // Set secret: supabase secrets set RESEND_API_KEY=re_xxxxxxxx
// //
// // This is a minimal test version: only sends the booking code by email.

// import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Deno.serve(async (req: Request) => {
//   try {
//     const { booking_code, guest_email, guest_name } = await req.json();

//     if (!guest_email) {
//       return new Response(
//         JSON.stringify({ error: "guest_email is required" }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     const resendApiKey = Deno.env.get("RESEND_API_KEY");
//     const fromAddress = Deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev";

//     const res = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${resendApiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: fromAddress,
//         to: guest_email,
//         subject: `Kode Booking Anda: ${booking_code}`,
//         html: `
//           <p>Halo ${guest_name ?? "Tamu"},</p>
//           <p>Terima kasih telah melakukan booking. Kode booking Anda:</p>
//           <h2>${booking_code}</h2>
//           <p>Simpan kode ini untuk keperluan check-in.</p>
//         `,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return new Response(JSON.stringify({ error: data }), {
//         status: 502,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     return new Response(JSON.stringify({ success: true, data }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: String(err) }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// });