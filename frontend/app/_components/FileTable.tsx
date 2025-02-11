"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconDownload, IconRefresh, IconTrash } from "@tabler/icons-react";

interface FileData {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  createTime: string;
  cid: string;
}

interface FileTableProps {
  refreshTrigger?: number;
}

export function FileTable({ refreshTrigger = 0 }: FileTableProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFiles = async () => {
    try {
      setIsRefreshing(true);
      const { data } = await api.get<FileData[]>("/api/files/list");
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const handleDelete = async (cid: string) => {
    try {
      await api.delete(`/api/files/delete/${cid}`);
      fetchFiles();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDownload = async (cid: string, fileName: string) => {
    try {
      const response = await api.get(`/api/files/retrieve/${cid}`, {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="rounded-md border bg-white text-black shadow-sm">
      <div className="flex justify-end p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchFiles}
          disabled={isRefreshing}
        >
          <IconRefresh className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.fileId}>
              <TableCell className="font-medium">{file.fileName}</TableCell>
              <TableCell>{file.fileType}</TableCell>
              <TableCell>{(file.fileSize / 1024).toFixed(2)} KB</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file.cid, file.fileName)}
                >
                  <IconDownload className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(file.cid)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                >
                  <IconTrash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}