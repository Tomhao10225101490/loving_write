class ResultDisplay {
    constructor() {
        this.loadResult();
        this.initializeEventListeners();
    }

    loadResult() {
        try {
            // 从 URL 参数获取评阅结果
            const urlParams = new URLSearchParams(window.location.search);
            const resultParam = urlParams.get('result');
            if (!resultParam) {
                throw new Error('未找到评阅结果');
            }

            const result = JSON.parse(decodeURIComponent(resultParam));
            this.displayResult(result);
        } catch (error) {
            console.error('加载结果失败:', error);
            alert('加载评阅结果失败');
        }
    }

    displayResult(result) {
        // 显示标题和基本信息
        document.getElementById('essayTitle').textContent = localStorage.getItem('essayTitle') || '未命名作文';
        document.getElementById('essayGrade').textContent = localStorage.getItem('essayGrade') || '未知年级';
        document.getElementById('essayDate').textContent = new Date().toLocaleDateString();
        document.getElementById('wordCount').textContent = localStorage.getItem('wordCount') || '0';

        // 显示总分
        document.getElementById('totalScore').textContent = result.totalScore;

        // 显示维度得分
        const dimensionScores = document.getElementById('dimensionScores');
        dimensionScores.innerHTML = this.generateDimensionScoresHTML(result.dimensions);

        // 显示亮点
        const highlightList = document.getElementById('highlightList');
        highlightList.innerHTML = this.generateHighlightsHTML(result.highlights);

        // 显示建议
        const suggestionList = document.getElementById('suggestionList');
        suggestionList.innerHTML = this.generateSuggestionsHTML(result.suggestions);
    }

    generateDimensionScoresHTML(dimensions) {
        const dimensionNames = {
            content: '内容',
            structure: '结构',
            language: '语言',
            writing: '书写'
        };

        return Object.entries(dimensions).map(([key, value]) => `
            <div class="dimension-card">
                <div class="dimension-label">${dimensionNames[key]}</div>
                <div class="dimension-score">${value.score}</div>
                <div class="dimension-comment">${value.comments}</div>
            </div>
        `).join('');
    }

    generateHighlightsHTML(highlights) {
        return highlights.map(highlight => `
            <li class="highlight-item">
                <i class="fas fa-star"></i>
                <span>${highlight}</span>
            </li>
        `).join('');
    }

    generateSuggestionsHTML(suggestions) {
        return suggestions.map(suggestion => `
            <li class="suggestion-item">
                <i class="fas fa-lightbulb"></i>
                <span>${suggestion}</span>
            </li>
        `).join('');
    }

    initializeEventListeners() {
        // 导出报告按钮点击事件
        document.querySelector('.export-btn').addEventListener('click', () => {
            this.exportResult();
        });
    }

    async exportResult() {
        try {
            const title = document.getElementById('essayTitle').textContent;
            const grade = document.getElementById('essayGrade').textContent;
            const date = document.getElementById('essayDate').textContent;
            const totalScore = document.getElementById('totalScore').textContent;

            // 创建导出内容
            const content = `
作文评阅报告
=============

基本信息：
标题：${title}
年级：${grade}
日期：${date}
总分：${totalScore}

维度评分：
${this.getDimensionScoresText()}

作文亮点：
${this.getHighlightsText()}

改进建议：
${this.getSuggestionsText()}

评阅时间：${new Date().toLocaleString()}
            `.trim();

            // 创建并下载文件
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}-评阅报告.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('导出失败:', error);
            alert('导出报告失败，请重试');
        }
    }

    getDimensionScoresText() {
        const dimensionCards = document.querySelectorAll('.dimension-card');
        return Array.from(dimensionCards).map(card => {
            const label = card.querySelector('.dimension-label').textContent;
            const score = card.querySelector('.dimension-score').textContent;
            const comment = card.querySelector('.dimension-comment').textContent;
            return `${label}：${score}分\n${comment}`;
        }).join('\n\n');
    }

    getHighlightsText() {
        const highlights = document.querySelectorAll('.highlight-item');
        return Array.from(highlights).map(item => 
            `- ${item.querySelector('span').textContent}`
        ).join('\n');
    }

    getSuggestionsText() {
        const suggestions = document.querySelectorAll('.suggestion-item');
        return Array.from(suggestions).map(item => 
            `- ${item.querySelector('span').textContent}`
        ).join('\n');
    }
}

// 页面加载完成后初始化结果显示
document.addEventListener('DOMContentLoaded', () => {
    window.resultDisplay = new ResultDisplay();
}); 