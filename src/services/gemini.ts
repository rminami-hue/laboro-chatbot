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
        return { shouldShowDefault: true };
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // 利用可能なカテゴリとメニュー項目を文字列に変換
        const categoryList = Object.entries(availableCategories)
            .map(([key, category]) => {
                const items = category.items.map((item, index) => `${index}: ${item}`).join(', ');
                return `${key}: ${category.title} [${items}]`;
            })
            .join('\n');

        const prompt = `あなたはLABORO（外国人労働者派遣会社）のチャットボットサポートです。
ユーザーの質問を分析して、最も適切なカテゴリとメニュー項目を提案してください。

利用可能なカテゴリとメニュー項目:
${categoryList}

ユーザーの質問: "${query}"
言語: ${currentLanguage}

以下のJSON形式で回答してください。該当するカテゴリとメニュー項目が見つからない場合は、shouldShowDefaultをtrueにしてください。
{
  "categoryKey": "salary" | "visa" | "attendance" | "shift" | "system" | "other" | null,
  "itemIndex": 0-4 (該当するメニュー項目のインデックス),
  "shouldShowDefault": true | false,
  "suggestedMessage": "ユーザーへの提案メッセージ（該当する場合）"
}

JSONのみを返答してください。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // JSONを抽出（コードブロックがある場合を考慮）
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return { shouldShowDefault: true };
        }

        const parsed = JSON.parse(jsonMatch[0]) as GeminiResponse;
        return parsed;
    } catch (error) {
        console.error('Gemini API error:', error);
        return { shouldShowDefault: true };
    }
}

/**
 * ユーザーの質問に対して、より自然な回答を生成
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

        const languageNames: Record<string, string> = {
            vi: 'ベトナム語',
            ja: '日本語',
            en: '英語',
            ne: 'ネパール語'
        };

        const prompt = `あなたはLABORO（外国人労働者派遣会社）のチャットボットサポートです。
ユーザーの質問に対して、簡潔で親切な回答を${languageNames[currentLanguage] || '日本語'}で提供してください。

ユーザーの質問: "${query}"
${context ? `コンテキスト: ${context.categoryKey} - 項目${context.itemIndex}` : ''}

回答は2-3文程度で、具体的で実用的な内容にしてください。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API error:', error);
        return null;
    }
}
