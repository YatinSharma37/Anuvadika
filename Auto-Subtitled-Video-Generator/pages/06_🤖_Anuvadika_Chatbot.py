import streamlit as st
import google.generativeai as genai
from streamlit_lottie import st_lottie
import requests
import re

# Configure the Gemini API (Directly with key as requested)
GOOGLE_API_KEY = "AIzaSyCVkhGQyCk3JgZoQUKMNNmia0elCubwnkU"
genai.configure(api_key=GOOGLE_API_KEY)

# Set up the page configuration
st.set_page_config(page_title="Anuvadika AI Chatbot", page_icon="🤖", layout="wide")

# Page header
st.markdown("""
    <div style='text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 10px;'>
        <h1 style='margin: 0;'>Anuvadika AI Chatbot</h1>
        <p style='margin: 10px 0 0 0;'>Ask questions about your subtitles and get AI-powered answers</p>
    </div>
""", unsafe_allow_html=True)

# Load Lottie animation
@st.cache_data
def load_lottieurl(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

# Clean .srt or .vtt subtitle files
def clean_subtitles(text):
    text = re.sub(r"\d+\n", "", text)  # remove line numbers
    text = re.sub(r"\d{2}:\d{2}:\d{2}[.,]\d{3} --> .*", "", text)  # remove timestamps
    return text.strip()

# Layout: animation + instructions
col1, col2 = st.columns([1, 2])
with col1:
    lottie = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_xyadoh9h.json")
    if lottie:
        st_lottie(lottie, height=300)
    else:
        st.image("https://img.icons8.com/color/96/000000/chat-bot.png", width=200)

with col2:
    st.markdown("""
        ### 📝 Instructions
        1. Upload your subtitle file (.txt, .srt, or .vtt)
        2. Ask questions about the content
        3. Get AI-powered answers based on the subtitles
    """)

# Session state initialization
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

if "subtitle_content" not in st.session_state:
    st.session_state.subtitle_content = None

# File upload
uploaded_file = st.file_uploader("Upload Subtitle File", type=["txt", "srt", "vtt"])
if uploaded_file:
    raw_content = uploaded_file.read().decode("utf-8")
    cleaned = clean_subtitles(raw_content)
    st.session_state.subtitle_content = cleaned[:6000]  # Trim to avoid large prompt size
    st.success("Subtitle file uploaded and cleaned successfully!")

# Reset chat button
if st.button("🔄 Clear Chat"):
    st.session_state.chat_history = []

# Chat interface
st.markdown("### 💬 Chat with Anuvadika")
for message in st.session_state.chat_history:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input and Gemini response
if prompt := st.chat_input("Ask a question about your subtitles..."):
    if not st.session_state.subtitle_content:
        st.error("Please upload a subtitle file first!")
    else:
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        try:
            context = f"""
            You are an AI that answers questions about subtitles.
            Subtitle content is provided below. Use it to answer the question.

            Subtitles:
            {st.session_state.subtitle_content}

            Question: {prompt}
            """

            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(
                context,
                safety_settings=[
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                ],
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 2048,
                }
            )

            ai_response = response.text.strip()
            st.session_state.chat_history.append({"role": "assistant", "content": ai_response})

            with st.chat_message("assistant"):
                st.markdown(ai_response)

        except Exception as e:
            st.error(f"An error occurred: {str(e)}")

# Footer
st.markdown("---")
st.markdown("""
    <div style='text-align: center; padding: 20px;'>
        <p>Made with ❤️ by Yatin, Yashaswi, Vikas Gautum, Vikas</p>
    </div>
""", unsafe_allow_html=True)
