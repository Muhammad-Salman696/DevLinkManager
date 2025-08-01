import Link from "next/link";
import { formStyles } from "../../lib/styles";
export default function Home() {

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className={formStyles.title}>Project Management</h1>
    <Link href="/login">
      <button className="bg-blue-600 text-white px-4 py-2 text-center rounded w-48">
          Click here to Login
      </button>
                
     </Link>
     <Link href="/signup">
      <button className="bg-blue-600 text-white px-4 py-2 text-center rounded w-48 mt-3">
          Click here to SignUp
      </button>
                
     </Link>
    </div>
    
  );
}
