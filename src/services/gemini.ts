import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('VITE_GEMINI_API_KEY is not set. Gemini features will be disabled.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface CategoryInfo {
    categoryKey: string;
    itemIndex: number;
    confidence: number;
}

export interface GeminiResponse {
    categoryKey?: string;
    itemIndex?: number;
    shouldShowDefault?: boolean;
    suggestedMessage?: string;
}

/**
 * Gemini APIを使用してユーザーの質問を分析し、適切なカテゴリとメニュー項目を提案
 */
export async function analyzeUserQuery(
    query: string,
    currentLanguage: string,
    availableCategories: Record<string, { title: string; items: string[] }>
): Promise<GeminiResponse> {
    if (!genAI) {
        console.warn('Gemini API is not available');
        return { shouldShowDefault: true };
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // 利用可能なカテゴリとメニュー項目を詳細に変換
        const categoryList = Object.entries(availableCategories)
            .map(([key, category]) => {
                const items = category.items.map((item, index) => `  ${index}: ${item}`).join('\n');
                return `- ${key}: ${category.title}\n${items}`;
            })
            .join('\n\n');

        const languageInstructions: Record<string, string> = {
            vi: 'Bạn là chatbot hỗ trợ của LABORO (công ty cử nhân viên nước ngoài). Phân tích câu hỏi của người dùng và đề xuất danh mục và mục menu phù hợp nhất.',
            ja: 'あなたはLABORO（外国人労働者派遣会社）のチャットボットサポートです。ユーザーの質問を分析して、最も適切なカテゴリとメニュー項目を提案してください。',
            en: 'You are a chatbot support for LABORO (a foreign worker dispatch company). Analyze the user\'s question and suggest the most appropriate category and menu item.',
            ne: 'तपाईं LABORO (विदेशी कामदार पठाउने कम्पनी) को च्याटबट सहायता हुनुहुन्छ। प्रयोगकर्ताको प्रश्नलाई विश्लेषण गर्नुहोस् र सबैभन्दा उपयुक्त श्रेणी र मेनु वस्तु सुझाव दिनुहोस्।'
        };

        const instruction = languageInstructions[currentLanguage] || languageInstructions.ja;

        const prompt = `${instruction}

利用可能なカテゴリとメニュー項目:
${categoryList}

ユーザーの質問: "${query}"

重要: ユーザーの質問の意図を理解し、関連するカテゴリとメニュー項目を見つけてください。
- 「給料」「給与明細」「賃金」などの言葉は salary カテゴリに関連します
- 「ビザ」「在留カード」「更新」などの言葉は visa カテゴリに関連します
- 「遅刻」「欠勤」「休み」などの言葉は attendance カテゴリに関連します
- 「シフト」「労働時間」などの言葉は shift カテゴリに関連します
- 「CMS」「ログイン」「パスワード」などの言葉は system カテゴリに関連します
- その他の質問は other カテゴリに関連する可能性があります

以下のJSON形式で回答してください。必ず有効なJSONのみを返答してください。
{
  "categoryKey": "salary" | "visa" | "attendance" | "shift" | "system" | "other" | null,
  "itemIndex": 0-4,
  "shouldShowDefault": true | false,
  "suggestedMessage": "ユーザーへの提案メッセージ（該当する場合）"
}

JSON only, no other text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        console.log('Gemini raw response:', text);

        // JSONを抽出（コードブロックがある場合を考慮）
        let jsonText = text;
        const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
            jsonText = codeBlockMatch[1];
        } else {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonText = jsonMatch[0];
            }
        }

        try {
            const parsed = JSON.parse(jsonText) as GeminiResponse;
            console.log('Gemini parsed response:', parsed);
            
            // バリデーション
            if (parsed.categoryKey && parsed.itemIndex !== undefined) {
                const category = availableCategories[parsed.categoryKey];
                if (category && category.items[parsed.itemIndex]) {
                    return parsed;
                } else {
                    console.warn('Invalid category or itemIndex:', parsed);
                }
            }
            
            return parsed;
        } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Text:', jsonText);
            return { shouldShowDefault: true };
        }
    } catch (error) {
        console.error('Gemini API error:', error);
        return { shouldShowDefault: true };
    }
}

/**
 * ユーザーの質問に対して、より自然な回答を生成（フェーズ2機能）
 */
export async function generateResponse(
    query: string,
    currentLanguage: string,
    context?: { categoryKey?: string; itemIndex?: number }
): Promise<string | null> {
    if (!genAI) {
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const languageInstructions: Record<string, string> = {
            vi: 'Bạn là chatbot hỗ trợ của LABORO. Trả lời câu hỏi của người dùng một cách ngắn gọn và thân thiện bằng tiếng Việt.',
            ja: 'あなたはLABOROのチャットボットサポートです。ユーザーの質問に対して、簡潔で親切な回答を日本語で提供してください。',
            en: 'You are a chatbot support for LABORO. Answer the user\'s question concisely and friendly in English.',
            ne: 'तपाईं LABORO को च्याटबट सहायता हुनुहुन्छ। प्रयोगकर्ताको प्रश्नको जवाफ संक्षिप्त र मैत्रीपूर्ण तरिकाले नेपालीमा दिनुहोस्।'
        };

        const instruction = languageInstructions[currentLanguage] || languageInstructions.ja;

        const prompt = `${instruction}

ユーザーの質問: "${query}"
${context ? `コンテキスト: ${context.categoryKey} - 項目${context.itemIndex}` : ''}

回答は2-3文程度で、具体的で実用的な内容にしてください。LABOROのサービスに関する質問には、適切な案内を提供してください。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API error:', error);
        return null;
    }
}
