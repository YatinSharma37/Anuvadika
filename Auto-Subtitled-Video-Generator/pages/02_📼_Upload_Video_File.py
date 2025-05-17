import whisper
import streamlit as st
from streamlit_lottie import st_lottie
from utils import write_vtt, write_srt
import ffmpeg
import requests
from typing import Iterator
from io import StringIO
import numpy as np
import pathlib
import os
import subprocess
import shutil

# Set up FFmpeg paths
APP_DIR = pathlib.Path(__file__).parent.absolute()
FFMPEG_DIR = APP_DIR / "ffmpeg"
FFMPEG_BIN = FFMPEG_DIR / "bin"
FFMPEG_EXE = FFMPEG_BIN / "ffmpeg.exe"

# Create necessary directories
FFMPEG_DIR.mkdir(exist_ok=True)
FFMPEG_BIN.mkdir(exist_ok=True)

LOCAL_DIR = APP_DIR / "local"
LOCAL_DIR.mkdir(exist_ok=True)
save_dir = LOCAL_DIR / "output"
save_dir.mkdir(exist_ok=True)

@st.cache_resource
def inference(_loaded_model, uploaded_file, task): 
    with open(f"{save_dir}/input.mp4", "wb") as f:
            if not uploaded_file or uploaded_file.size == 0:
                st.error("No file uploaded or the file is empty. Please upload a valid video file.")
                return None
            f.write(uploaded_file.getbuffer())
    audio = ffmpeg.input(f"{save_dir}/input.mp4")
    audio = ffmpeg.output(audio, f"{save_dir}/output.wav", acodec="pcm_s16le", ac=1, ar="16k")
    
    ffmpeg.run(audio, overwrite_output=True)
    if task == "Transcribe":
        options = dict(task="transcribe", best_of=5)
        results = _loaded_model.transcribe(f"{save_dir}/output.wav", **options)
        vtt = getSubs(results["segments"], "vtt", 80)
        srt = getSubs(results["segments"], "srt", 80)
        lang = results["language"]
        return results["text"], vtt, srt, lang
    elif task == "Translate":
        options = dict(task="translate", best_of=5)
        results = _loaded_model.transcribe(f"{save_dir}/output.wav", **options)
        vtt = getSubs(results["segments"], "vtt", 80)
        srt = getSubs(results["segments"], "srt", 80)
        lang = results["language"]
        return results["text"], vtt, srt, lang
    else:
        raise ValueError("Task not supported")

def getSubs(segments: Iterator[dict], format: str, maxLineWidth: int) -> str:
    segmentStream = StringIO()

    if format == 'vtt':
        write_vtt(segments, file=segmentStream, maxLineWidth=maxLineWidth)
    elif format == 'srt':
        write_srt(segments, file=segmentStream, maxLineWidth=maxLineWidth)
    else:
        raise Exception("Unknown format " + format)

    segmentStream.seek(0)
    return segmentStream.read()

def generate_subtitled_video(video, audio, transcript):
    try:
        # First, write the transcript file
        with open("transcript.srt", "w", encoding="utf-8") as f:
            f.write(transcript)
        
        # Use a simpler FFmpeg command that's more reliable
        command = [
            str(FFMPEG_EXE),
            "-i", video,
            "-vf", f"subtitles=transcript.srt:force_style='FontName=Arial,FontSize=24,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,Outline=1'",
            "-c:a", "copy",
            "-y",  # Overwrite output file if it exists
            "final.mp4"
        ]
        
        # Run FFmpeg command
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        
        # Get output and errors
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            st.error(f"FFmpeg error: {stderr}")
            raise Exception(f"FFmpeg failed with error: {stderr}")
        
        if not os.path.exists("final.mp4"):
            raise Exception("FFmpeg did not create the output file")
            
        return "final.mp4"
        
    except Exception as e:
        st.error(f"Error in video processing: {str(e)}")
        raise

# Check if FFmpeg is installed locally
def check_ffmpeg():
    if not FFMPEG_EXE.exists():
        st.error("""
        FFmpeg is not installed in the project directory. Please follow these steps:
        
        1. Download FFmpeg from: https://github.com/BtbN/FFmpeg-Builds/releases
           (Download the latest ffmpeg-master-latest-win64-gpl.zip)
        
        2. Extract the zip file
        
        3. Copy the contents of the 'bin' folder to:
           {ffmpeg_bin}
        
        4. Restart the application
        """.format(ffmpeg_bin=FFMPEG_BIN))
        return False
    return True

# Set FFmpeg path for the ffmpeg-python library
os.environ["PATH"] = str(FFMPEG_BIN) + os.pathsep + os.environ["PATH"]

st.set_page_config(page_title="Auto Subtitled Video Generator", page_icon=":movie_camera:", layout="wide")

# Check FFmpeg installation
if not check_ffmpeg():
    st.stop()

# Define a function that we can use to load lottie files from a link.
@st.cache_data
def load_lottieurl(url: str):
    try:
        r = requests.get(url)
        if r.status_code != 200:
            return None
        return r.json()
    except Exception as e:
        st.warning(f"Could not load animation: {str(e)}")
        return None

loaded_model = whisper.load_model("base")
current_size = "None"

