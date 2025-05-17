import streamlit as st
import os
import pandas as pd
import plotly.express as px
from datetime import datetime
import humanize
import pathlib
import json

st.set_page_config(page_title="Subtitle Storage", page_icon="💾", layout="wide")

# Set up the page header
st.markdown("""
    <div style='text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 10px;'>
        <h1 style='margin: 0;'>Subtitle File Management</h1>
        <p style='margin: 10px 0 0 0;'>View and manage your subtitle files</p>
    </div>
    """, unsafe_allow_html=True)

def get_subtitle_files(path):
    """Get information about subtitle files"""
    subtitle_extensions = {'.srt', '.vtt'}
    subtitle_info = []
    
    for root, dirs, files in os.walk(path):
        # Skip .git directory
        if '.git' in root:
            continue
            
        for file in files:
            if os.path.splitext(file)[1].lower() in subtitle_extensions:
                file_path = os.path.join(root, file)
                try:
                    stats = os.stat(file_path)
                    # Read the first few lines to get language info
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read(1000)  # Read first 1000 characters
                        # Try to detect language from content
                        language = "Unknown"
                        if "WEBVTT" in content:
                            language = "VTT Format"
                        elif any(str(i) in content for i in range(1, 10)):
                            language = "SRT Format"
                        
                    subtitle_info.append({
                        'name': file,
                        'path': os.path.relpath(file_path, path),
                        'size': stats.st_size,
                        'size_human': humanize.naturalsize(stats.st_size),
                        'type': os.path.splitext(file)[1].lower(),
                        'modified': datetime.fromtimestamp(stats.st_mtime),
                        'created': datetime.fromtimestamp(stats.st_ctime),
                        'language': language,
                        'content': content
                    })
                except Exception as e:
                    st.warning(f"Could not access file {file_path}: {str(e)}")
    
    return subtitle_info

def analyze_subtitles():
    """Analyze subtitle files and return metrics"""
    project_root = pathlib.Path(__file__).parent.parent
    subtitle_info = get_subtitle_files(project_root)
    
    # Convert to DataFrame
    df = pd.DataFrame(subtitle_info)
    
    if df.empty:
        return None
    
    # Calculate total size
    total_size = df['size'].sum()
    
    # Group by file type
    type_sizes = df.groupby('type')['size'].sum().reset_index()
    type_sizes['size_human'] = type_sizes['size'].apply(humanize.naturalsize)
    
    # Get largest files
    largest_files = df.nlargest(10, 'size')
    
    # Get most recent files
    recent_files = df.nlargest(10, 'modified')
    
    return {
        'total_size': total_size,
        'total_size_human': humanize.naturalsize(total_size),
        'file_count': len(df),
        'type_sizes': type_sizes,
        'largest_files': largest_files,
        'recent_files': recent_files,
        'all_files': df
    }

# Main content
try:
    storage_data = analyze_subtitles()
    
    if storage_data is None:
        st.info("No subtitle files found in the project. Upload some subtitle files to see them here.")
    else:
        # Create three columns for key metrics
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric(
                label="Total Subtitle Files Size",
                value=storage_data['total_size_human']
            )
        
        with col2:
            st.metric(
                label="Total Subtitle Files",
                value=f"{storage_data['file_count']:,}"
            )
        
        with col3:
            st.metric(
                label="File Types",
                value=f"{len(storage_data['type_sizes']):,}"
            )
        
        # Create two columns for charts
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Storage by File Type")
            fig = px.pie(
                storage_data['type_sizes'],
                values='size',
                names='type',
                title='Subtitle Files Distribution by Type'
            )
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            st.subheader("Recent Subtitle Files")
            recent_files_df = storage_data['recent_files'][['name', 'size_human', 'type', 'modified', 'language']]
            st.dataframe(
                recent_files_df,
                column_config={
                    "name": st.column_config.TextColumn("File Name"),
                    "size_human": st.column_config.TextColumn("Size"),
                    "type": st.column_config.TextColumn("Type"),
                    "modified": st.column_config.DatetimeColumn("Last Modified"),
                    "language": st.column_config.TextColumn("Format")
                },
                hide_index=True
            )
        
        # File Viewer Section
        st.subheader("Subtitle File Viewer")
        
        # File selection
        selected_file = st.selectbox(
            "Select a subtitle file to view",
            options=storage_data['all_files']['path'].tolist(),
            format_func=lambda x: os.path.basename(x)
        )
        
        if selected_file:
            file_data = storage_data['all_files'][storage_data['all_files']['path'] == selected_file].iloc[0]
            
            # Display file information
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("File Size", file_data['size_human'])
            with col2:
                st.metric("File Type", file_data['type'])
            with col3:
                st.metric("Format", file_data['language'])
            
            # Display file content
            st.subheader("File Content")
            st.text_area(
                "Content",
                value=file_data['content'],
                height=300
            )
            
            # Download button
            with open(os.path.join(pathlib.Path(__file__).parent.parent, selected_file), 'rb') as f:
                st.download_button(
                    "Download File",
                    f.read(),
                    file_name=os.path.basename(selected_file),
                    mime="text/plain"
                )
        
        # Search Section
        st.subheader("Search Subtitle Files")
        search_term = st.text_input("Search files by name or content")
        if search_term:
            filtered_files = storage_data['all_files'][
                storage_data['all_files']['path'].str.contains(search_term, case=False) |
                storage_data['all_files']['content'].str.contains(search_term, case=False)
            ]
            st.dataframe(
                filtered_files[['name', 'size_human', 'type', 'modified', 'language']],
                column_config={
                    "name": st.column_config.TextColumn("File Name"),
                    "size_human": st.column_config.TextColumn("Size"),
                    "type": st.column_config.TextColumn("Type"),
                    "modified": st.column_config.DatetimeColumn("Last Modified"),
                    "language": st.column_config.TextColumn("Format")
                },
                hide_index=True
            )

except Exception as e:
    st.error(f"Error analyzing subtitle files: {str(e)}")

# Add a footer
st.markdown("---")
st.markdown("""
    <div style='text-align: center; padding: 20px;'>
        <p>Made with ❤️ by Yatin, Yashaswi, Vikas Gautum, Vikas</p>
    </div>
    """, unsafe_allow_html=True)