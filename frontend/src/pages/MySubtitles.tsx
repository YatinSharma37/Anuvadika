import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FileVideo, Download, Trash2, Search, Filter } from 'lucide-react';

interface SubtitleFile {
  id: string;
  name: string;
  date: string;
  duration: string;
  language: string;
  format: 'srt' | 'txt';
}

export const MySubtitles = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'srt' | 'txt'>('all');

  // Mock data - replace with actual data from your backend
  const subtitleFiles: SubtitleFile[] = [
    {
      id: '1',
      name: 'presentation.mp4',
      date: '2024-03-15',
      duration: '5:30',
      language: 'English',
      format: 'srt',
    },
    {
      id: '2',
      name: 'interview.mp3',
      date: '2024-03-14',
      duration: '15:45',
      language: 'Spanish',
      format: 'txt',
    },
    {
      id: '3',
      name: 'lecture.mp4',
      date: '2024-03-13',
      duration: '45:20',
      language: 'French',
      format: 'srt',
    },
  ];

  const filteredFiles = subtitleFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || file.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const handleDownload = (file: SubtitleFile) => {
    // Implement download functionality
    console.log('Downloading:', file);
  };

  const handleDelete = (file: SubtitleFile) => {
    // Implement delete functionality
    console.log('Deleting:', file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">My Subtitles</h1>
        <p className="text-dark-300 dark:text-light-300">
          View and manage your generated subtitle files
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-dark-300 dark:text-light-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-dark-300 dark:text-light-300" />
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as 'all' | 'srt' | 'txt')}
              className="input-field"
            >
              <option value="all">All Formats</option>
              <option value="srt">SRT</option>
              <option value="txt">TXT</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Files List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-200 dark:border-light-200">
                  <th className="text-left py-4 px-4">File Name</th>
                  <th className="text-left py-4 px-4">Date</th>
                  <th className="text-left py-4 px-4">Duration</th>
                  <th className="text-left py-4 px-4">Language</th>
                  <th className="text-left py-4 px-4">Format</th>
                  <th className="text-left py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-dark-200 dark:border-light-200 hover:bg-light-100 dark:hover:bg-dark-300 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <FileVideo className="w-5 h-5 text-primary mr-2" />
                        {file.name}
                      </div>
                    </td>
                    <td className="py-4 px-4">{file.date}</td>
                    <td className="py-4 px-4">{file.duration}</td>
                    <td className="py-4 px-4">{file.language}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {file.format.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-1 hover:text-primary transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="p-1 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 