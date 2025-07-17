import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "../../lib/supabaseClient";

export default function App({ Component, pageProps }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}



