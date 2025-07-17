import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      // 1. Get the full URL fragment
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      
      // 2. Extract token and type
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      // 3. Validate we have a recovery token
      if (!access_token || type !== 'recovery') {
        setError("Invalid password reset link");
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      try {
        // 4. Use the correct method for password recovery
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (error) throw error;

        // 5. If successful, allow password update
        setLoading(false);
      } catch (err) {
        console.error("Token verification failed:", err.message);
        setError("This link has expired or is invalid");
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    verifyToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      // Success - redirect with full page reload
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Verifying reset link...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="auth-container">
      <h1>Set New Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}