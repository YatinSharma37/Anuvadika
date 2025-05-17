import whisper
import yt_dlp
import requests
import time
import streamlit as st
from streamlit_lottie import st_lottie
import numpy as np
import os
from typing import Iterator
from io import StringIO
from utils import write_vtt, write_srt
import ffmpeg
from languages import LANGUAGES
import torch
from zipfile import ZipFile
from io import BytesIO
import base64
import pathlib
import re

st.set_page_config(page_title="Auto Subtitled Video Generator", page_icon=":movie_camera:", layout="wide")

torch.cuda.is_available()
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
# Model options: tiny, base, small, medium, large
loaded_model = whisper.load_model("small", device=DEVICE)
current_size = "None"



# Define a function that we can use to load lottie files from a link.
def load_lottieurl(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

APP_DIR = pathlib.Path(__file__).parent.absolute()

LOCAL_DIR = APP_DIR / "local_youtube"
LOCAL_DIR.mkdir(exist_ok=True)
save_dir = LOCAL_DIR / "output"
save_dir.mkdir(exist_ok=True)



col1, col2 = st.columns([1, 3])
with col1:
    lottie = load_lottieurl("https://assets8.lottiefiles.com/packages/lf20_jh9gfdye.json")
    st_lottie(lottie)

with col2:
    st.write("""
    ## Auto Subtitled Video Generator 
    ##### Input a YouTube video link and get a video with subtitles.
    ###### ➠ If you want to transcribe the video in its original language, select the task as "Transcribe"
    ###### ➠ If you want to translate the subtitles to English, select the task as "Translate" 
    ###### I recommend starting with the base model and then experimenting with the larger models, the small and medium models often work well. """)


def validate_youtube_url(url):
    # Remove any whitespace
    url = url.strip()
    
    # Handle direct video IDs
    if len(url) == 11 and all(c.isalnum() or c in '-_' for c in url):
        return f"https://www.youtube.com/watch?v={url}"
    
    # Handle various YouTube URL formats
    patterns = [
        r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([^&]+)',
        r'(?:https?://)?(?:www\.)?youtube\.com/embed/([^/?]+)',
        r'(?:https?://)?(?:www\.)?youtube\.com/v/([^/?]+)',
        r'(?:https?://)?(?:www\.)?youtu\.be/([^/?]+)',
        r'(?:https?://)?(?:www\.)?youtube\.com/shorts/([^/?]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            video_id = match.group(1)
            # Validate video ID format
            if len(video_id) == 11 and all(c.isalnum() or c in '-_' for c in video_id):
                return f"https://www.youtube.com/watch?v={video_id}"
    
    return None

def download_video(link):
    try:
        if not validate_youtube_url(link):
            st.error("Invalid YouTube URL. Please enter a valid YouTube video link or video ID.")
            return None
            
        # Configure yt-dlp options
        ydl_opts = {
            'format': 'best[ext=mp4]',
            'outtmpl': os.path.join(save_dir, 'youtube_video.mp4'),
            'quiet': True,
            'no_warnings': True,
            'progress_hooks': [lambda d: st.progress(float(re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', d.get('_percent_str', '0%')).strip('%')) / 100 if '_percent_str' in d else 0)],
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([link])
            return os.path.join(save_dir, 'youtube_video.mp4')
        except Exception as e:
            st.error(f"Error downloading video: {str(e)}")
            return None
            
    except Exception as e:
        st.error(f"An error occurred while downloading the video: {str(e)}")
        return None


def convert(seconds):
    return time.strftime("%H:%M:%S", time.gmtime(seconds))


def change_model(current_size, size):
    if current_size != size:
        loaded_model = whisper.load_model(size)
        return loaded_model
    else:
        raise Exception("Model size is the same as the current size.")


def inference(link, loaded_model, task):
    try:
        if not validate_youtube_url(link):
            st.error("Invalid YouTube URL. Please enter a valid YouTube video link or video ID.")
            return None
            
        # Configure yt-dlp options for audio
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(save_dir, 'audio.mp3'),
            'quiet': True,
            'no_warnings': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'progress_hooks': [lambda d: st.progress(float(re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', d.get('_percent_str', '0%')).strip('%')) / 100 if '_percent_str' in d else 0)],
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([link])
            path = os.path.join(save_dir, 'audio.mp3')
            
            if task == "Transcribe":
                options = dict(task="transcribe", best_of=5)
                results = loaded_model.transcribe(path, **options)
                vtt = getSubs(results["segments"], "vtt", 80)
                srt = getSubs(results["segments"], "srt", 80)
                lang = results["language"]
                return results["text"], vtt, srt, lang
            elif task == "Translate":
                options = dict(task="translate", best_of=5)
                results = loaded_model.transcribe(path, **options)
                vtt = getSubs(results["segments"], "vtt", 80)
                srt = getSubs(results["segments"], "srt", 80)
                lang = results["language"]
                return results["text"], vtt, srt, lang
            else:
                raise ValueError("Task not supported")
        except Exception as e:
            st.error(f"Error processing audio: {str(e)}")
            return None
            
    except Exception as e:
        st.error(f"An error occurred during processing: {str(e)}")
        return None


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


def get_language_code(language):
    if language in LANGUAGES.keys():
        detected_language = LANGUAGES[language]
        return detected_language
    else:
        raise ValueError("Language not supported")


def generate_subtitled_video(video, audio, transcript):
    video_file = ffmpeg.input(video)
    audio_file = ffmpeg.input(audio)
    ffmpeg.concat(video_file.filter("subtitles", transcript), audio_file, v=1, a=1).output("youtube_sub.mp4").run(quiet=True, overwrite_output=True)
    video_with_subs = open("youtube_sub.mp4", "rb")
    return video_with_subs        
    

def main():
    size = st.selectbox("Select Model Size (The larger the model, the more accurate the transcription will be, but it will take longer)", ["tiny", "base", "small", "medium", "large-v3"], index=1)
    loaded_model = change_model(current_size, size)
    st.write(f"Model is {'multilingual' if loaded_model.is_multilingual else 'English-only'} "
        f"and has {sum(np.prod(p.shape) for p in loaded_model.parameters()):,} parameters.")
    
    link = st.text_input("YouTube Link (The longer the video, the longer the processing time)", 
                        placeholder="Enter YouTube URL or video ID (e.g., https://youtube.com/watch?v=VIDEO_ID or VIDEO_ID)",
                        help="""Supported formats:
                        - Full URL: https://youtube.com/watch?v=VIDEO_ID
                        - Short URL: https://youtu.be/VIDEO_ID
                        - Video ID: VIDEO_ID
                        - Embed URL: https://youtube.com/embed/VIDEO_ID
                        - Shorts URL: https://youtube.com/shorts/VIDEO_ID""")
    
    task = st.selectbox("Select Task", ["Transcribe", "Translate"], index=0)
    
    if task == "Transcribe":
        if st.button("Transcribe"):
            if not link:
                st.error("Please enter a YouTube link or video ID")
                return
                
            # Validate URL before proceeding
            proper_url = validate_youtube_url(link)
            if not proper_url:
                st.error("""Invalid YouTube URL. Please enter a valid YouTube link in one of these formats:
                - Full URL: https://youtube.com/watch?v=VIDEO_ID
                - Short URL: https://youtu.be/VIDEO_ID
                - Video ID: VIDEO_ID
                - Embed URL: https://youtube.com/embed/VIDEO_ID
                - Shorts URL: https://youtube.com/shorts/VIDEO_ID""")
                return
                
            with st.spinner("Transcribing the video..."):
                results = inference(proper_url, loaded_model, task)
                if not results:
                    return
                    
            video = download_video(proper_url)
            if not video:
                return
                
            lang = results[3]
            detected_language = get_language_code(lang)
                
            col3, col4 = st.columns(2)
            with col3:
                st.video(video)
            
            # Split result["text"]  on !,? and . , but save the punctuation
            sentences = re.split("([!?.])", results[0])
            # Join the punctuation back to the sentences
            sentences = ["".join(i) for i in zip(sentences[0::2], sentences[1::2])]
            text = "\n\n".join(sentences)
            with open("transcript.txt", "w+", encoding='utf8') as f:
                f.writelines(text)
                f.close()
            with open(os.path.join(os.getcwd(), "transcript.txt"), "rb") as f:
                datatxt = f.read()
                
            with open("transcript.vtt", "w+",encoding='utf8') as f:
                f.writelines(results[1])
                f.close()
            with open(os.path.join(os.getcwd(), "transcript.vtt"), "rb") as f:
                datavtt = f.read()
                
            with open("transcript.srt", "w+",encoding='utf8') as f:
                f.writelines(results[2])
                f.close()
            with open(os.path.join(os.getcwd(), "transcript.srt"), "rb") as f:
                datasrt = f.read()
  
            with col4:
                with st.spinner("Generating Subtitled Video"):
                    video_with_subs = generate_subtitled_video(video, f"{save_dir}/audio.mp3", "transcript.srt")
                st.video(video_with_subs)
                st.balloons()

            zipObj = ZipFile("YouTube_transcripts_and_video.zip", "w")
            zipObj.write("transcript.txt")
            zipObj.write("transcript.vtt")
            zipObj.write("transcript.srt")
            zipObj.write("youtube_sub.mp4")
            zipObj.close()
            ZipfileDotZip = "YouTube_transcripts_and_video.zip"
            with open(ZipfileDotZip, "rb") as f:
                datazip = f.read()
                b64 = base64.b64encode(datazip).decode()
                href = f"<a href=\"data:file/zip;base64,{b64}\" download='{ZipfileDotZip}'>\
        Download Transcripts and Video\
    </a>"
            st.markdown(href, unsafe_allow_html=True)
            
    elif task == "Translate":
        if st.button("Translate to English"):
            with st.spinner("Translating to English..."):
                results = inference(link, loaded_model, task)
            video = download_video(link)
            lang = results[3]
            detected_language = get_language_code(lang)
                
            col3, col4 = st.columns(2)
            with col3:
                st.video(video)
                
            # Split result["text"]  on !,? and . , but save the punctuation
            sentences = re.split("([!?.])", results[0])
            # Join the punctuation back to the sentences
            sentences = ["".join(i) for i in zip(sentences[0::2], sentences[1::2])]
            text = "\n\n".join(sentences)
            with open("transcript.txt", "w+", encoding='utf8') as f:
                f.writelines(text)
                f.close()
            with open(os.path.join(os.getcwd(), "transcript.txt"), "rb") as f:
                datatxt = f.read()
                
            with open("transcript.vtt", "w+",encoding='utf8') as f:
                f.writelines(results[1])
                f.close()
            with open(os.path.join(os.getcwd(), "transcript.vtt"), "rb") as f:
                datavtt = f.read()
                
            with open("transcript.srt", "w+",encoding='utf8') as f:
                f.writelines(results[2])
                f.close()
            with open(os.path.join(os.getcwd(), "transcript.srt"), "rb") as f:
                datasrt = f.read()
                       
            with col4:
                with st.spinner("Generating Subtitled Video"):
                    video_with_subs = generate_subtitled_video(video, f"{save_dir}/audio.mp3", "transcript.srt")
                st.video(video_with_subs)
                st.balloons()
            
            zipObj = ZipFile("YouTube_transcripts_and_video.zip", "w")
            zipObj.write("transcript.txt")
            zipObj.write("transcript.vtt")
            zipObj.write("transcript.srt")
            zipObj.write("youtube_sub.mp4")
            zipObj.close()
            ZipfileDotZip = "YouTube_transcripts_and_video.zip"
            with open(ZipfileDotZip, "rb") as f:
                datazip = f.read()
                b64 = base64.b64encode(datazip).decode()
                href = f"<a href=\"data:file/zip;base64,{b64}\" download='{ZipfileDotZip}'>\
        Download Transcripts and Video\
    </a>"
            st.markdown(href, unsafe_allow_html=True)
            
    else:
        st.info("Please select a task.")


if __name__ == "__main__":
    main()
    