from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)  # 启用跨域支持

# 百度API配置
API_KEY = "r5B0INu5jWFYSH1U15ZvwwsI"
SECRET_KEY = "f4jHr6EpE1DbsX0vjuNGGEuMxdVX3pSn"
BASE_URL = "https://aip.baidubce.com"

def get_access_token():
    """获取百度API的access_token"""
    url = f"{BASE_URL}/oauth/2.0/token"
    params = {
        "grant_type": "client_credentials",
        "client_id": API_KEY,
        "client_secret": SECRET_KEY
    }
    response = requests.post(url, params=params)
    return response.json().get("access_token")

@app.route('/api/evaluate', methods=['POST'])
def evaluate_essay():
    try:
        data = request.json
        essay = data.get('essay', {})
        
        # 获取access_token
        access_token = get_access_token()
        
        # 构建评阅提示词
        prompt = f"""
        请作为一位专业的语文老师，对以下{essay['gradeLevel']}作文进行评阅：

        标题：{essay['title']}
        内容：{essay['content']}

        请从以下四个维度进行评分和点评：
        1. 内容（30分）：主题明确性、内容充实度、思想深度
        2. 结构（20分）：层次分明、条理清晰、过渡自然
        3. 语言（40分）：用词准确、句式灵活、表达生动
        4. 书写（10分）：标点正确、格式规范

        请按以下格式给出评阅结果：
        1. 总分：[总分]
        2. 内容评分：[分数] [评语]
        3. 结构评分：[分数] [评语]
        4. 语言评分：[分数] [评语]
        5. 书写评分：[分数] [评语]
        6. 作文亮点：
        - [亮点1]
        - [亮点2]
        7. 改进建议：
        - [建议1]
        - [建议2]
        """

        # 调用百度文心一言API
        url = f"{BASE_URL}/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?access_token={access_token}"
        
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, json=payload)
        result = response.json().get("result", "")

        # 解析AI返回的评阅结果
        evaluation_result = parse_evaluation_result(result)
        
        return jsonify(evaluation_result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def parse_evaluation_result(result_text):
    """解析AI返回的评阅结果文本"""
    try:
        # 使用简单的文本解析逻辑
        lines = result_text.split('\n')
        total_score = 0
        dimensions = {
            "content": {"score": 0, "comments": ""},
            "structure": {"score": 0, "comments": ""},
            "language": {"score": 0, "comments": ""},
            "writing": {"score": 0, "comments": ""}
        }
        highlights = []
        suggestions = []

        current_section = None
        for line in lines:
            line = line.strip()
            if not line:
                continue

            if "总分：" in line:
                total_score = int(line.split("：")[1])
            elif "内容评分：" in line:
                parts = line.split("：")[1].split(" ", 1)
                dimensions["content"]["score"] = int(parts[0])
                dimensions["content"]["comments"] = parts[1]
            elif "结构评分：" in line:
                parts = line.split("：")[1].split(" ", 1)
                dimensions["structure"]["score"] = int(parts[0])
                dimensions["structure"]["comments"] = parts[1]
            elif "语言评分：" in line:
                parts = line.split("：")[1].split(" ", 1)
                dimensions["language"]["score"] = int(parts[0])
                dimensions["language"]["comments"] = parts[1]
            elif "书写评分：" in line:
                parts = line.split("：")[1].split(" ", 1)
                dimensions["writing"]["score"] = int(parts[0])
                dimensions["writing"]["comments"] = parts[1]
            elif "作文亮点：" in line:
                current_section = "highlights"
            elif "改进建议：" in line:
                current_section = "suggestions"
            elif line.startswith("- "):
                if current_section == "highlights":
                    highlights.append(line[2:])
                elif current_section == "suggestions":
                    suggestions.append(line[2:])

        return {
            "totalScore": total_score,
            "dimensions": dimensions,
            "highlights": highlights,
            "suggestions": suggestions
        }
    except Exception as e:
        print(f"解析错误: {e}")
        return {
            "totalScore": 0,
            "dimensions": dimensions,
            "highlights": ["解析评阅结果时出错"],
            "suggestions": ["请重试"]
        }

if __name__ == '__main__':
    app.run(debug=True, port=5000) 