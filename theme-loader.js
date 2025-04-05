// 主题加载器 - 在前台页面加载时应用主题设置
document.addEventListener('DOMContentLoaded', function() {
    // 从localStorage加载主题设置
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme) {
        try {
            const theme = JSON.parse(savedTheme);
            applyTheme(theme);
        } catch (e) {
            console.error('主题加载失败:', e);
        }
    }
    
    // 应用主题函数
    function applyTheme(theme) {
        // 创建或获取主题样式元素
        let themeStyle = document.getElementById('dynamic-theme');
        if (!themeStyle) {
            themeStyle = document.createElement('style');
            themeStyle.id = 'dynamic-theme';
            document.head.appendChild(themeStyle);
        }
        
        // 生成CSS变量
        let css = `:root {
            --primary-color: ${theme.primaryColor};
            --primary-dark: ${adjustColor(theme.primaryColor, -20)};
            --secondary-color: ${theme.secondaryColor};
            --accent-color: ${theme.accentColor};
        }`;
        
        // 添加壁纸样式
        if (theme.wallpaperType === 'gradient') {
            let gradientValue;
            switch (theme.wallpaperValue) {
                case 'sunset':
                    gradientValue = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)';
                    break;
                case 'ocean':
                    gradientValue = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
                    break;
                case 'forest':
                    gradientValue = 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)';
                    break;
                default: // default gradient
                    gradientValue = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            }
            css += `body { background: ${gradientValue}; }`;
        } else if (theme.wallpaperType === 'solid') {
            css += `body { background: ${theme.wallpaperValue}; }`;
        } else if (theme.wallpaperType === 'custom' && theme.customWallpaper) {
            css += `body { 
                background-image: url(${theme.customWallpaper});
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
            }`;
        }
        
        // 应用样式
        themeStyle.textContent = css;
    }
    
    // 辅助函数：调整颜色亮度
    function adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => {
            const num = Math.min(255, Math.max(0, parseInt(color, 16) + amount));
            return num.toString(16).padStart(2, '0');
        });
    }
});