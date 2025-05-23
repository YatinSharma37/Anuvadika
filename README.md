# Anuvadika
# Auto-Subtitled Video Generator

A full-stack application that automatically generates subtitles for videos in multiple languages. The project combines a modern React frontend with a Python-based video processing backend.

## 🌟 Features

- Video subtitle generation in multiple languages
- Support for YouTube video processing
- Real-time subtitle preview
- Multiple subtitle format exports (SRT, VTT)
- Modern, responsive user interface
- Multi-language support

## 🛠 Tech Stack

### Frontend
- *Framework*: React 18 with TypeScript
- *Build Tool*: Vite
- *Styling*: Tailwind CSS
- *State Management*: Zustand
- *UI Components*: 
  - Heroicons
  - Lucide React
  - React Icons
- *File Handling*: React Dropzone
- *HTTP Client*: Axios
- *Routing*: React Router DOM
- *Animation*: Framer Motion
- *Markdown Support*: React Markdown

### Backend
- *Language*: Python
- *Video Processing*: FFmpeg
- *Web Framework*: Streamlit
- *AI/ML*: 
  - OpenAI Whisper
  - PyTorch
  - Transformers
- *Video Processing*: 
  - FFmpeg
  - PyTubeFix
  - NumPy

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- FFmpeg
- Git

## 🚀 Setup Instructions



### ⚛️ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

   

### Backend Setup

# Navigate to backend directory
cd Auto-Subtitled-Video-Generator

# Create & activate virtual environment
# Windows
python -m venv venv
.\venv\Scripts\activate

# Unix/MacOS
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start Streamlit server
streamlit run 01_🎥_Input_YouTube_Link.py



## 🔧 Environment Variables

Create a .env file in the frontend directory with the following variables:

VITE_API_URL=http://localhost:8501


## 📁 Project Structure


├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
│
└── Auto-Subtitled-Video-Generator/  # Python backend
    ├── data/               # Data storage
    ├── pages/             # Streamlit pages
    └── utils.py           # Utility functions

```
## 🎯 API Endpoints

The backend provides the following main endpoints:
- /process-video: Process video and generate subtitles
- /download-subtitles: Download subtitles in various formats
- /translate: Translate subtitles to different languages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](Auto-Subtitled-Video-Generator/LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI Whisper for speech recognition
- FFmpeg for video processing
- Streamlit for the backend framework
- React and Vite for the frontend framework