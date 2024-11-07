class HistoryManager {
    constructor() {
        this.initializeEventListeners();
        this.loadHistory();
    }

    initializeEventListeners() {
        // 年级筛选
        document.querySelector('select[value="all"]').addEventListener('change', (e) => {
            this.filterHistory('grade', e.target.value);
        });

        // 时间筛选
        document.querySelector('select[value="week"]').addEventListener('change', (e) => {
            this.filterHistory('time', e.target.value);
        });

        // 搜索功能
        const searchInput = document.querySelector('.search-box input');
        const searchBtn = document.querySelector('.search-box button');

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.searchHistory(searchInput.value);
            }
        });

        searchBtn.addEventListener('click', () => {
            this.searchHistory(searchInput.value);
        });

        // 分页功能
        document.querySelectorAll('.pagination button').forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.querySelector('i').classList.contains('fa-chevron-left') ? 'prev' : 'next';
                this.changePage(direction);
            });
        });
    }

    async loadHistory() {
        try {
            // 这里可以从本地存储或服务器获取历史记录
            const history = this.getMockHistory();
            this.renderHistory(history);
        } catch (error) {
            console.error('加载历史记录失败:', error);
        }
    }

    getMockHistory() {
        return [
            {
                date: '2024-02-07',
                title: '我的理想',
                grade: '初中',
                score: 92,
                id: '001'
            },
            {
                date: '2024-02-06',
                title: '难忘的一课',
                grade: '高中',
                score: 88,
                id: '002'
            },
            // 更多模拟数据...
        ];
    }

    renderHistory(history) {
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = history.map(item => `
            <tr>
                <td>${item.date}</td>
                <td>${item.title}</td>
                <td>${item.grade}</td>
                <td>
                    <span class="score-badge ${this.getScoreClass(item.score)}">
                        ${item.score}
                    </span>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="historyManager.viewEssay('${item.id}')">
                        查看
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="historyManager.exportEssay('${item.id}')">
                        导出
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getScoreClass(score) {
        if (score >= 90) return 'score-high';
        if (score >= 75) return 'score-medium';
        return 'score-low';
    }

    filterHistory(type, value) {
        // 实现筛选逻辑
        const history = this.getMockHistory();
        let filtered = history;

        if (type === 'grade' && value !== 'all') {
            filtered = history.filter(item => item.grade === value);
        }

        if (type === 'time') {
            const now = new Date();
            const days = {
                'week': 7,
                'month': 30,
                'year': 365
            }[value];

            if (days) {
                filtered = history.filter(item => {
                    const itemDate = new Date(item.date);
                    const diffTime = Math.abs(now - itemDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= days;
                });
            }
        }

        this.renderHistory(filtered);
    }

    searchHistory(keyword) {
        if (!keyword.trim()) {
            this.loadHistory();
            return;
        }

        const history = this.getMockHistory();
        const filtered = history.filter(item => 
            item.title.toLowerCase().includes(keyword.toLowerCase())
        );
        this.renderHistory(filtered);
    }

    viewEssay(id) {
        // 实现查看作文详情的功能
        window.location.href = `result.html?id=${id}`;
    }

    exportEssay(id) {
        // 实现导出功能
        const essay = this.getMockHistory().find(item => item.id === id);
        if (!essay) return;

        const content = `
标题：${essay.title}
年级：${essay.grade}
得分：${essay.score}
日期：${essay.date}
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${essay.title}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    changePage(direction) {
        // 实现分页功能
        const currentPage = document.querySelector('.page-number.active');
        const pages = document.querySelectorAll('.page-number');
        const currentIndex = Array.from(pages).indexOf(currentPage);

        if (direction === 'prev' && currentIndex > 0) {
            currentPage.classList.remove('active');
            pages[currentIndex - 1].classList.add('active');
            this.loadHistory(); // 加载上一页数据
        }

        if (direction === 'next' && currentIndex < pages.length - 1) {
            currentPage.classList.remove('active');
            pages[currentIndex + 1].classList.add('active');
            this.loadHistory(); // 加载下一页数据
        }
    }
}

// 页面加载完成后初始化历史记录管理器
document.addEventListener('DOMContentLoaded', () => {
    window.historyManager = new HistoryManager();
}); 