# Main header with better styling
st.markdown("""
    <div style='text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 10px;'>
        <h1 style='margin: 0;'>Auto Subtitled Video Generator</h1>
        <p style='margin: 10px 0 0 0;'>Upload a video file and get a video with subtitles automatically</p>
    </div>
    """, unsafe_allow_html=True)

# Sidebar for model selection and task
with st.sidebar:
    st.markdown("### 🛠️ Settings")
    size = st.selectbox(
        "Select Model Size",
        ["tiny", "base", "small", "medium", "large"],
        index=1,
        help="Larger models provide better accuracy but take longer to process"
    )
    task = st.selectbox(
        "Select Task",
        ["Transcribe", "Translate"],
        index=0,
        help="Transcribe: Keep original language\nTranslate: Convert to English"
    )
    
    st.markdown("---")
    st.markdown("### ℹ️ About")
    st.markdown("""
        This tool automatically:
        - Transcribes or translates your video
        - Generates subtitles
        - Creates a new video with embedded subtitles
    """)

# Main content area
col1, col2 = st.columns([1, 2])
with col1:
    try:
        lottie = load_lottieurl("https://assets1.lottiefiles.com/packages/lf20_HjK9Ol.json")
        if lottie:
            st_lottie(lottie, height=300)
        else:
            st.image("https://img.icons8.com/color/96/000000/video.png", width=200)
    except Exception as e:
        st.image("https://img.icons8.com/color/96/000000/video.png", width=200)

with col2:
    st.markdown("""
        ### 📝 Instructions
        1. Upload your video file (MP4, AVI, MOV, MKV)
        2. Select model size and task
        3. Click the process button
        4. Download your subtitled video
    """)

# File uploader with better styling
st.markdown("### 📤 Upload Video")
input_file = st.file_uploader(
    "Choose a video file",
    type=["mp4", "avi", "mov", "mkv"],
    help="Supported formats: MP4, AVI, MOV, MKV"
)

if input_file is not None:
    filename = input_file.name[:-4]
else:
    filename = None

# Process button with better styling
if input_file is not None:
    if st.button(f"🎬 Process Video ({task})", key="process_button"):
        with st.spinner("Processing your video... This may take a few minutes"):
            try:
                results = inference(loaded_model, input_file, task)
                
                # Create two columns for video display
                col3, col4 = st.columns(2)
                
                with col3:
                    st.markdown("### Original Video")
                    st.video(input_file)
                
                with col4:
                    st.markdown("### Subtitled Video")
                    with st.spinner("Generating subtitled video..."):
                        output_path = generate_subtitled_video(
                            f"{save_dir}/input.mp4",
                            f"{save_dir}/output.wav",
                            results[2]  # This is the SRT content
                        )
                        if os.path.exists(output_path):
                            st.video(output_path)
                            st.success("Subtitled video generated successfully!")
                        else:
                            st.error("Failed to generate subtitled video")
                
                # Download buttons in a grid
                st.markdown("### 📥 Download Options")
                
                # Save transcript files
                with open("transcript.txt", "w", encoding="utf-8") as f:
                    f.write(results[0])  # Text content
                with open("transcript.vtt", "w", encoding="utf-8") as f:
                    f.write(results[1])  # VTT content
                with open("transcript.srt", "w", encoding="utf-8") as f:
                    f.write(results[2])  # SRT content
                
                col5, col6, col7, col8 = st.columns(4)
                
                with col5:
                    with open("transcript.txt", "rb") as f:
                        st.download_button(
                            "Download Transcript (.txt)",
                            f.read(),
                            file_name="transcript.txt",
                            help="Download text transcript"
                        )
                with col6:
                    with open("transcript.vtt", "rb") as f:
                        st.download_button(
                            "Download Transcript (.vtt)",
                            f.read(),
                            file_name="transcript.vtt",
                            help="Download VTT format subtitles"
                        )
                with col7:
                    with open("transcript.srt", "rb") as f:
                        st.download_button(
                            "Download Transcript (.srt)",
                            f.read(),
                            file_name="transcript.srt",
                            help="Download SRT format subtitles"
                        )
                with col8:
                    if os.path.exists(output_path):
                        with open(output_path, "rb") as f:
                            st.download_button(
                                "Download Video with Subtitles",
                                f.read(),
                                file_name=f"{filename}_with_subs.mp4",
                                help="Download video with embedded subtitles"
                            )
                
                # Information messages
                st.info("💡 You can edit the downloaded subtitle files and re-upload them to YouTube for better control over the subtitles.")
                st.success("✨ Processing complete! You can now download your files.")
                
            except Exception as e:
                st.error(f"❌ An error occurred: {str(e)}")
                st.error("Please try again or contact support if the problem persists.")

# Footer with better styling
st.markdown("---")
st.markdown("""
    <div style='text-align: center; padding: 20px;'>
        <p>Made with ❤️ by Yatin, Yashaswi, Vikas Gautum, Vikas</p>
    </div>
    """, unsafe_allow_html=True)

@st.cache_resource
def change_model(current_size, size):
    if current_size != size:
        loaded_model = whisper.load_model(size)
        return loaded_model
    else:
        raise Exception("Model size is the same as the current size.")