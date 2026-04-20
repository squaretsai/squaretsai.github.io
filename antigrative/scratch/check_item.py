from youtube_transcript_api import YouTubeTranscriptApi

video_id = 'xsnwqjeZsbk'
api = YouTubeTranscriptApi()
transcript_list = api.list(video_id)
# Get the first available transcript
transcript = next(iter(transcript_list))
content = transcript.fetch()
print(f"Content type: {type(content)}")
if len(content) > 0:
    first_item = content[0]
    print(f"Item type: {type(first_item)}")
    print(f"Item dir: {dir(first_item)}")
    try:
        print(f"Item text (attr): {first_item.text}")
    except Exception as e:
        print(f"Item has no .text attr: {e}")
    try:
        print(f"Item text (sub): {first_item['text']}")
    except Exception as e:
        print(f"Item is not subscriptable: {e}")
