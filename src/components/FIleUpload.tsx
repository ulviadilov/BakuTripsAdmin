"use client";

import React, { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import {
    Upload,
    File,
    Image as ImageIcon,
    CheckCircle,
    AlertCircle,
    Eye,
    Trash2,
    Plus,
} from "lucide-react";

interface UploadedFile {
    id: string;
    file?: File;
    preview?: string;
    url?: string;
    status: "uploading" | "success" | "error";
    photoId:string;
    progress: number;
    error?: string | null;
}

interface FileUploadProps {
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    maxFiles?: number;
    onFilesChange?: (files: File[] | string | string[] | null | File) => void;
    className?: string;
    label?: string;
    description?: string;
    showPreview?: boolean;
    name?: string;
    control?: any;
    error?: string;
    required?: boolean;
    initialUrls?: string | string[] | {id:string,imagePath:string}[];
    onDelete?: (id:string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    accept = "*/*",
    multiple = false,
    maxSize = 10,
    maxFiles = 5,
    onFilesChange,
    className = "",
    label = "Upload Files",
    description = "Drag and drop files here or click to browse",
    showPreview = true,
    name,
    control,
    error,
    required = false,
    initialUrls,
    onDelete
}) => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const objectUrlsRef = useRef<string[]>([]);

    useEffect(() => {
        if (initialUrls) {
            const urls = Array.isArray(initialUrls)
                ? initialUrls
                : [initialUrls];
            if (Array.isArray(initialUrls)) {
                const initialFiles = (urls as {id:string,imagePath:string}[]).map((url:{id:string,imagePath:string}) => ({
                    id: url.imagePath,
                    url:url.imagePath,
                    photoId:url.id,
                    status: "success" as const,
                    progress: 100,
                }));
                setUploadedFiles(initialFiles);
            }else{
                const initialFiles = (urls as string[]).map((url:string) => ({
                    id: url,
                    url,
                    photoId:"",
                    status: "success" as const,
                    progress: 100,
                }));
                setUploadedFiles(initialFiles);
            }

        }
    }, [initialUrls]);

    console.log(uploadedFiles);

    const isImageFile = (file: File) => file.type.startsWith("image/");

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const validateFile = (file: File): string | null => {
        if (file.size > maxSize * 1024 * 1024) {
            return `File size must be less than ${maxSize}MB`;
        }
        return null;
    };

    const simulateUpload = (fileId: string) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setUploadedFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileId
                            ? { ...f, status: "success", progress: 100 }
                            : f
                    )
                );
            } else {
                setUploadedFiles((prev) =>
                    prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
                );
            }
        }, 100);
    };

    const handleFormChange = (
        files: UploadedFile[],
        onChange?: (files: File[] | File | null) => void
    ) => {
        const validFiles = files.filter((f) => !f.error && f.file);

        if (onChange) {
            if (multiple) {
                onChange(validFiles.map((f) => f.file!));
            } else {
                onChange(validFiles[0]?.file || null);
            }
        }

        if (onFilesChange) {
            if (multiple) {
                onFilesChange(validFiles.map((f) => f.file!));
            } else {
                onFilesChange(validFiles[0]?.file || null);
            }
        }
    };

    const processFiles = (
        files: FileList | File[],
        onChange?: (files: File[] | File | null) => void
    ) => {
        setIsProcessing(true);
        const fileArray = Array.from(files);

        if (uploadedFiles.length + fileArray.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed`);
            return;
        }

    const newFiles: UploadedFile[] = [];

        fileArray.forEach((file) => {
            const error = validateFile(file);
            const fileId = Date.now() + Math.random().toString(36);

            const uploadedFile: UploadedFile = {
                id: fileId,
                file,
                photoId:"",
                status: error ? "error" : "uploading",
                progress: error ? 0 : 0,
                error,
            };

            // Use object URLs for previews to avoid large base64 memory and main-thread work
            if (isImageFile(file) && !error) {
                const objectUrl = URL.createObjectURL(file);
                uploadedFile.preview = objectUrl;
                objectUrlsRef.current.push(objectUrl);
            }

            newFiles.push(uploadedFile);
        });

        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);

        newFiles.forEach((uploadedFile) => {
            if (!uploadedFile.error) {
                simulateUpload(uploadedFile.id);
            }
        });

        handleFormChange(updatedFiles, onChange);
        // Allow the UI to paint the overlay; then end processing on next tick
        requestAnimationFrame(() => setIsProcessing(false));
    };

    const removeFile = (
        fileId:string,
        photoId?:string,
        onChange?: (files: File[] | File | null) => void
    ) => {
        const removed = uploadedFiles.find((f) => f.id === fileId);
        // Revoke object URL if we created one for preview
        if (removed?.preview && removed.preview.startsWith("blob:")) {
            try { URL.revokeObjectURL(removed.preview); } catch {}
            objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== removed.preview);
        }
        const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
        if(Array.isArray(initialUrls) && onDelete){
            onDelete(photoId || "")
        }
        setUploadedFiles(updatedFiles);
        handleFormChange(updatedFiles, onChange);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (
        e: React.DragEvent,
        onChange?: (files: File[] | File | null) => void
    ) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files, onChange);
        }
    };

    const handleFileInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange?: (files: File[] | File | null) => void
    ) => {
        if (e.target.files) {
            processFiles(e.target.files, onChange);
        }
    };

    const getFileIcon = (file: File) => {
        return isImageFile(file) ? (
            <ImageIcon className="w-5 h-5" />
        ) : (
            <File className="w-5 h-5" />
        );
    };

    const getStatusIcon = (status: UploadedFile["status"]) => {
        switch (status) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "error":
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const FileUploadContent = ({
        onChange,
    }: {
        onChange?: (files: File[] | File | null) => void;
    }) => (
        <div className={`space-y-4 ${className}`}>
            {isProcessing && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-b-transparent border-blue-600" />
                        <p className="text-gray-700 text-sm">Processing files...</p>
                    </div>
                </div>
            )}
            {name && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragging
                        ? "border-blue-400 bg-blue-50"
                        : error
                        ? "border-red-300 hover:border-red-400 hover:bg-red-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, onChange)}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFileInput(e, onChange)}
                    className="hidden"
                />

                <div className="space-y-3">
                    <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {label}
                        </h3>
                        <p className="text-gray-500 mb-3 text-sm">
                            {description}
                        </p>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-900 cursor-pointer text-white rounded-lg transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Choose Files
                        </button>
                    </div>

                    <div className="text-xs text-gray-400">
                        <p>Maximum file size: {maxSize}MB</p>
                        <p>Maximum files: {maxFiles}</p>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {showPreview && uploadedFiles.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                        Uploaded Files ({uploadedFiles.length})
                    </h4>

                    <div className="space-y-2">
                        {uploadedFiles.map((uploadedFile) => (
                            <div
                                key={uploadedFile.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                            >
                                <div className="flex-shrink-0">
                                    {uploadedFile.preview ? (
                                        <img
                                            src={uploadedFile.preview}
                                            alt={uploadedFile.file?.name}
                                            className="w-10 h-10 object-cover rounded"
                                            loading="lazy"
                                        />
                                    ) : uploadedFile.url ? (
                                        <img
                                            src={uploadedFile.url}
                                            alt="Uploaded"
                                            className="w-10 h-10 object-cover rounded"
                                            loading="lazy"
                                        />
                                    ) : (
                                        uploadedFile.file && (
                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                {getFileIcon(uploadedFile.file)}
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {uploadedFile.file?.name ||
                                                uploadedFile.url}
                                        </p>
                                        {getStatusIcon(uploadedFile.status)}
                                    </div>

                                    {uploadedFile.file && (
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(
                                                uploadedFile.file.size
                                            )}
                                        </p>
                                    )}

                                    {uploadedFile.error && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {uploadedFile.error}
                                        </p>
                                    )}

                                    {uploadedFile.status === "uploading" && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${uploadedFile.progress}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Math.round(
                                                    uploadedFile.progress
                                                )}
                                                % uploaded
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    {(uploadedFile.preview ||
                                        uploadedFile.url) && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.open(
                                                    uploadedFile.preview ||
                                                        uploadedFile.url,
                                                    "_blank"
                                                )
                                            }
                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Preview"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFile(
                                                uploadedFile.id,
                                                uploadedFile.photoId,
                                                onChange
                                            )
                                        }
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    if (control && name) {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange } }) => (
                    <FileUploadContent onChange={onChange} />
                )}
            />
        );
    }

    useEffect(() => {
        // Cleanup all object URLs on unmount
        return () => {
            objectUrlsRef.current.forEach((u) => {
                try { URL.revokeObjectURL(u); } catch {}
            });
            objectUrlsRef.current = [];
        };
    }, []);

    return <FileUploadContent />;
};
