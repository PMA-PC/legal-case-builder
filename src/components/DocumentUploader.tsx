import React, { useState, useCallback } from 'react';

interface UploadedDocument {
    id: string;
    name: string;
    type: string;
    content: string; // Base64
    category: 'email' | 'review' | 'policy' | 'other';
}

interface DocumentUploaderProps {
    onUpload: (document: UploadedDocument) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [category, setCategory] = useState<UploadedDocument['category']>('other');

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const document: UploadedDocument = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type,
                content,
                category
            };
            onUpload(document);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach(processFile);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            Array.from(e.target.files).forEach(processFile);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="email">Email / Correspondence</option>
                    <option value="review">Performance Review</option>
                    <option value="policy">Handbook / Policy</option>
                    <option value="other">Other Evidence</option>
                </select>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer relative">
                            Upload a file
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </span>
                        {' '}or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        PDF, PNG, JPG, TXT up to 10MB
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploader;
