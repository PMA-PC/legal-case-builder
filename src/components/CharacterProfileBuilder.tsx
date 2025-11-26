import React from 'react';
import { CharacterProfileData, ProfileEvidence, UploadedFile } from '../types';
import { fileToBase64 } from '../utils/file';

interface CharacterProfileBuilderProps {
    profileData: CharacterProfileData;
    onProfileChange: (newProfileData: CharacterProfileData) => void;
}

const CharacterProfileBuilder: React.FC<CharacterProfileBuilderProps> = ({ profileData, onProfileChange }) => {

    const handleImageDescriptionChange = (id: string, description: string) => {
        const newEvidence = profileData.evidence.map(item =>
            item.id === id ? { ...item, description } : item
        );
        onProfileChange({ ...profileData, evidence: newEvidence });
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newEvidence: ProfileEvidence[] = [...profileData.evidence];

        for (const file of Array.from(files)) {
            const content = await fileToBase64(file);
            const uploadedFile: UploadedFile = {
                name: file.name,
                type: file.type,
                content: content,
            };
            newEvidence.push({
                id: `img-${Date.now()}-${Math.random()}`,
                file: uploadedFile,
                description: '',
            });
        }

        onProfileChange({ ...profileData, evidence: newEvidence });
    };

    const handleRemoveImage = (id: string) => {
        const newEvidence = profileData.evidence.filter(item => item.id !== id);
        onProfileChange({ ...profileData, evidence: newEvidence });
    };

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Upload and describe images (e.g., awards, team photos):</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Upload supporting images. The AI will use your descriptions and the content of your performance reviews to build a compelling "model employee" narrative.
                </p>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-300 dark:hover:file:bg-blue-900"
                />

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profileData.evidence.map(item => (
                        <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <img src={item.file.content} alt={item.file.name} className="w-full h-40 object-cover rounded-md mb-2" />
                            <textarea
                                value={item.description}
                                onChange={(e) => handleImageDescriptionChange(item.id, e.target.value)}
                                rows={2}
                                placeholder="Describe this image..."
                                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                            />
                            <button
                                onClick={() => handleRemoveImage(item.id)}
                                className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
                            >
                                Remove Image
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CharacterProfileBuilder;
