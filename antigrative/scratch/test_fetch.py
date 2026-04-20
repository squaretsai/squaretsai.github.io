from youtube_transcript_api import YouTubeTranscriptApi

video_id = 'xsnwqjeZsbk'
try:
    print("Trying list_transcripts...")
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    print("Success with list_transcripts")
except Exception as e:
    print(f"Failed with list_transcripts: {e}")

try:
    print("Trying get_transcript...")
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    print("Success with get_transcript")
except Exception as e:
    print(f"Failed with get_transcript: {e}")
