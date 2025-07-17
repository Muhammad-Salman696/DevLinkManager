import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function PasswordResetGuard({ children }) {
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    useEffect(() => {
    // Extract token from URL fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const type = params.get('type');

    if (!token || type !== 'recovery') {
      setError("Invalid reset link");
      router.push('/login');
      return;
    }

    // Exchange token for session
    supabase.auth
      .verifyOtp({
        token,
        type: 'recovery'
      })
      .then(({ error }) => {
        if (error) {
          setError("Expired or invalid link");
          router.push('/login');
        }
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  if (!isValidToken) return null;

  return children;
}