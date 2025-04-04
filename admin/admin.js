document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面
    const currentPage = window.location.pathname.split('/').pop();
    
    // 管理员凭据（实际应用中应该使用后端验证）
    const adminCredentials = {
        username: 'xzqmn',
        password: 'x84907621'
    };
    
    // 通用函数：检查登录状态并设置通用元素
    function checkLoginAndSetupCommon() {
        // 检查登录状态
        if (!localStorage.getItem('adminLoggedIn')) {
            window.location.href = 'login.html';
            return false;
        }
        
        // 显示用户名
        const usernameElement = document.getElementById('admin-username');
        if (usernameElement) {
            usernameElement.textContent = localStorage.getItem('adminUsername');
        }
        
        // 退出登录
        const logoutButton = document.querySelector('.logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminUsername');
                window.location.href = 'login.html';
            });
        }
        
        return true;
    }
    
    // 显示消息函数
    function showMessage(text, type = 'success') {
        const messageElement = document.getElementById('theme-message');
        if (messageElement) {
            messageElement.textContent = text;
            messageElement.className = `message ${type}`;
            messageElement.style.display = 'block';
            
            // 3秒后自动隐藏
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
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
        
        // 保存主题设置到localStorage，使前台页面也能应用
        localStorage.setItem('siteTheme', JSON.stringify(theme));
    }
    
    // 辅助函数：调整颜色亮度
    function adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => {
            const num = Math.min(255, Math.max(0, parseInt(color, 16) + amount));
            return num.toString(16).padStart(2, '0');
        });
    }
    
    // 登录页面逻辑
    if (currentPage === 'login.html') {
        const loginForm = document.getElementById('login-form');
        const loginMessage = document.getElementById('login-message');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === adminCredentials.username && password === adminCredentials.password) {
                // 登录成功
                loginMessage.textContent = '登录成功，正在跳转...';
                loginMessage.className = 'message success';
                
                // 保存登录状态
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                
                // 跳转到后台主页
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                // 登录失败
                loginMessage.textContent = '用户名或密码错误';
                loginMessage.className = 'message error';
            }
        });
    }
    
    // 主题设置页面逻辑
    if (currentPage === 'theme.html') {
        if (!checkLoginAndSetupCommon()) return;
        
        // 获取主题设置元素
        const primaryColorInput = document.getElementById('primary-color');
        const secondaryColorInput = document.getElementById('secondary-color');
        const accentColorInput = document.getElementById('accent-color');
        const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
        const uploadWallpaperBtn = document.getElementById('upload-wallpaper-btn');
        const wallpaperUpload = document.getElementById('wallpaper-upload');
        const saveThemeBtn = document.getElementById('save-theme');
        const previewThemeBtn = document.getElementById('preview-theme');
        const resetThemeBtn = document.getElementById('reset-theme');
        
        // 默认主题设置
        const defaultTheme = {
            primaryColor: '#4285f4',
            secondaryColor: '#34a853',
            accentColor: '#ea4335',
            wallpaperType: 'gradient',
            wallpaperValue: 'default',
            customWallpaper: null
        };
        
        // 从localStorage加载主题设置
        let currentTheme = JSON.parse(localStorage.getItem('siteTheme')) || {...defaultTheme};
        
        // 初始化颜色选择器和显示值
        function initColorInputs() {
            primaryColorInput.value = currentTheme.primaryColor;
            secondaryColorInput.value = currentTheme.secondaryColor;
            accentColorInput.value = currentTheme.accentColor;
            
            // 更新颜色值显示
            primaryColorInput.nextElementSibling.textContent = currentTheme.primaryColor;
            secondaryColorInput.nextElementSibling.textContent = currentTheme.secondaryColor;
            accentColorInput.nextElementSibling.textContent = currentTheme.accentColor;
        }
        
        // 初始化壁纸选项
        function initWallpaperOptions() {
            wallpaperOptions.forEach(option => {
                const type = option.getAttribute('data-type');
                const value = option.getAttribute('data-value');
                
                if (type === currentTheme.wallpaperType && value === currentTheme.wallpaperValue) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
                
                // 如果是自定义壁纸且有保存的壁纸，显示预览
                if (type === 'custom' && currentTheme.customWallpaper) {
                    const preview = option.querySelector('.wallpaper-preview');
                    preview.innerHTML = '';
                    preview.style.backgroundImage = `url(${currentTheme.customWallpaper})`;
                    preview.style.backgroundSize = 'cover';
                    preview.style.backgroundPosition = 'center';
                }
            });
        }
        
        // 初始化页面
        initColorInputs();
        initWallpaperOptions();
        
        // 颜色选择器事件
        primaryColorInput.addEventListener('input', function() {
            this.nextElementSibling.textContent = this.value;
        });
        
        secondaryColorInput.addEventListener('input', function() {
            this.nextElementSibling.textContent = this.value;
        });
        
        accentColorInput.addEventListener('input', function() {
            this.nextElementSibling.textContent = this.value;
        });
        
        // 壁纸选项点击事件
        wallpaperOptions.forEach(option => {
            option.addEventListener('click', function() {
                wallpaperOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const type = this.getAttribute('data-type');
                const value = this.getAttribute('data-value');
                
                if (type === 'custom' && value === 'custom') {
                    wallpaperUpload.click();
                }
            });
        });
        
        // 上传壁纸按钮点击事件
        uploadWallpaperBtn.addEventListener('click', function() {
            wallpaperUpload.click();
        });
        
        // 壁纸文件上传事件
        wallpaperUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const customOption = document.querySelector('.wallpaper-option[data-type="custom"]');
                    const preview = customOption.querySelector('.wallpaper-preview');
                    
                    preview.innerHTML = '';
                    preview.style.backgroundImage = `url(${e.target.result})`;
                    preview.style.backgroundSize = 'cover';
                    preview.style.backgroundPosition = 'center';
                    
                    wallpaperOptions.forEach(opt => opt.classList.remove('active'));
                    customOption.classList.add('active');
                    
                    // 临时保存自定义壁纸
                    currentTheme.customWallpaper = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // 保存主题设置
        saveThemeBtn.addEventListener('click', function() {
            // 获取当前选中的壁纸选项
            const activeWallpaper = document.querySelector('.wallpaper-option.active');
            
            // 更新主题设置
            currentTheme.primaryColor = primaryColorInput.value;
            currentTheme.secondaryColor = secondaryColorInput.value;
            currentTheme.accentColor = accentColorInput.value;
            
            // 获取壁纸设置
            currentTheme.wallpaperType = activeWallpaper.getAttribute('data-type');
            currentTheme.wallpaperValue = activeWallpaper.getAttribute('data-value');
            
            // 保存主题设置到localStorage
            localStorage.setItem('siteTheme', JSON.stringify(currentTheme));
            
            // 显示保存成功消息
            showMessage('主题设置已保存', 'success');
            
            // 应用主题到当前页面
            applyTheme(currentTheme);
        });
        
        // 预览主题设置
        previewThemeBtn.addEventListener('click', function() {
            // 获取当前输入的主题设置
            const previewTheme = {
                primaryColor: primaryColorInput.value,
                secondaryColor: secondaryColorInput.value,
                accentColor: accentColorInput.value,
                wallpaperType: document.querySelector('.wallpaper-option.active').getAttribute('data-type'),
                wallpaperValue: document.querySelector('.wallpaper-option.active').getAttribute('data-value'),
                customWallpaper: currentTheme.customWallpaper
            };
            
            // 应用预览主题
            applyTheme(previewTheme);
            
            // 显示预览消息
            showMessage('正在预览主题设置，点击保存以应用', 'info');
        });
        
        // 重置主题设置
        resetThemeBtn.addEventListener('click', function() {
            // 重置为默认主题
            currentTheme = {...defaultTheme};
            
            // 更新UI
            initColorInputs();
            initWallpaperOptions();
            
            // 应用默认主题
            applyTheme(currentTheme);
            
            // 显示重置消息
            showMessage('主题设置已重置为默认值', 'info');
        });
    }
    
    // 辅助函数：调整颜色亮度
    function adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => {
            const num = Math.min(255, Math.max(0, parseInt(color, 16) + amount));
            return num.toString(16).padStart(2, '0');
        });
    }
    
    // 显示消息函数已在前面定义，这里不需要重复定义
    
    // 检查登录状态并设置通用元素函数已在前面定义，这里不需要重复定义
    
    // 后台主页逻辑
    if (currentPage === 'index.html' || currentPage === '') {
        // 检查登录状态
        if (!localStorage.getItem('adminLoggedIn')) {
            window.location.href = 'login.html';
            return;
        }
        
        // 显示用户名
        const usernameElement = document.getElementById('admin-username');
        if (usernameElement) {
            usernameElement.textContent = localStorage.getItem('adminUsername');
        }
        
        // 退出登录
        const logoutButton = document.querySelector('.logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminUsername');
                window.location.href = 'login.html';
            });
        }
        
        // 加载搜索引擎数据
        loadSearchEngines();
        
        // 添加新搜索引擎按钮
        const addEngineButton = document.getElementById('add-engine');
        if (addEngineButton) {
            addEngineButton.addEventListener('click', function() {
                showEngineForm();
            });
        }
    }
    
    // 加载搜索引擎数据
    function loadSearchEngines() {
        const enginesTable = document.getElementById('engines-table-body');
        if (!enginesTable) return;
        
        // 从localStorage获取搜索引擎数据，如果没有则使用默认数据
        let searchEngines = JSON.parse(localStorage.getItem('searchEngines'));
        
        if (!searchEngines) {
            // 使用默认数据（从script.js中获取）
            searchEngines = {
                google: {
                    name: 'Google',
                    url: 'https://www.google.com/search',
                    param: 'q',
                    logo: '../Logo/google.svg',
                    description: 'Google 是全球最大的搜索引擎，提供网页、图片、视频等多种搜索服务。'
                },
                baidu: {
                    name: '百度',
                    url: 'https://www.baidu.com/s',
                    param: 'wd',
                    logo: '../Logo/baidu.svg',
                    description: '百度是中国最大的搜索引擎，提供网页、贴吧、知道等多种服务。'
                },
                bing: {
                    name: 'Bing',
                    url: 'https://www.bing.com/search',
                    param: 'q',
                    logo: '../Logo/Bing.png',
                    description: 'Bing 是微软推出的搜索引擎，提供网页、图片、视频等多种搜索服务。'
                },
                github: {
                    name: 'GitHub',
                    url: 'https://github.com/search',
                    param: 'q',
                    logo: '../Logo/github.png',
                    description: 'GitHub 是全球最大的代码托管平台，可以搜索开源项目和代码。'
                },
                bilibili: {
                    name: '哔哩哔哩',
                    url: 'https://search.bilibili.com/all',
                    param: 'keyword',
                    logo: '../Logo/bilibili.svg',
                    description: '哔哩哔哩是中国知名的视频弹幕网站，提供动画、游戏、音乐等内容。'
                },
                yandex: {
                    name: 'Yandex',
                    url: 'https://yandex.com/search/',
                    param: 'text',
                    logo: '../Logo/yandex.svg',
                    description: 'Yandex 是俄罗斯最大的搜索引擎，提供网页、图片、视频等多种搜索服务。'
                }
            };
            
            // 保存到localStorage
            localStorage.setItem('searchEngines', JSON.stringify(searchEngines));
        }
        
        // 清空表格
        enginesTable.innerHTML = '';
        
        // 填充表格
        Object.keys(searchEngines).forEach(key => {
            const engine = searchEngines[key];
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${engine.name}</td>
                <td>${key}</td>
                <td>${engine.url}</td>
                <td>${engine.param}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit" data-id="${key}"><i class="fas fa-edit"></i></button>
                        <button class="delete" data-id="${key}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            
            enginesTable.appendChild(row);
        });
        
        // 添加编辑和删除事件
        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', function() {
                const engineId = this.getAttribute('data-id');
                showEngineForm(engineId);
            });
        });
        
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function() {
                const engineId = this.getAttribute('data-id');
                if (confirm(`确定要删除 ${searchEngines[engineId].name} 搜索引擎吗？`)) {
                    deleteSearchEngine(engineId);
                }
            });
        });
    }
    
    // 显示添加/编辑搜索引擎表单
    function showEngineForm(engineId = null) {
        const adminContent = document.querySelector('.admin-content');
        if (!adminContent) return;
        
        let engine = { name: '', key: '', url: '', param: '', logo: '', description: '' };
        let formTitle = '添加搜索引擎';
        
        if (engineId) {
            // 编辑现有搜索引擎
            const searchEngines = JSON.parse(localStorage.getItem('searchEngines'));
            if (searchEngines && searchEngines[engineId]) {
                engine = searchEngines[engineId];
                engine.key = engineId;
                formTitle = '编辑搜索引擎';
            }
        }
        
        adminContent.innerHTML = `
            <div class="engine-form">
                <h2>${formTitle}</h2>
                <form id="engine-form">
                    <div class="form-group">
                        <label for="engine-name">名称</label>
                        <input type="text" id="engine-name" value="${engine.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="engine-key">标识符</label>
                        <input type="text" id="engine-key" value="${engine.key}" ${engineId ? 'readonly' : ''} required>
                    </div>
                    
                    <div class="form-group">
                        <label for="engine-url">搜索URL</label>
                        <input type="text" id="engine-url" value="${engine.url}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="engine-param">参数名</label>
                        <input type="text" id="engine-param" value="${engine.param}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="engine-logo">Logo路径</label>
                        <input type="text" id="engine-logo" value="${engine.logo}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="engine-description">描述</label>
                        <textarea id="engine-description" rows="3" required>${engine.description}</textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="cancel" id="cancel-form">取消</button>
                        <button type="submit" class="save">保存</button>
                    </div>
                </form>
            </div>
        `;
        
        // 表单提交事件
        document.getElementById('engine-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveSearchEngine();
        });
        
        // 取消按钮事件
        document.getElementById('cancel-form').addEventListener('click', function() {
            loadEnginesPage();
        });
    }
    
    // 保存搜索引擎
    function saveSearchEngine() {
        const name = document.getElementById('engine-name').value;
        const key = document.getElementById('engine-key').value;
        const url = document.getElementById('engine-url').value;
        const param = document.getElementById('engine-param').value;
        const logo = document.getElementById('engine-logo').value;
        const description = document.getElementById('engine-description').value;
        
        if (!name || !key || !url || !param || !logo || !description) {
            alert('请填写所有字段');
            return;
        }
        
        // 获取现有搜索引擎
        let searchEngines = JSON.parse(localStorage.getItem('searchEngines')) || {};
        
        // 添加或更新搜索引擎
        searchEngines[key] = {
            name,
            url,
            param,
            logo,
            description
        };
        
        // 保存到localStorage
        localStorage.setItem('searchEngines', JSON.stringify(searchEngines));
        
        // 返回到搜索引擎列表
        loadEnginesPage();
    }
    
    // 删除搜索引擎
    function deleteSearchEngine(engineId) {
        // 获取现有搜索引擎
        let searchEngines = JSON.parse(localStorage.getItem('searchEngines'));
        
        if (searchEngines && searchEngines[engineId]) {
            // 删除搜索引擎
            delete searchEngines[engineId];
            
            // 保存到localStorage
            localStorage.setItem('searchEngines', JSON.stringify(searchEngines));
            
            // 重新加载列表
            loadSearchEngines();
        }
    }
    
    // 加载搜索引擎管理页面
    function loadEnginesPage() {
        const adminContent = document.querySelector('.admin-content');
        if (!adminContent) return;
        
        adminContent.innerHTML = `
            <div class="engines-header">
                <h2>搜索引擎管理</h2>
                <button id="add-engine" class="add-button"><i class="fas fa-plus"></i> 添加搜索引擎</button>
            </div>
            
            <table class="engines-table">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>标识符</th>
                        <th>搜索URL</th>
                        <th>参数名</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="engines-table-body">
                    <!-- 搜索引擎列表将在这里动态生成 -->
                </tbody>
            </table>
        `;
        
        // 加载搜索引擎数据
        loadSearchEngines();
        
        // 添加新搜索引擎按钮
        document.getElementById('add-engine').addEventListener('click', function() {
            showEngineForm();
        });
    }
});