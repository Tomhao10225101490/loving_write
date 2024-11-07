document.addEventListener('DOMContentLoaded', () => {
    // 从 URL 参数获取评阅结果
    const resultData = JSON.parse(decodeURIComponent(location.search.split('=')[1]));
    displayResult(resultData);
});

function displayResult(result) {
    const resultContent = document.getElementById('resultContent');
    
    resultContent.innerHTML = `
        <div class="score-overview">
            <h2>总体评分</h2>
            <div class="total-score">${result.totalScore}</div>
        </div>

        <div class="dimension-grid">
            ${Object.entries(result.dimensions).map(([key, value]) => `
                <div class="dimension-card">
                    <div class="dimension-header">
                        <h3>${getDimensionName(key)}</h3>
                        <div class="dimension-score">${value.score}分</div>
                    </div>
                    <p>${value.comments}</p>
                </div>
            `).join('')}
        </div>

        <div class="analysis-section">
            <h3 class="section-title">作文亮点</h3>
            ${result.highlights.map(highlight => `
                <div class="highlight-item">
                    <i class="fas fa-star"></i>
                    ${highlight}
                </div>
            `).join('')}
        </div>

        <div class="analysis-section">
            <h3 class="section-title">改进建议</h3>
            ${result.suggestions.map(suggestion => `
                <div class="suggestion-item">
                    <i class="fas fa-lightbulb"></i>
                    ${suggestion}
                </div>
            `).join('')}
        </div>
    `;
}

function getDimensionName(key) {
    const names = {
        content: '内容评价',
        structure: '结构评价',
        language: '语言评价',
        writing: '书写评价'
    };
    return names[key] || key;
} 