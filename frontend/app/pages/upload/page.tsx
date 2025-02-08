'use client';
import { ProtectedRoute } from "../../_components/ProtectedRoute";
import { FileUploadi } from "../../_components/FileUploadi";
import { DashboardLayout } from "../../_components/DashboardLayout";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Upload Files</h1>
          <FileUploadi />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 