import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function run() {
  const { data: webhooks, error } = await supabase
    .from("payment_webhooks")
    .select("id, payload, processed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching webhooks", error);
    return;
  }

  if (!webhooks) return;

  for (const webhook of webhooks) {
    const token = (webhook as any).payload?.TokenInfo?.Token as
      | string
      | undefined;
    if (!token) continue;

    const { data: existingToken, error: tokenErr } = await supabase
      .from("recurring_payments")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (tokenErr) {
      console.error("Error checking token", tokenErr);
      continue;
    }

    if (!existingToken || webhook.processed === false) {
      console.log(`Reprocessing webhook ${webhook.id} for token ${token}`);
      await supabase.functions.invoke("process-webhook", {
        body: { webhookId: webhook.id },
      });
    }
  }
}

run().then(() => console.log("Done"));
