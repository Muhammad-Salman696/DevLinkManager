import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { formStyles } from "../../lib/styles";

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Fixed typo and initial state
    const router = useRouter();

    const handleLogIn = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        const user  = data?.user;
        if(!user){
            alert("You need to Sign up First!");
            setLoading(false);
            return;
        }
        
        const { data : profile } = await supabase
        .from('profiles')
        .select('*')
        .eq("user_id", user.id)
        .single();

        if (profile) {
            router.push('/dashboard');
        } else {
            router.push('/profile-setup');
            }
            setLoading(false)
        };

        const handleSignUp = ()=>{
            router.push("/signup")
        }
        

    return (
        <>
            <form onSubmit={handleLogIn} className={formStyles.form}>
            <h3 className={formStyles.title}>Log In here!</h3>
            <input 
                className={formStyles.input}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
            />
            <input 
                className={formStyles.input}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
            /> 
            <button type="submit" disabled={loading} className={formStyles.button}>
                {loading ? "Loading..." : "Log In"}
            </button>
            
            <button type="button" onClick={handleSignUp} className={formStyles.button}>
                Sign Up
            </button>

            <Link className={formStyles.link}
                href="/reset-password"
            >
                Forgot password?
            </Link>
        </form>
        
        </>
        
    );
}