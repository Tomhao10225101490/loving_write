class EssayEvaluation {
    constructor() {
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

            // 本地评阅
            const result = this.evaluateEssay({
                title,
                content,
                gradeLevel
            });

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

    evaluateEssay(essay) {
        // 基于字数的基础评分
        const wordCount = essay.content.length;
        let baseScore = 0;

        // 根据年级调整评分标准
        const gradeStandards = {
            'primary': { min: 200, max: 800, ideal: 500 },
            'junior': { min: 400, max: 1000, ideal: 800 },
            'senior': { min: 600, max: 1200, ideal: 1000 }
        };

        const standard = gradeStandards[essay.gradeLevel];

        // 内容评分 (30分)
        let contentScore = 0;
        if (wordCount < standard.min) {
            contentScore = Math.floor(20 * (wordCount / standard.min));
        } else if (wordCount > standard.max) {
            contentScore = 25;
        } else {
            contentScore = 25 + Math.floor(5 * (1 - Math.abs(wordCount - standard.ideal) / standard.ideal));
        }

        // 结构评分 (20分)
        // 简单检查是否有段落划分
        const paragraphs = essay.content.split(/\n\s*\n/);
        const structureScore = Math.min(20, paragraphs.length * 5);

        // 语言评分 (40分)
        // 基于一些简单规则评分
        let languageScore = 30; // 基础分
        // 检查标点符号使用
        const punctuationVariety = new Set(essay.content.match(/[，。！？；：""]/g) || []).size;
        languageScore += Math.min(5, punctuationVariety);
        // 检查是否有重复段落开头
        const paragraphStarts = new Set(paragraphs.map(p => p.slice(0, 4)));
        languageScore += Math.min(5, paragraphStarts.size);

        // 书写评分 (10分) - 在线系统中默认给满分
        const writingScore = 10;

        // 生成评语和建议
        const comments = this.generateComments(essay, {
            wordCount,
            standard,
            paragraphCount: paragraphs.length
        });

        return {
            totalScore: contentScore + structureScore + languageScore + writingScore,
            dimensions: {
                content: {
                    score: contentScore,
                    comments: comments.content
                },
                structure: {
                    score: structureScore,
                    comments: comments.structure
                },
                language: {
                    score: languageScore,
                    comments: comments.language
                },
                writing: {
                    score: writingScore,
                    comments: "在线评阅系统中默认满分"
                }
            },
            highlights: comments.highlights,
            suggestions: comments.suggestions
        };
    }

    generateComments(essay, stats) {
        const comments = {
            content: "",
            structure: "",
            language: "",
            highlights: [],
            suggestions: []
        };

        // 内容评语
        if (stats.wordCount < stats.standard.min) {
            comments.content = `字数偏少，建议扩充内容至少${stats.standard.min}字`;
            comments.suggestions.push(`当前字数${stats.wordCount}字，需要补充更多细节描写和论证`);
        } else if (stats.wordCount > stats.standard.max) {
            comments.content = "字数略多，建议适当精简";
            comments.suggestions.push("可以尝试删减重复内容，使表达更加简练");
        } else {
            comments.content = "字数适中，内容充实";
            comments.highlights.push("文章篇幅把握得当");
        }

        // 结构评语
        if (stats.paragraphCount < 3) {
            comments.structure = "段落划分不够清晰";
            comments.suggestions.push("建议将文章合理分为至少3个段落");
        } else if (stats.paragraphCount > 7) {
            comments.structure = "段落划分过细";
            comments.suggestions.push("建议适当合并一些相关段落");
        } else {
            comments.structure = "结构清晰，层次分明";
            comments.highlights.push("文章结构布局合理");
        }

        // 语言评语
        if (essay.content.includes("的的") || essay.content.includes("地地") || essay.content.includes("得得")) {
            comments.language = "存在个别用词重复现象";
            comments.suggestions.push("注意避免连续使用相同的助词");
        } else {
            comments.language = "语言流畅，表达自然";
            comments.highlights.push("文字表达流畅准确");
        }

        return comments;
    }
}

// 页面加载完成后初始化评阅系统
document.addEventListener('DOMContentLoaded', () => {
    window.essayEvaluation = new EssayEvaluation();
}); 