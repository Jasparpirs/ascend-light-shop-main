import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id, product_id, product_name, license_type, price, user_id } = await req.json();

    const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID")!;
    const PAYPAL_SECRET_KEY = Deno.env.get("PAYPAL_SECRET_KEY")!;
    const PAYPAL_BASE = "https://api-m.paypal.com";

    // Get access token
    const authRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const authData = await authRes.json();

    if (!authData.access_token) {
      throw new Error("Failed to get PayPal access token");
    }

    // Capture payment
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${order_id}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        "Content-Type": "application/json",
      },
    });
    const captureData = await captureRes.json();

    if (captureData.status !== "COMPLETED") {
      throw new Error("Payment not completed: " + JSON.stringify(captureData));
    }

    // Extract payer info
    const payerEmail = captureData.payer?.email_address || "unknown@paypal.com";
    const payerName = captureData.payer?.name
      ? `${captureData.payer.name.given_name || ""} ${captureData.payer.name.surname || ""}`.trim()
      : "PayPal User";

    // Insert license key using service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("license_keys")
      .insert({
        product_id,
        product_name,
        license_type,
        price: parseFloat(price),
        purchaser_name: payerName,
        purchaser_email: payerEmail,
        user_id: user_id || null,
      })
      .select("license_key, id")
      .single();

    if (error) {
      throw new Error("Failed to create license: " + error.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        license_key: data.license_key,
        license_id: data.id,
        payer_name: payerName,
        payer_email: payerEmail,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
