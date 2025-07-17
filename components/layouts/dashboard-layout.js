// components/layout/DashboardLayout.js
import Navbar from './navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
