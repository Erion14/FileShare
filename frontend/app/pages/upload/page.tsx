'use client';
import { ProtectedRoute } from "../../_components/ProtectedRoute";
import { FileUploadi } from "../../_components/FileUploadi";
import { FileTable } from "../../_components/FileTable";
import { DashboardLayout } from "../../_components/DashboardLayout";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Upload Files</h1>
          <FileUploadi />
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Files</h2>
            <FileTable />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 