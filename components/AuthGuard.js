import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function AuthGuard ( {children} ) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
    const checkAuthAndStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const user = session.user;

      // Fetch profile to check status
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("status")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Failed to fetch profile:", error.message);
        router.push("/login");
        return;
      }

      if (profile.status === "inactive") {
        router.push("/reactivate");
        return;
      }

      setChecking(false); // All good, allow rendering children
    };

    checkAuthAndStatus();
  }, []);

  if (checking) return <p>Checking session...</p>;

  return children;
}