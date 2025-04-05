document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面
    const currentPage = window.location.pathname.split('/').pop();
    
    // 管理员凭据（实际应用中应该使用后端验证）
    const adminCredentials = {
        username: 'admin',
        password: 'admin123'
    };
    
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