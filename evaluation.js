class EssayEvaluation {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api/evaluate';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleSubmission());
        }
    }

    async handleSubmission() {
        const submitBtn = document.getElementById('submitBtn');
        try {
            // 显示加载状态
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 评阅中...';

            // 获取输入内容
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const gradeLevel = document.getElementById('gradeLevel').value;

            if (!content.trim()) {
                alert('请输入作文内容');
                return;
            }

            // 调用后端API进行评阅
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    essay: {
                        title,
                        content,
                        gradeLevel
                    }
                })
            });

            if (!response.ok) {
                throw new Error('评阅请求失败');
            }

            const result = await response.json();

            // 将结果转换为 URL 参数并跳转到结果页面
            const resultParam = encodeURIComponent(JSON.stringify(result));
            window.location.href = `result.html?result=${resultParam}`;
            
        } catch (error) {
            console.error('评阅失败:', error);
            alert('评阅失败，请稍后重试');
        } finally {
            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-pen-fancy"></i> 开始评阅';
        }
    }
}

// 页面加载完成后初始化评阅系统
document.addEventListener('DOMContentLoaded', () => {
    window.essayEvaluation = new EssayEvaluation();
}); 