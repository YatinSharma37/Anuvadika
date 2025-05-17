import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, Upload, Play, Pause, Volume2, VolumeX, 
  Maximize2, Minimize2, Settings, Type, Palette, 
  ChevronDown, ChevronUp, X, User, LogOut, Mail,
  Shield, Clock, Video, FileUp, Sparkles, Languages,
  Loader2, MessageSquare, Send, Bot, User as UserIcon
} from 'lucide-react';
import { UsagePricing } from '../components/UsagePricing';
import { QuickStats } from '../components/QuickStats';
import { RecentActivity } from '../components/RecentActivity';
import { BubbleAnimation } from '../components/BubbleAnimation';
import { useAuth } from '../context/AuthContext';

interface SubtitleStyle {
  color: string;
  size: number;
  fontFamily: string;
  backgroundColor: string;
  opacity: number;
}

interface SubtitleFile {
  file: File;
  name: string;
  type: string;
}

interface AISubtitleOptions {
  language: string;
  style: 'formal' | 'casual' | 'technical';
  timing: 'accurate' | 'loose';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentUsage, setCurrentUsage] = useState(75);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSubtitleSettings, setShowSubtitleSettings] = useState(false);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>({
    color: '#ffffff',
    size: 24,
    fontFamily: 'Arial',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: 1
  });
  const [subtitleFile, setSubtitleFile] = useState<SubtitleFile | null>(null);
  const [showSubtitleUpload, setShowSubtitleUpload] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState(false);
  const [aiOptions, setAIOptions] = useState<AISubtitleOptions>({
    language: 'English',
    style: 'formal',
    timing: 'accurate'
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov'],
      'text/*': ['.srt', '.vtt'],
    },
  });

  const onSubtitleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSubtitleFile({
        file,
        name: file.name,
        type: file.type
      });
    }
  }, []);

  const { getRootProps: getSubtitleRootProps, getInputProps: getSubtitleInputProps, isDragActive: isSubtitleDragActive } = useDropzone({
    onDrop: onSubtitleDrop,
    accept: {
      'text/*': ['.srt', '.vtt'],
    },
    maxFiles: 1
  });

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleSubtitleStyleChange = (property: keyof SubtitleStyle, value: string | number) => {
    setSubtitleStyle(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleLogout = () => {
    logout();
  };

  const removeSubtitleFile = () => {
    setSubtitleFile(null);
  };

  const handleAIGenerate = async () => {
    if (!uploadedFiles.length) return;
    
    setIsGeneratingSubtitles(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, this would call your AI API
      console.log('Generating subtitles with options:', aiOptions);
    } catch (error) {
      console.error('Error generating subtitles:', error);
    } finally {
      setIsGeneratingSubtitles(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    // This would be replaced with actual AI API call
    const responses = [
      "Based on the video content, I can see that...",
      "The subtitles indicate that...",
      "Looking at the video timeline...",
      "According to the content...",
      "The video shows that..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <BubbleAnimation count={40} size={4} color="bg-primary/10" duration={5} />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user?.name || 'Guest'}</h2>
                    <p className="text-gray-400">{user?.email || 'Not logged in'}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Video className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-gray-400 text-sm">Total Videos</p>
                      <p className="text-white font-semibold">12</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-gray-400 text-sm">Processing Time</p>
                      <p className="text-white font-semibold">2.5 hours</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-gray-400 text-sm">Account Type</p>
                      <p className="text-white font-semibold">Premium</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Video Player Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Video Preview</h2>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAIPanel(!showAIPanel)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>AI Generate</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSubtitleUpload(!showSubtitleUpload)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <FileUp className="w-5 h-5" />
                        <span>Upload Subtitle</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSubtitleSettings(!showSubtitleSettings)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Subtitle Settings</span>
                        {showSubtitleSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>

                  {/* AI Generation Panel */}
                  {showAIPanel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-gray-700/30 rounded-lg"
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                            <select
                              value={aiOptions.language}
                              onChange={(e) => setAIOptions(prev => ({ ...prev, language: e.target.value }))}
                              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="English">English</option>
                              <option value="Spanish">Spanish</option>
                              <option value="French">French</option>
                              <option value="German">German</option>
                              <option value="Hindi">Hindi</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                            <select
                              value={aiOptions.style}
                              onChange={(e) => setAIOptions(prev => ({ ...prev, style: e.target.value as 'formal' | 'casual' | 'technical' }))}
                              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="formal">Formal</option>
                              <option value="casual">Casual</option>
                              <option value="technical">Technical</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Timing</label>
                            <select
                              value={aiOptions.timing}
                              onChange={(e) => setAIOptions(prev => ({ ...prev, timing: e.target.value as 'accurate' | 'loose' }))}
                              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="accurate">Accurate</option>
                              <option value="loose">Loose</option>
                            </select>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAIGenerate}
                          disabled={isGeneratingSubtitles || !uploadedFiles.length}
                          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingSubtitles ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              Generating Subtitles...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-2" />
                              Generate Subtitles
                            </>
                          )}
                        </motion.button>

                        {!uploadedFiles.length && (
                          <p className="text-sm text-yellow-500 text-center">
                            Please upload a video file first
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Subtitle Upload Panel */}
                  {showSubtitleUpload && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-gray-700/30 rounded-lg"
                    >
                      <div className="space-y-4">
                        <div
                          {...getSubtitleRootProps()}
                          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                            isSubtitleDragActive
                              ? 'border-primary bg-primary/10 scale-[1.02]'
                              : 'border-gray-600 hover:border-primary/50 hover:bg-gray-700/50'
                          }`}
                        >
                          <input {...getSubtitleInputProps()} />
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                          >
                            <FileUp className="w-12 h-12 text-primary mx-auto mb-4" />
                          </motion.div>
                          <p className="text-gray-300 mb-2">
                            {isSubtitleDragActive ? 'Drop the subtitle file here' : 'Drag & drop subtitle file here, or click to select'}
                          </p>
                          <p className="text-sm text-gray-400">Supported formats: SRT, VTT</p>
                        </div>

                        {subtitleFile && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-white font-medium">{subtitleFile.name}</p>
                                <p className="text-sm text-gray-400">
                                  {(subtitleFile.file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={removeSubtitleFile}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Subtitle Settings Panel */}
                  {showSubtitleSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-gray-700/30 rounded-lg"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Text Color</label>
                          <input
                            type="color"
                            value={subtitleStyle.color}
                            onChange={(e) => handleSubtitleStyleChange('color', e.target.value)}
                            className="w-full h-10 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
                          <input
                            type="color"
                            value={subtitleStyle.backgroundColor}
                            onChange={(e) => handleSubtitleStyleChange('backgroundColor', e.target.value)}
                            className="w-full h-10 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Font Size</label>
                          <input
                            type="range"
                            min="12"
                            max="48"
                            value={subtitleStyle.size}
                            onChange={(e) => handleSubtitleStyleChange('size', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-sm text-gray-400">{subtitleStyle.size}px</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Opacity</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={subtitleStyle.opacity}
                            onChange={(e) => handleSubtitleStyleChange('opacity', parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-sm text-gray-400">{Math.round(subtitleStyle.opacity * 100)}%</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Font Family</label>
                          <select
                            value={subtitleStyle.fontFamily}
                            onChange={(e) => handleSubtitleStyleChange('fontFamily', e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                          >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original Video */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-300">Original Video</h3>
                      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                        <video
                          ref={videoRef}
                          className="w-full h-full"
                          src="/sample-video.mp4"
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-2 text-white hover:text-primary transition-colors"
                              >
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-2 text-white hover:text-primary transition-colors"
                              >
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                              </motion.button>
                              <span className="text-white text-sm">
                                {formatTime(currentTime)} / {formatTime(duration)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select
                                value={playbackSpeed}
                                onChange={(e) => handlePlaybackSpeedChange(parseFloat(e.target.value))}
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-2 py-1 text-white text-sm"
                              >
                                <option value="0.5">0.5x</option>
                                <option value="1">1x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2x</option>
                              </select>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleFullscreen}
                                className="p-2 text-white hover:text-primary transition-colors"
                              >
                                {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                              </motion.button>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={(e) => setCurrentTime(Number(e.target.value))}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subtitled Video */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-300">Subtitled Video</h3>
                      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                        <video
                          className="w-full h-full"
                          src="/sample-video-subtitled.mp4"
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          style={{
                            '--subtitle-color': subtitleStyle.color,
                            '--subtitle-size': `${subtitleStyle.size}px`,
                            '--subtitle-font': subtitleStyle.fontFamily,
                            '--subtitle-bg': subtitleStyle.backgroundColor,
                            '--subtitle-opacity': subtitleStyle.opacity,
                          } as React.CSSProperties}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-2 text-white hover:text-primary transition-colors"
                              >
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-2 text-white hover:text-primary transition-colors"
                              >
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                              </motion.button>
                              <span className="text-white text-sm">
                                {formatTime(currentTime)} / {formatTime(duration)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select
                                value={playbackSpeed}
                                onChange={(e) => handlePlaybackSpeedChange(parseFloat(e.target.value))}
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-2 py-1 text-white text-sm"
                              >
                                <option value="0.5">0.5x</option>
                                <option value="1">1x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2x</option>
                              </select>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleFullscreen}
                                className="p-2 text-white hover:text-primary transition-colors"
                              >
                                {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                              </motion.button>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={(e) => setCurrentTime(Number(e.target.value))}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Upload Files</h2>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : 'border-gray-600 hover:border-primary/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-300 mb-2">
                      {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-400">Supported formats: MP4, AVI, MOV, SRT, VTT</p>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-white">Uploaded Files</h3>
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-white font-medium">{file.name}</p>
                              <p className="text-sm text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => {
                              setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <UsagePricing currentUsage={currentUsage} maxFreeUsage={100} />
              <QuickStats
                totalFiles={uploadedFiles.length}
                processingFiles={isUploading ? 1 : 0}
                completedFiles={uploadedFiles.length - (isUploading ? 1 : 0)}
                failedFiles={0}
              />
              <RecentActivity
                activities={[
                  {
                    id: "1",
                    type: 'upload',
                    fileName: 'sample-video.mp4',
                    timestamp: '2 minutes ago',
                  },
                  {
                    id: "2",
                    type: 'complete',
                    fileName: 'document.srt',
                    timestamp: '5 minutes ago',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <div className="fixed bottom-6 right-6 z-50" ref={chatRef}>
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 w-96 bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Anuvadika AI</h3>
                    <p className="text-sm text-gray-400">Your subtitle assistant</p>
                  </div>
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' ? 'bg-primary/20' : 'bg-blue-500/20'
                        }`}>
                          {message.type === 'user' ? (
                            <UserIcon className="w-5 h-5 text-primary" />
                          ) : (
                            <Bot className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-gray-700/50 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-50 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isAiTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 text-gray-400"
                  >
                    <Bot className="w-5 h-5" />
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about your video or subtitles..."
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!inputMessage.trim() || isAiTyping}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-500 shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        >
          <motion.div
            animate={{ rotate: isChatOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isChatOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Bot className="w-6 h-6" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}; 