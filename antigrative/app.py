import re
from flask import Flask, render_template, request, jsonify, send_file
from youtube_transcript_api import YouTubeTranscriptApi
from deep_translator import GoogleTranslator
import os

app = Flask(__name__)

def extract_video_id(url):
    """提取 YouTube 影片 ID"""
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:be\/)([0-9A-Za-z_-]{11}).*'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_transcript', methods=['POST'])
def get_transcript():
    data = request.json
    video_url = data.get('url')
    
    if not video_url:
        return jsonify({'error': '請提供 YouTube 網址'}), 400
    
    video_id = extract_video_id(video_url)
    if not video_id:
        return jsonify({'error': '無效的 YouTube 網址'}), 400
    
    try:
        # 實例化 API (此版本非靜態方法)
        api = YouTubeTranscriptApi()
        
        # 獲取字幕清單
        transcript_list = api.list(video_id)
        
        # 優先嘗試尋找手動上傳的字幕，否則使用自動產生的
        try:
            transcript = transcript_list.find_transcript(['zh-Hant', 'zh-Hans', 'en', 'ja', 'ko'])
        except:
            # 如果找不到指定語言，就抓第一個可用的
            transcript = next(iter(transcript_list))
            
        original_content = transcript.fetch()
        
        # 合併文字 (此版本使用 .text 屬性)
        full_text = " ".join([item.text for item in original_content])
        
        # 暫時跳過自動翻譯，直接回傳原始文字
        return jsonify({
            'video_id': video_id,
            'original_language': transcript.language,
            'original_text': full_text,
            'translated_text': full_text  # 目前直接顯示原始文字
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # 確保 static 與 templates 資料夾存在
    os.makedirs('static', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    app.run(debug=True, port=5000)
