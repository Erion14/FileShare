'use client';
import { ProtectedRoute } from "../../_components/ProtectedRoute";
import { FileUploadi } from "../../_components/FileUploadi";
import { UserMenu } from "../../_components/UserMenu";
import Link from "next/link";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#121212] py-12 px-4">
        {/* Navigation Bar */}
        <nav className="relative z-10 top-0 w-full p-4 flex justify-between items-center mb-8">
          <Link href="/" className="text-white text-xl font-bold hover:text-gray-300 transition-colors">
            FileShare
          </Link>
          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Upload Files</h1>
          <FileUploadi />
        </div>
      </div>
    </ProtectedRoute>
  );
} 