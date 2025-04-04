document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchEngineButtons = document.querySelectorAll('.search-engine');
    const engineLogo = document.getElementById('engine-logo');
    const engineDescription = document.getElementById('engine-description');
    
    // 搜索引擎配置
    const searchEngines = {
        google: {
            name: 'Google',
            url: 'https://www.google.com/search',
            param: 'q',
            logo: './Logo/google.svg',
            description: 'Google 是全球最大的搜索引擎，提供网页、图片、视频等多种搜索服务。'
        },
        baidu: {
            name: '百度',
            url: 'https://www.baidu.com/s',
            param: 'wd',
            logo: './Logo/baidu.svg',
            description: '百度是中国最大的搜索引擎，提供网页、贴吧、知道等多种服务。'
        },
        bing: {
            name: 'Bing',
            url: 'https://www.bing.com/search',
            param: 'q',
            logo: './Logo/Bing.png',
            description: 'Bing 是微软推出的搜索引擎，提供网页、图片、视频等多种搜索服务。'
        },
        github: {
            name: 'GitHub',
            url: 'https://github.com/search',
            param: 'q',
            logo: './Logo/github.svg',
            description: 'GitHub 是全球最大的代码托管平台，可以搜索开源项目和代码。'
        },
        bilibili: {
            name: '哔哩哔哩',
            url: 'https://search.bilibili.com/all',
            param: 'keyword',
            logo: './Logo/bilibili.svg',
            description: '哔哩哔哩是中国知名的视频弹幕网站，提供动画、游戏、音乐等内容。'
        },
        yandex: {
            name: 'Yandex',
            url: 'https://yandex.com/search/',
            param: 'text',
            logo: './Logo/yandex.svg',
            description: 'Yandex 是俄罗斯最大的搜索引擎，提供网页、图片、视频等多种搜索服务。'
        }
    };
    
    // 设置当前搜索引擎
    let currentEngine = 'google';
    
    // 切换搜索引擎
    searchEngineButtons.forEach(button => {
        button.addEventListener('click', function() {
            const engine = this.getAttribute('data-engine');
            
            // 更新按钮状态
            searchEngineButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前引擎
            currentEngine = engine;
            updateSearchEngine(engine);
        });
    });
    
    // 更新搜索引擎表单和描述
    function updateSearchEngine(engine) {
        const engineData = searchEngines[engine];
        
        // 更新表单
        searchForm.action = engineData.url;
        searchInput.name = engineData.param;
        searchInput.placeholder = `在 ${engineData.name} 中搜索...`;
        
        // 更新logo和描述
        engineLogo.innerHTML = `<img src="${engineData.logo}" alt="${engineData.name} Logo">`;
        engineDescription.textContent = engineData.description;
        
        // 保存用户选择
        localStorage.setItem('preferredEngine', engine);
    }
    
    // 表单提交前检查
    searchForm.addEventListener('submit', function(e) {
        if (searchInput.value.trim() === '') {
            e.preventDefault();
            searchInput.classList.add('shake');
            setTimeout(() => {
                searchInput.classList.remove('shake');
            }, 500);
        }
    });
    
    // 加载用户之前的选择
    const savedEngine = localStorage.getItem('preferredEngine');
    if (savedEngine && searchEngines[savedEngine]) {
        currentEngine = savedEngine;
        searchEngineButtons.forEach(btn => {
            if (btn.getAttribute('data-engine') === savedEngine) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        updateSearchEngine(savedEngine);
    }
    
    // 添加搜索框动画
    searchInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
    
    // 添加抖动动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        #search-form.focused #search-input {
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
        }
    `;
    document.head.appendChild(style);
});