import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
import os
import psutil
import GPUtil
import time
import random

st.set_page_config(page_title="Dashboard", page_icon="📊", layout="wide")

# Set up the page header
st.markdown("""
    <div style='text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 10px;'>
        <h1 style='margin: 0;'>Auto Subtitled Video Generator Dashboard</h1>
        <p style='margin: 10px 0 0 0;'>Real-time overview of your transcription and translation activities</p>
    </div>
    """, unsafe_allow_html=True)

def generate_sample_data():
    """Generate sample data for demonstration purposes"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    dates = pd.date_range(start=start_date, end=end_date, freq='D')
    
    sample_data = {
        'transcriptions': [],
        'translations': [],
        'video_lengths': [],
        'success_rates': [],
        'timestamps': [],
        'gpu_usage': [],
        'cpu_usage': [],
        'memory_usage': [],
        'costs': []
    }
    
    for date in dates:
        # Generate 1-5 activities per day
        num_activities = random.randint(1, 5)
        for _ in range(num_activities):
            # Randomly choose between transcription and translation
            is_transcription = random.choice([True, False])
            sample_data['transcriptions'].append(1 if is_transcription else 0)
            sample_data['translations'].append(0 if is_transcription else 1)
            
            # Generate random video length (1-60 minutes)
            video_length = random.uniform(1, 60)
            sample_data['video_lengths'].append(video_length)
            
            # Generate random success rate (0.7-1.0)
            success_rate = random.uniform(0.7, 1.0)
            sample_data['success_rates'].append(success_rate)
            
            # Generate timestamp
            timestamp = date + timedelta(hours=random.randint(0, 23),
                                      minutes=random.randint(0, 59))
            sample_data['timestamps'].append(timestamp.strftime('%Y-%m-%d %H:%M:%S'))
            
            # Generate system metrics
            sample_data['gpu_usage'].append(random.uniform(20, 80))
            sample_data['cpu_usage'].append(random.uniform(30, 70))
            sample_data['memory_usage'].append(random.uniform(40, 90))
            
            # Calculate cost
            base_cost = video_length * 60 * (0.0001 if is_transcription else 0.0002)
            gpu_cost = video_length * 60 * 0.0005
            sample_data['costs'].append(base_cost + gpu_cost)
    
    return sample_data

# Data storage functions
def load_data():
    data_file = 'data/activity_data.json'
    if not os.path.exists('data'):
        os.makedirs('data')
    if not os.path.exists(data_file):
        # Generate sample data if no real data exists
        sample_data = generate_sample_data()
        with open(data_file, 'w') as f:
            json.dump(sample_data, f)
        return sample_data
    with open(data_file, 'r') as f:
        return json.load(f)

def save_data(data):
    data_file = 'data/activity_data.json'
    with open(data_file, 'w') as f:
        json.dump(data, f)

def get_system_metrics():
    """Get real-time system metrics"""
    try:
        # Get GPU metrics
        gpus = GPUtil.getGPUs()
        if gpus:
            gpu = gpus[0]  # Get first GPU
            gpu_usage = gpu.load * 100
            gpu_memory_used = gpu.memoryUsed
            gpu_memory_total = gpu.memoryTotal
            gpu_memory_percent = (gpu_memory_used / gpu_memory_total) * 100
            gpu_temperature = gpu.temperature
        else:
            gpu_usage = 0
            gpu_memory_used = 0
            gpu_memory_total = 0
            gpu_memory_percent = 0
            gpu_temperature = 0
    except Exception as e:
        st.warning(f"Could not get GPU metrics: {str(e)}")
        gpu_usage = 0
        gpu_memory_used = 0
        gpu_memory_total = 0
        gpu_memory_percent = 0
        gpu_temperature = 0
    
    # Get CPU metrics
    cpu_usage = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count()
    cpu_freq = psutil.cpu_freq()
    if cpu_freq:
        cpu_freq_current = cpu_freq.current
        cpu_freq_max = cpu_freq.max
    else:
        cpu_freq_current = 0
        cpu_freq_max = 0
    
    # Get memory metrics
    memory = psutil.virtual_memory()
    memory_used = memory.used / (1024**3)  # Convert to GB
    memory_total = memory.total / (1024**3)  # Convert to GB
    memory_percent = memory.percent
    
    # Get disk metrics
    disk = psutil.disk_usage('/')
    disk_used = disk.used / (1024**3)  # Convert to GB
    disk_total = disk.total / (1024**3)  # Convert to GB
    disk_percent = disk.percent
    
    return {
        'gpu': {
            'usage': gpu_usage,
            'memory_used': gpu_memory_used,
            'memory_total': gpu_memory_total,
            'memory_percent': gpu_memory_percent,
            'temperature': gpu_temperature
        },
        'cpu': {
            'usage': cpu_usage,
            'count': cpu_count,
            'freq_current': cpu_freq_current,
            'freq_max': cpu_freq_max
        },
        'memory': {
            'used': memory_used,
            'total': memory_total,
            'percent': memory_percent
        },
        'disk': {
            'used': disk_used,
            'total': disk_total,
            'percent': disk_percent
        }
    }

def calculate_cost(video_length, task_type):
    # Cost calculation (example rates)
    transcription_rate = 0.0001  # per second
    translation_rate = 0.0002    # per second
    gpu_rate = 0.0005           # per second
    
    base_cost = video_length * 60 * (transcription_rate if task_type == 'transcription' else translation_rate)
    gpu_cost = video_length * 60 * gpu_rate
    
    return base_cost + gpu_cost

def add_activity(activity_type, video_length=None, success_rate=None):
    data = load_data()
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Get system metrics
    metrics = get_system_metrics()
    
    # Calculate cost
    cost = calculate_cost(video_length if video_length else 0, activity_type)
    
    if activity_type == 'transcription':
        data['transcriptions'].append(1)
        data['translations'].append(0)
    else:  # translation
        data['transcriptions'].append(0)
        data['translations'].append(1)
    
    data['video_lengths'].append(video_length if video_length else 0)
    data['success_rates'].append(success_rate if success_rate else 1.0)
    data['timestamps'].append(timestamp)
    data['gpu_usage'].append(metrics['gpu']['usage'])
    data['cpu_usage'].append(metrics['cpu']['usage'])
    data['memory_usage'].append(metrics['memory']['percent'])
    data['costs'].append(cost)
    
    # Keep only last 30 days of data
    cutoff_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    valid_indices = [i for i, ts in enumerate(data['timestamps']) 
                    if datetime.strptime(ts, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d') >= cutoff_date]
    
    for key in data:
        data[key] = [data[key][i] for i in valid_indices]
    
    save_data(data)

# Load real data
data = load_data()
df = pd.DataFrame({
    'date': [datetime.strptime(ts, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d') for ts in data['timestamps']],
    'transcriptions': data['transcriptions'],
    'translations': data['translations'],
    'video_length': data['video_lengths'],
    'success_rate': data['success_rates'],
    'gpu_usage': data['gpu_usage'],
    'cpu_usage': data['cpu_usage'],
    'memory_usage': data['memory_usage'],
    'cost': data['costs']
})

# Create metrics row
col1, col2, col3, col4 = st.columns(4)

with col1:
    total_transcriptions = sum(data['transcriptions'])
    st.metric(
        label="Total Transcriptions",
        value=f"{total_transcriptions:,}",
        delta=f"+{sum(data['transcriptions'][-7:])}" if len(data['transcriptions']) >= 7 else "+0"
    )

with col2:
    total_translations = sum(data['translations'])
    st.metric(
        label="Total Translations",
        value=f"{total_translations:,}",
        delta=f"+{sum(data['translations'][-7:])}" if len(data['translations']) >= 7 else "+0"
    )

with col3:
    avg_success = sum(data['success_rates']) / len(data['success_rates']) if data['success_rates'] else 0
    st.metric(
        label="Average Success Rate",
        value=f"{avg_success:.1%}",
        delta=f"+{(sum(data['success_rates'][-7:])/7 - sum(data['success_rates'][-14:-7])/7):.1%}" 
        if len(data['success_rates']) >= 14 else "+0%"
    )

with col4:
    total_cost = sum(data['costs'])
    st.metric(
        label="Total Cost",
        value=f"${total_cost:.2f}",
        delta=f"+${sum(data['costs'][-7:]):.2f}" if len(data['costs']) >= 7 else "+$0.00"
    )

# System Resources Section
st.markdown("### 💻 System Resources")
col1, col2, col3, col4 = st.columns(4)

metrics = get_system_metrics()

with col1:
    st.metric(
        label="GPU Usage",
        value=f"{metrics['gpu']['usage']:.1f}%",
        delta=f"{metrics['gpu']['usage'] - (data['gpu_usage'][-1] if data['gpu_usage'] else 0):.1f}%"
    )
    st.caption(f"Memory: {metrics['gpu']['memory_used']:.0f}MB / {metrics['gpu']['memory_total']:.0f}MB")
    st.caption(f"Temperature: {metrics['gpu']['temperature']}°C")

with col2:
    st.metric(
        label="CPU Usage",
        value=f"{metrics['cpu']['usage']:.1f}%",
        delta=f"{metrics['cpu']['usage'] - (data['cpu_usage'][-1] if data['cpu_usage'] else 0):.1f}%"
    )
    st.caption(f"Cores: {metrics['cpu']['count']}")
    st.caption(f"Frequency: {metrics['cpu']['freq_current']:.0f}MHz")

with col3:
    st.metric(
        label="Memory Usage",
        value=f"{metrics['memory']['percent']:.1f}%",
        delta=f"{metrics['memory']['percent'] - (data['memory_usage'][-1] if data['memory_usage'] else 0):.1f}%"
    )
    st.caption(f"Used: {metrics['memory']['used']:.1f}GB / {metrics['memory']['total']:.1f}GB")

with col4:
    st.metric(
        label="Disk Usage",
        value=f"{metrics['disk']['percent']:.1f}%",
        delta=None
    )
    st.caption(f"Used: {metrics['disk']['used']:.1f}GB / {metrics['disk']['total']:.1f}GB")

# Create charts section
st.markdown("### 📈 Activity Charts")

# First row of charts
col1, col2 = st.columns(2)

with col1:
    st.subheader("Daily Activity")
    if not df.empty:
        daily_data = df.groupby('date').agg({
            'transcriptions': 'sum',
            'translations': 'sum'
        }).reset_index()
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=daily_data['date'],
            y=daily_data['transcriptions'],
            name='Transcriptions',
            line=dict(color='#4CAF50')
        ))
        fig.add_trace(go.Scatter(
            x=daily_data['date'],
            y=daily_data['translations'],
            name='Translations',
            line=dict(color='#2196F3')
        ))
        fig.update_layout(
            xaxis_title="Date",
            yaxis_title="Count",
            hovermode='x unified',
            showlegend=True
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No activity data available yet.")

with col2:
    st.subheader("Video Length Distribution")
    if not df.empty and any(df['video_length'] > 0):
        fig = px.histogram(
            df[df['video_length'] > 0],
            x='video_length',
            nbins=20,
            color_discrete_sequence=['#4CAF50']
        )
        fig.update_layout(
            xaxis_title="Video Length (minutes)",
            yaxis_title="Count",
            showlegend=False
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No video length data available yet.")

# Second row of charts
col1, col2 = st.columns(2)

with col1:
    st.subheader("Resource Usage Over Time")
    if not df.empty:
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df['date'],
            y=df['gpu_usage'],
            name='GPU Usage',
            line=dict(color='#FF5722')
        ))
        fig.add_trace(go.Scatter(
            x=df['date'],
            y=df['cpu_usage'],
            name='CPU Usage',
            line=dict(color='#2196F3')
        ))
        fig.add_trace(go.Scatter(
            x=df['date'],
            y=df['memory_usage'],
            name='Memory Usage',
            line=dict(color='#4CAF50')
        ))
        fig.update_layout(
            xaxis_title="Date",
            yaxis_title="Usage (%)",
            hovermode='x unified',
            showlegend=True
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No resource usage data available yet.")

with col2:
    st.subheader("Cost Analysis")
    if not df.empty:
        daily_costs = df.groupby('date')['cost'].sum().reset_index()
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=daily_costs['date'],
            y=daily_costs['cost'],
            name='Daily Cost',
            marker_color='#9C27B0'
        ))
        fig.update_layout(
            xaxis_title="Date",
            yaxis_title="Cost ($)",
            showlegend=False
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No cost data available yet.")

# Third row of charts
col1, col2 = st.columns(2)

with col1:
    st.subheader("Success Rate Trend")
    if not df.empty:
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df['date'],
            y=df['success_rate'] * 100,
            name='Success Rate',
            line=dict(color='#4CAF50')
        ))
        fig.update_layout(
            xaxis_title="Date",
            yaxis_title="Success Rate (%)",
            showlegend=False
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No success rate data available yet.")

with col2:
    st.subheader("Task Distribution")
    if not df.empty:
        total_transcriptions = df['transcriptions'].sum()
        total_translations = df['translations'].sum()
        fig = go.Figure(data=[go.Pie(
            labels=['Transcriptions', 'Translations'],
            values=[total_transcriptions, total_translations],
            hole=.3,
            marker_colors=['#4CAF50', '#2196F3']
        )])
        fig.update_layout(showlegend=True)
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No task distribution data available yet.")

# Recent Activity Section
st.markdown("### 📊 Recent Activity")
if data['timestamps']:
    recent_activity = pd.DataFrame({
        'Timestamp': data['timestamps'][-5:],
        'Action': ['Transcription' if t else 'Translation' for t in data['transcriptions'][-5:]],
        'Duration': [f"{l:.1f} min" if l > 0 else "N/A" for l in data['video_lengths'][-5:]],
        'Success Rate': [f"{r:.1%}" for r in data['success_rates'][-5:]],
        'Cost': [f"${c:.2f}" for c in data['costs'][-5:]]
    })
    
    st.dataframe(
        recent_activity,
        column_config={
            "Timestamp": st.column_config.DatetimeColumn("Timestamp"),
            "Action": st.column_config.TextColumn("Action"),
            "Duration": st.column_config.TextColumn("Duration"),
            "Success Rate": st.column_config.TextColumn("Success Rate"),
            "Cost": st.column_config.TextColumn("Cost")
        },
        hide_index=True,
    )
else:
    st.info("No recent activity data available yet.")

# Add a footer
st.markdown("---")
st.markdown("""
    <div style='text-align: center; padding: 20px;'>
        <p>Made with ❤️ by Yatin, Yashaswi, Vikas Gautum, Vikas</p>
    </div>
    """, unsafe_allow_html=True) 