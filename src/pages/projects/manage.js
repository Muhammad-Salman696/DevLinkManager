import ProjectList from "../../../components/projects/projects-list";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/layouts/dashboard-layout";
import Link from "next/link";

export default function ViewAll(){
    return(
        <AuthGuard> 
            <DashboardLayout>
                <h2 className="text-2xl font-semibold">Recent Projects</h2>
                <ProjectList/>
                <Link href="/dashboard">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3 mr-3">
                    Dashboard
                    </button>
                </Link>
                <Link href="/projects/create">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
                    + New Project
                    </button>
                </Link>
            </DashboardLayout> 
            
        </AuthGuard>
    )
}
