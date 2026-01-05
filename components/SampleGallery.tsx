'use client';

import { useState } from 'react';

interface SampleImage {
    id: string;
    name: string;
    description: string;
    category: 'person' | 'object' | 'scene' | 'text';
    url: string;
}

interface SampleGalleryProps {
    onImageSelect: (imageBase64: string, imageName: string) => void;
    disabled?: boolean;
}

export default function SampleGallery({ onImageSelect, disabled = false }: SampleGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState<string | null>(null);

    // Sample images - in production, these would be actual image URLs
    const sampleImages: SampleImage[] = [
        {
            id: 'person-1',
            name: 'Person at Desk',
            description: 'Person working at a computer desk',
            category: 'person',
            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
        },
        {
            id: 'person-2',
            name: 'Portrait',
            description: 'Professional headshot portrait',
            category: 'person',
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        },
        {
            id: 'object-1',
            name: 'Coffee Cup',
            description: 'Coffee cup on a wooden table',
            category: 'object',
            url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
        },
        {
            id: 'object-2',
            name: 'Laptop',
            description: 'Modern laptop computer',
            category: 'object',
            url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        },
        {
            id: 'scene-1',
            name: 'Office Space',
            description: 'Modern office interior',
            category: 'scene',
            url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        },
        {
            id: 'scene-2',
            name: 'City Street',
            description: 'Urban street scene',
            category: 'scene',
            url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        },
        {
            id: 'text-1',
            name: 'Book Pages',
            description: 'Open book with text',
            category: 'text',
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        },
        {
            id: 'text-2',
            name: 'Handwriting',
            description: 'Handwritten notes',
            category: 'text',
            url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
        },
    ];

    const categories = [
        { id: 'all', name: 'All', icon: '🖼️' },
        { id: 'person', name: 'People', icon: '👤' },
        { id: 'object', name: 'Objects', icon: '📦' },
        { id: 'scene', name: 'Scenes', icon: '🏙️' },
        { id: 'text', name: 'Text', icon: '📝' },
    ];

    const filteredImages = selectedCategory === 'all'
        ? sampleImages
        : sampleImages.filter(img => img.category === selectedCategory);

    const handleImageSelect = async (image: SampleImage) => {
        if (disabled) return;

        setLoading(image.id);
        try {
            // Fetch the image and convert to base64
            const response = await fetch(image.url);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                onImageSelect(base64, image.name);
                setIsOpen(false);
                setLoading(null);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Failed to load sample image:', error);
            setLoading(null);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                disabled={disabled}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Try Sample Images</span>
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-xl font-bold text-white">Sample Images</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Category Filter */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-2 overflow-x-auto">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${selectedCategory === category.id
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredImages.map(image => (
                            <button
                                key={image.id}
                                onClick={() => handleImageSelect(image)}
                                disabled={loading === image.id || disabled}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* Image */}
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-white font-semibold text-sm">{image.name}</p>
                                        <p className="text-gray-200 text-xs mt-1">{image.description}</p>
                                    </div>
                                </div>

                                {/* Loading Spinner */}
                                {loading === image.id && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs text-white">
                                    {categories.find(c => c.id === image.category)?.icon}
                                </div>
                            </button>
                        ))}
                    </div>

                    {filteredImages.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No images in this category</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Click any image to analyze it with AI • Images from Unsplash
                    </p>
                </div>
            </div>
        </>
    );
}
