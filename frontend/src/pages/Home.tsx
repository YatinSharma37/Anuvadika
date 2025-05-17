import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FileVideo, Zap, Globe, Shield, ArrowRight, Play, Download, CheckCircle, Clock, Cpu, Brain, Sparkles, Laptop } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const subtitles = [
    { time: '00:00:05,000', text: 'Welcome to Anuvadika' },
    { time: '00:00:08,500', text: 'Your AI-powered subtitle generator' },
    { time: '00:00:12,000', text: 'Transform your videos with accurate subtitles' },
    { time: '00:00:16,500', text: 'Support for multiple languages and formats' },
    { time: '00:00:20,000', text: 'Fast, easy, and professional results' },
  ];

  const processingSteps = [
    { icon: <FileVideo className="w-6 h-6" />, text: 'Uploading Video' },
    { icon: <Brain className="w-6 h-6" />, text: 'AI Analysis' },
    { icon: <Cpu className="w-6 h-6" />, text: 'Processing Audio' },
    { icon: <Sparkles className="w-6 h-6" />, text: 'Generating Subtitles' },
  ];

  useEffect(() => {
    const subtitleInterval = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % subtitles.length);
    }, 4000);

    const processingInterval = setInterval(() => {
      setProcessingStep((prev) => (prev + 1) % processingSteps.length);
    }, 2000);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(subtitleInterval);
      clearInterval(processingInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <FileVideo className="w-6 h-6" />,
      title: 'Multiple Formats',
      description: 'Support for various video and audio formats including MP4, AVI, MP3, and more.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast Processing',
      description: 'Quick and efficient subtitle generation with advanced AI technology.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multiple Languages',
      description: 'Generate subtitles in multiple languages with high accuracy.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your files are processed securely and never stored permanently.',
    },
  ];

  const teamMembers = [
    {
      name: 'Vikas Gautam',
      role: 'Team Leader & Frontend Developer',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
      bio: 'Leading the team with expertise in frontend development and project management.',
    },
    {
      name: 'Yatin',
      role: 'Backend Engineer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Specialized in building robust backend systems and API development.',
    },
    {
      name: 'Yashaswi',
      role: 'Frontend Developer',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
      bio: 'Creating beautiful and responsive user interfaces with modern web technologies.',
    },
    {
      name: 'Vikas Kohli',
      role: 'AI Engineer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Expert in machine learning and natural language processing for subtitle generation.',
    },
  ];

  const reviews = [
    {
      name: 'John Doe',
      message: 'Amazing tool! Saved me hours of manual work.',
      rating: 5,
    },
    {
      name: 'Jane Smith',
      message: 'The accuracy is impressive. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Mike Johnson',
      message: 'Best subtitle generator I have ever used.',
      rating: 4,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const laptopVariants = {
    initial: { y: 100, opacity: 0, rotateX: 20, rotateY: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      rotateX: 20,
      rotateY: mousePosition.x,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const screenVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Generate Subtitles with{' '}
              <span className="text-primary relative">
                AI
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-dark-300 dark:text-light-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Transform your videos with accurate, AI-powered subtitles. Fast, easy, and professional.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2 group hover:scale-105 transition-transform"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2 group hover:scale-105 transition-transform"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-outline text-lg px-8 py-3 group hover:bg-primary hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-light-100 to-light-200 dark:from-dark-200 dark:to-dark-300 opacity-50" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 255, 136, 0.1) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      </section>

      {/* 3D Laptop Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-dark-200 via-primary/5 to-dark-300">
        <div className="absolute inset-0">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 2,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">See It In Action</h2>
            <p className="text-light-300">
              Watch how our AI transforms your videos into perfect subtitles
            </p>
          </motion.div>

          <motion.div
            variants={laptopVariants}
            initial="initial"
            animate="animate"
            className="relative max-w-4xl mx-auto perspective-1000"
            style={{
              transformStyle: 'preserve-3d',
              transform: `perspective(1000px) rotateX(${20 + mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
            }}
          >
            {/* Laptop Frame */}
            <div className="relative">
              {/* Laptop Screen */}
              <div className="relative aspect-[16/10] bg-dark-400 rounded-t-xl overflow-hidden shadow-2xl border-8 border-dark-300 transform-gpu">
                {/* Screen Content */}
                <motion.div
                  variants={screenVariants}
                  className="absolute inset-0 bg-gradient-to-br from-dark-200 to-dark-300 p-4"
                >
                  {/* Video Preview */}
                  <div className="relative h-full rounded-lg overflow-hidden bg-black/50">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-400 to-dark-500">
                      {/* Animated Particles */}
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-primary/30 rounded-full"
                          initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                          }}
                          animate={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                          }}
                          transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                        />
                      ))}
                    </div>

                    {/* Main Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      {/* Upload Animation */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-24 h-24 mb-6"
                      >
                        <motion.div
                          className="w-full h-full border-4 border-dashed border-primary/50 rounded-lg flex items-center justify-center"
                          animate={{
                            borderColor: ['rgba(0, 255, 136, 0.5)', 'rgba(0, 255, 136, 1)', 'rgba(0, 255, 136, 0.5)'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <FileVideo className="w-12 h-12 text-primary" />
                        </motion.div>
                      </motion.div>

                      {/* Processing Steps */}
                      <div className="w-full max-w-md space-y-4">
                        {processingSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.5 }}
                            className="flex items-center space-x-3 bg-black/30 p-3 rounded-lg"
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.2,
                              }}
                              className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
                            >
                              {step.icon}
                            </motion.div>
                            <span className="text-white">{step.text}</span>
                            <motion.div
                              className="ml-auto"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.5 + 1 }}
                            >
                              <CheckCircle className="w-5 h-5 text-primary" />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <motion.div
                        className="w-full max-w-md mt-6 h-2 bg-black/30 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                      >
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{
                            duration: 3,
                            ease: 'easeInOut',
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Subtitle Preview */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSubtitle}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="bg-black/80 p-4 rounded-lg"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-primary text-sm font-mono">
                              {subtitles[currentSubtitle].time}
                            </span>
                          </div>
                          <p className="text-white text-lg text-center">
                            {subtitles[currentSubtitle].text}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

                {/* Laptop Keyboard */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[120%] h-8 bg-dark-300 rounded-b-xl shadow-lg" />
              </div>

              {/* Processing Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-16 left-0 right-0 text-center"
              >
                <div className="inline-flex items-center space-x-2 bg-dark-300/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <span className="text-light-300">Processing Subtitles...</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: "AI-Powered",
                description: "Advanced neural networks for accurate transcription"
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Multi-Language",
                description: "Support for 50+ languages and dialects"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                description: "Process videos up to 10x faster than traditional methods"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card bg-dark-300/30 backdrop-blur-sm hover:bg-dark-300/50 transition-colors"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-light-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Processing Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-200 to-dark-300 dark:from-dark-300 dark:to-dark-400">
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">AI-Powered Processing</h2>
            <p className="text-light-300">
              Watch how our AI transforms your video into perfect subtitles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Processing Animation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video bg-black/50 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 relative">
                  {/* Outer Ring */}
                  <motion.div
                    className="absolute inset-0 border-4 border-primary/30 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  {/* Middle Ring */}
                  <motion.div
                    className="absolute inset-4 border-4 border-primary/50 rounded-full"
                    animate={{
                      scale: [1.2, 1, 1.2],
                      opacity: [0.8, 0.5, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  {/* Inner Ring */}
                  <motion.div
                    className="absolute inset-8 border-4 border-primary rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  {/* Center Icon */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Cpu className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={processingStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <div className="text-primary">
                      {processingSteps[processingStep].icon}
                    </div>
                    <span className="text-white">
                      {processingSteps[processingStep].text}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Processing Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="card bg-black/30 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4">How It Works</h3>
                <div className="space-y-4">
                  {processingSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {step.icon}
                      </div>
                      <span className="text-light-300">{step.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="card bg-black/30 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-white mb-4">AI Features</h3>
                <ul className="space-y-2 text-light-300">
                  <li>• Advanced speech recognition</li>
                  <li>• Multiple language support</li>
                  <li>• Automatic timestamp generation</li>
                  <li>• High accuracy transcription</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subtitle Preview Section */}
      <section className="py-20 bg-dark-200 dark:bg-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Generated Subtitles</h2>
            <p className="text-light-300">
              See how your subtitles will look with timestamps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Preview with Subtitles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-dark-300 dark:bg-dark-400 rounded-lg overflow-hidden shadow-xl"
            >
              {/* Video Preview */}
              <div className="aspect-video bg-black relative">
                {/* Sample Video/Image */}
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000"
                    alt="Sample Video Frame"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                      opacity: isHovered ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <Play className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: '0%' }}
                        animate={{ width: '45%' }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }}
                      />
                    </div>
                    <span className="text-white text-sm">00:45</span>
                  </div>
                </div>

                {/* Subtitle Display */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSubtitle}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="bg-black/80 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-primary text-sm font-mono">
                          {subtitles[currentSubtitle].time}
                        </span>
                      </div>
                      <p className="text-white text-lg text-center">
                        {subtitles[currentSubtitle].text}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Subtitle List */}
              <div className="p-6 bg-dark-200 dark:bg-dark-300">
                <h3 className="text-white font-semibold mb-4">Subtitle Preview</h3>
                <div className="space-y-3">
                  {subtitles.map((subtitle, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        backgroundColor: currentSubtitle === index ? 'rgba(0, 255, 136, 0.1)' : 'transparent'
                      }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-2 rounded-lg transition-colors"
                    >
                      <span className="text-primary text-sm font-mono mt-1">
                        {subtitle.time}
                      </span>
                      <p className="text-light-300 flex-1">
                        {subtitle.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Subtitle Features */}
            <div className="space-y-6">
              {/* Format Options */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="card bg-dark-300/30 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Export Formats</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['SRT', 'VTT', 'TXT', 'ASS'].map((format) => (
                    <motion.div
                      key={format}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 p-3 bg-black/20 rounded-lg"
                    >
                      <Download className="w-5 h-5 text-primary" />
                      <span className="text-light-300">{format}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Language Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card bg-dark-300/30 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Language Support</h3>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese'].map((lang) => (
                    <motion.div
                      key={lang}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 bg-primary/20 rounded-full text-primary text-sm"
                    >
                      {lang}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Customization Options */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card bg-dark-300/30 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Customization</h3>
                <div className="space-y-3">
                  {[
                    'Font Size & Style',
                    'Position & Alignment',
                    'Color & Opacity',
                    'Timing Adjustment'
                  ].map((option) => (
                    <motion.div
                      key={option}
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-2 text-light-300"
                    >
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{option}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Anuvadika?</h2>
            <p className="text-dark-300 dark:text-light-300">
              Experience the power of AI-driven subtitle generation
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="card group hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                <motion.div 
                  className="text-primary mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-dark-300 dark:text-light-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-dark-300 dark:text-light-300 max-w-2xl mx-auto">
              A diverse team of experts passionate about making video content accessible to everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-dark-300 dark:text-light-300 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Reviews</h2>
          <p className="text-dark-300 dark:text-light-300">
            What our users say about Anuvadika
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <div className="ml-4">
                  <h3 className="font-semibold">{review.name}</h3>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-primary">★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-dark-300 dark:text-light-300">
                "{review.message}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Share Your Feedback</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="input-field"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="Your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="input-field"
                placeholder="Your feedback"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Submit Feedback
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}; 