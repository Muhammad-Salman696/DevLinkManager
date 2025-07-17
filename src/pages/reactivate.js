import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function Reactivate() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndStatus() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("status")
        .eq("user_id", user.id)
        .single();

      if (error) {
        alert("Could not fetch profile");
        return;
      }

      setStatus(profile.status);
      setLoading(false);
    }

    fetchUserAndStatus();
  }, []);

  const handleReactivate = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ status: "active" })
      .eq("user_id", user.id);

    if (error) {
      alert("Failed to reactivate: " + error.message);
    } else {
      alert("Account reactivated!");
      router.push("/dashboard");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (status !== "inactive") {
    return <p>Your account is already active.</p>;
  }

  return (
    <div >
      <h2>Reactivate Account</h2>
      <p>Your account is currently inactive.</p>
      <button onClick={handleReactivate}>Reactivate My Account</button>
    </div>
  );
}
