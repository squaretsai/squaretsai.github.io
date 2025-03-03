document.addEventListener('DOMContentLoaded', () => {
    // 從 monsters.json 載入數據
    fetch('monsters.json')
        .then(response => response.json())
        .then(monsters => {
            const grid = document.getElementById('monster-grid');
            monsters.forEach(monster => {
                // 創建按鈕容器
                const button = document.createElement('div');
                button.className = 'monster-button';
                button.onclick = () => window.open(monster.url, '_blank');

                // 創建圖片元素（使用本地路徑）
                const img = document.createElement('img');
                img.src = monster.image;  // 直接使用 monster_images 中的路徑，如 "monster_images/EM0001_00_0.webp"
                img.alt = monster.name;

                // 創建名稱文字
                const name = document.createElement('div');
                name.className = 'monster-name';
                name.textContent = monster.name;

                // 將圖片和名稱添加到按鈕
                button.appendChild(img);
                button.appendChild(name);

                // 添加到網格
                grid.appendChild(button);
            });
        })
        .catch(error => console.error('Error loading monsters:', error));
});