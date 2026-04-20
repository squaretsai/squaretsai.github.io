from youtube_transcript_api import YouTubeTranscriptApi

video_id = 'xsnwqjeZsbk'
try:
    print("Trying YouTubeTranscriptApi.list(video_id)...")
    res = YouTubeTranscriptApi.list(video_id)
    print(f"Success! Type: {type(res)}")
except Exception as e:
    print(f"Failed: {e}")
