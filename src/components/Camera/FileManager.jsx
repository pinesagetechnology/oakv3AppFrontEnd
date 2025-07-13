import React, { useEffect, useState } from 'react';
import { Files, Download, Trash2, RefreshCw, Search, Video, Image, Calendar, HardDrive } from 'lucide-react';
import { useRecording } from '../../hooks/useRecording';
// import { formatFileSize, formatTimestamp } from '../../utils/helpers';
import Button from '../UI/Button';
import Card from '../UI/Card';
import Input from '../UI/Input';
import Badge from '../UI/Badge';
import LoadingSpinner from '../UI/LoadingSpinner';
import Stack from '../Layout/Stack';
import toast from 'react-hot-toast';

const FileManager = () => {
    const {
        files,
        isLoadingFiles,
        totalSize,
        totalCount,
        refreshFiles,
        deleteFile,
        downloadFile,
        cleanupFiles
    } = useRecording();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [sortBy, setSortBy] = useState('created');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        refreshFiles();
    }, []);

    const handleDelete = async (type, filename) => {
        if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
            try {
                const success = await deleteFile(type, filename);
                if (success) {
                    toast.success('File deleted successfully');
                } else {
                    toast.error('Failed to delete file');
                }
            } catch (error) {
                toast.error('Error deleting file');
            }
        }
    };

    const handleCleanup = async () => {
        if (window.confirm('This will delete old files based on the configured retention policy. Continue?')) {
            try {
                const success = await cleanupFiles();
                if (success) {
                    toast.success('Cleanup started');
                } else {
                    toast.error('Failed to start cleanup');
                }
            } catch (error) {
                toast.error('Error during cleanup');
            }
        }
    };

    // Combine and filter files
    const allFiles = [
        ...files.videos.map(f => ({ ...f, type: 'video' })),
        ...files.images.map(f => ({ ...f, type: 'image' }))
    ];

    const filteredFiles = allFiles
        .filter(file => {
            const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'all' || file.type === selectedType;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            const order = sortOrder === 'asc' ? 1 : -1;

            if (sortBy === 'created' || sortBy === 'modified') {
                return (new Date(aValue) - new Date(bValue)) * order;
            }

            return (aValue > bValue ? 1 : -1) * order;
        });

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Stack spacing={6}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">File Manager</h2>
                    <p className="text-sm text-gray-400">
                        Manage your recorded videos and captured images
                    </p>
                </div>
                <Button
                    onClick={refreshFiles}
                    variant="outline"
                    size="sm"
                    icon={RefreshCw}
                    loading={isLoadingFiles}
                >
                    Refresh
                </Button>
            </div>

            {/* Storage Overview */}
            <Card title="Storage Overview" icon={HardDrive}>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-white">{totalCount}</div>
                        <div className="text-sm text-gray-400">Total Files</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{files.videos.length}</div>
                        <div className="text-sm text-gray-400">Videos</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{files.images.length}</div>
                        <div className="text-sm text-gray-400">Images</div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Total Size: {formatFileSize(totalSize)}</span>
                        <Button
                            onClick={handleCleanup}
                            variant="outline"
                            size="sm"
                            icon={Trash2}
                        >
                            Cleanup Old Files
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Filters and Search */}
            <Card>
                <Stack spacing={4}>
                    <Input
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                    />

                    <div className="flex items-center space-x-4">
                        {/* File Type Filter */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Type:</span>
                            <div className="flex space-x-1">
                                {['all', 'video', 'image'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-3 py-1 text-sm rounded capitalize transition-colors ${selectedType === type
                                            ? 'bg-oak-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Sort:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                            >
                                <option value="created">Date Created</option>
                                <option value="filename">Name</option>
                                <option value="size">Size</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300 hover:bg-gray-600"
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                </Stack>
            </Card>

            {/* File List */}
            <Card>
                {isLoadingFiles ? (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-8">
                        <Files className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                            {searchTerm ? 'No files match your search' : 'No files found'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search terms' : 'Start recording or capturing images to see files here'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredFiles.map((file) => (
                            <div
                                key={`${file.type}-${file.filename}`}
                                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    {file.type === 'video' ? (
                                        <Video className="h-5 w-5 text-blue-400 flex-shrink-0" />
                                    ) : (
                                        <Image className="h-5 w-5 text-green-400 flex-shrink-0" />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white truncate">
                                            {file.filename}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {formatFileSize(file.size)} • {new Date(file.created).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <Badge
                                        variant={file.type === 'video' ? 'info' : 'success'}
                                        size="sm"
                                    >
                                        {file.type}
                                    </Badge>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <Button
                                        onClick={() => downloadFile(file.type + 's', file.filename)}
                                        variant="ghost"
                                        size="sm"
                                        icon={Download}
                                        title="Download"
                                    />
                                    <Button
                                        onClick={() => handleDelete(file.type + 's', file.filename)}
                                        variant="ghost"
                                        size="sm"
                                        icon={Trash2}
                                        title="Delete"
                                        className="text-red-400 hover:text-red-300"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </Stack>
    );
};

export default FileManager;