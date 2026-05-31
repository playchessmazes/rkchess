import React from "react";
import { getSupabaseClient } from "@/utils/supabase";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let registrations: any[] = [];
  let errorMsg: string | undefined = undefined;

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase database select error:", error);
      errorMsg = error.message;
    } else {
      registrations = data || [];
    }
  } catch (err: any) {
    console.error("Failed to load registrations from database:", err);
    errorMsg = err.message || "Please check that your Supabase credentials are set correctly in .env.local.";
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <AdminDashboard initialData={registrations} error={errorMsg} />
    </div>
  );
}
