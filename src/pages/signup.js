import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { formStyles } from "../../lib/styles";

export default function SignUp (){
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const router = useRouter();

    const handleSignUp = async (e)=>{
        e.preventDefault();

        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        })

        if(error) alert(error.message)
        else {
            alert("confirmation email is sent")
            router.push('/login');

        } 
        
    };
    const handleLogIn = ()=>{
        router.push("/login")
    }

    return(
        <>
            <form onSubmit={handleSignUp} className={formStyles.form}>
                <h3 className={formStyles.title}>Sign Up here!</h3>
                <input 
                className={formStyles.input}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />

                <input 
                className={formStyles.input}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />

                <button type="submit" className={formStyles.button}>Sign Up</button>
                <button type="button" onClick={handleLogIn} className={formStyles.button}> Log In </button>
            </form>
        </>
    )
}