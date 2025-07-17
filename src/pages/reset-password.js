
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { formStyles } from "../../lib/styles";

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Check your email for the reset link!");
        }
        setLoading(false);
    };

    return (
        
            <>
            <form onSubmit={handleReset} className={formStyles.form}>
                <h3 className={formStyles.title}>Reset Password</h3>
                <input
                    className={formStyles.input}
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    className={formStyles.button} 
                    type="submit" 
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <button className={formStyles.button}
                    onClick={() => router.push('/login')} 
                >
                    Back to Login
                </button>
                {message && <p className={formStyles.title}>{message}</p>}
                
            </form>
            
            </>
            
        
        
        
    );
}