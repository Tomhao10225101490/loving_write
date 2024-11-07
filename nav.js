class Navigation {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.initializeNavigation();
    }

    initializeNavigation() {
        // 获取所有导航项
        const navItems = document.querySelectorAll('.nav-item');
        
        // 设置当前页面的导航项为激活状态
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === this.currentPage) {
                item.classList.add('active');
            }
        });

        // 添加导航项点击事件
        this.addNavClickHandlers();
    }

    addNavClickHandlers() {
        // 作文评阅
        document.querySelector('[data-nav="evaluate"]').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // 评阅历史
        document.querySelector('[data-nav="history"]').addEventListener('click', () => {
            window.location.href = 'history.html';
        });

        // 优秀范文
        document.querySelector('[data-nav="examples"]').addEventListener('click', () => {
            window.location.href = 'examples.html';
        });

        // 数据分析
        document.querySelector('[data-nav="analysis"]').addEventListener('click', () => {
            window.location.href = 'analysis.html';
        });

        // 使用指南
        document.querySelector('[data-nav="guide"]').addEventListener('click', () => {
            window.location.href = 'guide.html';
        });
    }

    // 检查用户是否已登录
    checkAuth() {
        // 这里添加实际的登录检查逻辑
        return localStorage.getItem('userToken') !== null;
    }

    // 显示登录提示
    showLoginPrompt() {
        const modal = document.createElement('div');
        modal.className = 'login-modal';
        modal.innerHTML = `
            <div class="login-content">
                <h2>请先登录</h2>
                <p>访问此功能需要登录账号</p>
                <button class="btn btn-primary" onclick="window.location.href='login.html'">
                    立即登录
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// 页面加载完成后初始化导航
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
}); 