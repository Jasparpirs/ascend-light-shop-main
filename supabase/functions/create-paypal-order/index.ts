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
    const { product_id, product_name, license_type, price, return_url, cancel_url, user_id } = await req.json();

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

    // Create order
    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: product_id,
            description: product_name,
            amount: {
              currency_code: "USD",
              value: price.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "Ascend Software",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${return_url}?product_id=${encodeURIComponent(product_id)}&product_name=${encodeURIComponent(product_name)}&license_type=${encodeURIComponent(license_type)}&price=${price}${user_id ? `&user_id=${user_id}` : ""}`,
          cancel_url,
        },
      }),
    });

    const orderData = await orderRes.json();

    if (orderData.id) {
      const approveLink = orderData.links?.find((l: any) => l.rel === "approve")?.href;
      return new Response(
        JSON.stringify({ order_id: orderData.id, approve_url: approveLink }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      throw new Error(JSON.stringify(orderData));
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
