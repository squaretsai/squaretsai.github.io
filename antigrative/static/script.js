document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetch-btn');
    const urlInput = document.getElementById('youtube-url');
    const statusContainer = document.getElementById('status-container');
    const resultContainer = document.getElementById('result-container');
    const outputArea = document.getElementById('translated-output');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitle = document.getElementById('video-title');
    const videoLang = document.getElementById('video-lang');
    const downloadBtn = document.getElementById('download-txt');
    const copyBtn = document.getElementById('copy-btn');

    fetchBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert('請輸入有效的 YouTube 網址！');
            return;
        }

        // 重置 UI
        statusContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        fetchBtn.disabled = true;

        try {
            const response = await fetch('/get_transcript', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            });

            const data = await response.json();

            if (response.ok) {
                // 成功獲取資料
                outputArea.value = data.translated_text;
                videoThumbnail.src = `https://img.youtube.com/vi/${data.video_id}/mqdefault.jpg`;
                videoTitle.textContent = '字幕已翻譯完成';
                videoLang.textContent = `來源語言: ${data.original_language}`;
                
                statusContainer.classList.add('hidden');
                resultContainer.classList.remove('hidden');
            } else {
                throw new Error(data.error || '發生未知錯誤');
            }
        } catch (error) {
            alert('錯誤: ' + error.message);
            statusContainer.classList.add('hidden');
        } finally {
            fetchBtn.disabled = false;
        }
    });

    // 下載功能
    downloadBtn.addEventListener('click', () => {
        const text = outputArea.value;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'translated_subtitle.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 複製功能
    copyBtn.addEventListener('click', () => {
        outputArea.select();
        document.execCommand('copy');
        copyBtn.textContent = '已複製！';
        setTimeout(() => {
            copyBtn.textContent = '複製全文';
        }, 2000);
    });
});
