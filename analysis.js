class AnalysisDashboard {
    constructor() {
        this.initializeCharts();
        this.initializeEventListeners();
        this.loadData();
    }

    initializeEventListeners() {
        // 时间范围选择
        document.querySelectorAll('.date-range .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.date-range .btn.active').classList.remove('active');
                e.target.classList.add('active');
                this.updateCharts(e.target.textContent);
            });
        });

        // 自定义日期范围
        document.querySelector('.custom-range .btn').addEventListener('click', () => {
            const startDate = document.querySelector('.custom-range input:first-child').value;
            const endDate = document.querySelector('.custom-range input:last-child').value;
            if (startDate && endDate) {
                this.updateCharts('custom', startDate, endDate);
            }
        });

        // 维度切换
        document.querySelector('#dimensionScores').closest('.chart-card')
            .querySelector('select')?.addEventListener('change', (e) => {
                this.updateDimensionChart(e.target.value);
            });
    }

    initializeCharts() {
        // 分数分布图表
        this.scoreDistributionChart = new Chart(
            document.getElementById('scoreDistribution'),
            {
                type: 'bar',
                data: {
                    labels: ['0-60', '60-70', '70-80', '80-90', '90-100'],
                    datasets: [{
                        label: '作文数量',
                        data: [5, 15, 30, 40, 10],
                        backgroundColor: 'rgba(52, 152, 219, 0.6)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '分数区间分布'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '作文数量'
                            }
                        }
                    }
                }
            }
        );

        // 维度得分分析图表
        this.dimensionScoresChart = new Chart(
            document.getElementById('dimensionScores'),
            {
                type: 'radar',
                data: {
                    labels: ['内容', '结构', '语言', '书写'],
                    datasets: [{
                        label: '平均得分率',
                        data: [85, 78, 82, 90],
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        pointBackgroundColor: 'rgba(52, 152, 219, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '各维度得分情况'
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20
                            }
                        }
                    }
                }
            }
        );

        // 进步趋势图表
        this.progressTrendChart = new Chart(
            document.getElementById('progressTrend'),
            {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    datasets: [{
                        label: '平均分',
                        data: [75, 78, 80, 82, 85, 88],
                        borderColor: 'rgba(52, 152, 219, 1)',
                        tension: 0.4,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '成绩趋势'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 60,
                            max: 100
                        }
                    }
                }
            }
        );
    }

    async loadData() {
        try {
            // 这里可以从本地存储或服务器获取数据
            const data = this.getMockData();
            this.updateStatistics(data);
            this.updateCharts('近7天', data);
        } catch (error) {
            console.error('加载数据失败:', error);
        }
    }

    getMockData() {
        // 模拟数据
        return {
            totalEssays: 156,
            averageScore: 85.6,
            highestScore: 98,
            totalWords: 523,
            scoreDistribution: [5, 15, 30, 40, 10],
            dimensionScores: {
                content: 85,
                structure: 78,
                language: 82,
                writing: 90
            },
            progressTrend: [75, 78, 80, 82, 85, 88],
            commonProblems: [
                { name: '段落结构不清晰', percentage: 75 },
                { name: '用词重复', percentage: 65 },
                { name: '标点使用不当', percentage: 45 }
            ]
        };
    }

    updateStatistics(data) {
        document.getElementById('totalEssays').textContent = data.totalEssays;
        document.getElementById('averageScore').textContent = data.averageScore;
        document.getElementById('highestScore').textContent = data.highestScore;
    }

    updateCharts(timeRange, startDate, endDate) {
        // 根据时间范围更新图表数据
        const data = this.getMockData(); // 实际应用中应该根据时间范围获取相应数据

        // 更新分数分布图表
        this.scoreDistributionChart.data.datasets[0].data = data.scoreDistribution;
        this.scoreDistributionChart.update();

        // 更新维度得分图表
        this.dimensionScoresChart.data.datasets[0].data = [
            data.dimensionScores.content,
            data.dimensionScores.structure,
            data.dimensionScores.language,
            data.dimensionScores.writing
        ];
        this.dimensionScoresChart.update();

        // 更新进步趋势图表
        this.progressTrendChart.data.datasets[0].data = data.progressTrend;
        this.progressTrendChart.update();

        // 更新问题分析
        this.updateProblemAnalysis(data.commonProblems);
    }

    updateProblemAnalysis(problems) {
        const problemList = document.querySelector('.problem-list');
        problemList.innerHTML = problems.map(problem => `
            <div class="problem-item">
                <div class="problem-name">${problem.name}</div>
                <div class="problem-bar">
                    <div class="bar" style="width: ${problem.percentage}%">
                        ${problem.percentage}%
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateDimensionChart(dimension) {
        // 根�����择的维度更新图表
        const data = {
            '总分': [75, 78, 80, 82, 85, 88],
            '内容': [70, 75, 78, 80, 83, 85],
            '结构': [72, 76, 79, 81, 84, 86],
            '语言': [73, 77, 80, 83, 85, 87]
        };

        this.progressTrendChart.data.datasets[0].data = data[dimension];
        this.progressTrendChart.data.datasets[0].label = dimension;
        this.progressTrendChart.update();
    }
}

// 页面加载完成后初始化分析面板
document.addEventListener('DOMContentLoaded', () => {
    window.analysisDashboard = new AnalysisDashboard();
}); 