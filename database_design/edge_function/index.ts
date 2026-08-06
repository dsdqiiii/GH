// import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Deno.serve(async (req: Request) => {
//   console.log("1. Function started");

//   try {
//     console.log("2. Reading body...");
//     const body = await req.json();
//     console.log("3. Body:", body);

//     const { booking_code, guest_email, guest_name } = body;

//     console.log("4. Reading env...");
//     const resendApiKey = Deno.env.get("RESEND_API_KEY");
//     const fromAddress =
//       Deno.env.get("RESEND_FROM") ??
//       "noreply-testing-gh@akarsistem.biz.id";

//     console.log("RESEND_API_KEY exists:", !!resendApiKey);
//     console.log("FROM:", fromAddress);

//     console.log("5. Sending to Resend...");

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
//         html: `<h1>${booking_code}</h1>`,
//       }),
//     });

//     console.log("6. Resend status:", res.status);

//     const text = await res.text();
//     console.log("7. Resend body:", text);

//     return new Response(text, {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     console.error("ERROR:", err);

//     return new Response(
//       JSON.stringify({
//         error: err instanceof Error ? err.message : String(err),
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// });