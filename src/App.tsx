import { useState, useEffect, useRef } from 'react';
import './App.css';
import { languages } from './languages';
import type { Language, Message, Action } from './types';
import { analyzeUserQuery, generateResponse } from './services/gemini';

function App() {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('vi');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [currentMenuPage, setCurrentMenuPage] = useState(0);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showLateForm, setShowLateForm] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const lang = languages[currentLanguage];

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const addMessage = (text: string, sender: 'user' | 'bot', actions?: Action[]) => {
        setMessages(prev => [...prev, { text, sender, actions }]);
        setShowWelcome(false);
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentLanguage(e.target.value as Language);
        setMessages([]);
        setShowWelcome(true);
        setCurrentMenuPage(0);
    };

    const getAnswers = (categoryKey: string, itemIndex: number): { text: string; actions?: Action[] } => {
        const answerKey = `${categoryKey}_${itemIndex}`;
        const answers: Record<string, Record<string, { text: string; actions?: Action[] }>> = {
            vi: {
                salary_0: {
                    text: "Bảng lương có thể được tải xuống từ CMS \"Laboro Control\".\nSau khi đăng nhập, vui lòng tải xuống bảng lương của tháng tương ứng từ menu \"給与明細\".",
                    actions: [
                        { type: 'link', text: '📱 Đăng nhập CMS', action: 'openCMS' },
                        { type: 'menu', text: '❓ Không thể đăng nhập', action: 'system_0' },
                        { type: 'contact', text: '📞 Liên hệ điều phối viên', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 Về trang chủ', action: 'goHome' }
                    ]
                },
                attendance_0: {
                    text: "Cảm ơn bạn đã thông báo đến muộn/nghỉ làm.\nĐiều quan trọng là phải liên hệ càng sớm càng tốt.",
                    actions: [
                        { type: 'form', text: '📝 Gửi biểu mẫu', action: 'showLateForm' },
                        { type: 'contact', text: '📞 Liên hệ trực tiếp', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 Về trang chủ', action: 'goHome' }
                    ]
                },
                default: {
                    text: "Vui lòng liên hệ với điều phối viên phụ trách của bạn để biết thêm chi tiết.",
                    actions: [
                        { type: 'contact', text: '📞 Liên hệ điều phối viên', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 Về trang chủ', action: 'goHome' }
                    ]
                }
            },
            ja: {
                salary_0: {
                    text: "給与明細は、CMS「Laboro Control」からダウンロードできます。\nログイン後、「給与明細」メニューから該当月の明細をダウンロードしてください。",
                    actions: [
                        { type: 'link', text: '📱 CMSにログイン', action: 'openCMS' },
                        { type: 'menu', text: '❓ ログインできない', action: 'system_0' },
                        { type: 'contact', text: '📞 コーディネーターに連絡', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 ホームに戻る', action: 'goHome' }
                    ]
                },
                attendance_0: {
                    text: "遅刻・欠勤の連絡ありがとうございます。\nできるだけ早く連絡していただくことが重要です。",
                    actions: [
                        { type: 'form', text: '📝 連絡フォームを送信', action: 'showLateForm' },
                        { type: 'contact', text: '📞 直接連絡', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 ホームに戻る', action: 'goHome' }
                    ]
                },
                default: {
                    text: "詳細については、担当コーディネーターにお問い合わせください。",
                    actions: [
                        { type: 'contact', text: '📞 コーディネーターに連絡', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 ホームに戻る', action: 'goHome' }
                    ]
                }
            },
            en: {
                salary_0: {
                    text: "You can download your payslip from CMS \"Laboro Control\".\nAfter logging in, please download the payslip for the relevant month from the \"給与明細\" menu.",
                    actions: [
                        { type: 'link', text: '📱 Login to CMS', action: 'openCMS' },
                        { type: 'menu', text: '❓ Cannot login', action: 'system_0' },
                        { type: 'contact', text: '📞 Contact coordinator', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 Go home', action: 'goHome' }
                    ]
                },
                attendance_0: {
                    text: "Thank you for reporting late/absence.\nIt is important to contact as soon as possible.",
                    actions: [
                        { type: 'form', text: '📝 Submit form', action: 'showLateForm' },
                        { type: 'contact', text: '📞 Contact directly', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 Go home', action: 'goHome' }
                    ]
                },
                default: {
                    text: "Please contact your assigned coordinator for more details.",
                    actions: [
                        { type: 'contact', text: '📞 Contact coordinator', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 Go home', action: 'goHome' }
                    ]
                }
            },
            ne: {
                salary_0: {
                    text: "तपाईं CMS \"Laboro Control\" बाट तलबको बिल डाउनलोड गर्न सक्नुहुन्छ।\nलगइन पछि, कृपया \"給与明細\" मेनुबाट सम्बन्धित महिनाको बिल डाउनलोड गर्नुहोस्।",
                    actions: [
                        { type: 'link', text: '📱 CMS मा लगइन', action: 'openCMS' },
                        { type: 'menu', text: '❓ लगइन गर्न सक्दैन', action: 'system_0' },
                        { type: 'contact', text: '📞 समन्वयकलाई सम्पर्क', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 घर फर्कनुहोस्', action: 'goHome' }
                    ]
                },
                attendance_0: {
                    text: "ढिलो/अनुपस्थिति सूचना दिनुभएकोमा धन्यवाद।\nयथाशीघ्र सम्पर्क गर्नु महत्वपूर्ण छ।",
                    actions: [
                        { type: 'form', text: '📝 फारम पेश गर्नुहोस्', action: 'showLateForm' },
                        { type: 'contact', text: '📞 सीधै सम्पर्क', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 घर फर्कनुहोस्', action: 'goHome' }
                    ]
                },
                default: {
                    text: "थप विवरणको लागि कृपया आफ्नो सम्बन्धित समन्वयकलाई सम्पर्क गर्नुहोस्।",
                    actions: [
                        { type: 'contact', text: '📞 समन्वयकलाई सम्पर्क', action: 'contactCoordinator' },
                        { type: 'home', text: '🏠 घर फर्कनुहोस्', action: 'goHome' }
                    ]
                }
            }
        };

        const langAnswers = answers[currentLanguage] || answers.vi;
        return langAnswers[answerKey] || langAnswers.default;
    };

    const handleAction = (action: string) => {
        const actionMessages: Record<string, Record<string, string>> = {
            openCMS: {
                vi: 'Đang mở CMS...\nURL: https://cms.laboro.co.jp (URL thực tế sẽ được LABORO cung cấp)',
                ja: 'CMSを開いています...\nURL: https://cms.laboro.co.jp (実際のURLはLABORO社から提供されます)',
                en: 'Opening CMS...\nURL: https://cms.laboro.co.jp (Actual URL will be provided by LABORO)',
                ne: 'CMS खोल्दै...\nURL: https://cms.laboro.co.jp (वास्तविक URL LABORO द्वारा प्रदान गरिनेछ)'
            },
            contactCoordinator: {
                vi: 'Đang kết nối với điều phối viên phụ trách của bạn...\n\n📱 Facebook Messenger: [Liên kết sẽ được hiển thị]\n☎️ Điện thoại: 03-XXXX-XXXX\n⏰ Thời gian làm việc: Thứ 2 - Thứ 6, 9:00 - 18:00',
                ja: '担当コーディネーターに接続しています...\n\n📱 Facebookメッセンジャー: [リンクが表示されます]\n☎️ 電話: 03-XXXX-XXXX\n⏰ 対応時間: 平日 9:00-18:00',
                en: 'Connecting to your assigned coordinator...\n\n📱 Facebook Messenger: [Link will be displayed]\n☎️ Phone: 03-XXXX-XXXX\n⏰ Business hours: Monday - Friday, 9:00 - 18:00',
                ne: 'तपाईंको सम्बन्धित समन्वयकसँग जोड्दै...\n\n📱 Facebook Messenger: [लिङ्क प्रदर्शन गरिनेछ]\n☎️ फोन: 03-XXXX-XXXX\n⏰ कार्य समय: सोमबार - शुक्रबार, 9:00 - 18:00'
            },
            showGuide: {
                vi: 'Hướng dẫn sử dụng:\n\n1. Chọn một trong các menu bên dưới\n2. Nhập số menu (1, 2, 3...)\n3. Hoặc nhập câu hỏi trực tiếp\n\nLiên kết hướng dẫn: [URL sẽ được cung cấp]',
                ja: 'ご利用ガイド:\n\n1. 下記のメニューから選択\n2. メニュー番号を入力（1, 2, 3...）\n3. または直接質問を入力\n\nガイドリンク: [URLが提供されます]',
                en: 'Usage Guide:\n\n1. Select one of the menus below\n2. Enter menu number (1, 2, 3...)\n3. Or enter your question directly\n\nGuide link: [URL will be provided]',
                ne: 'प्रयोग गाइड:\n\n1. तलका मेनुहरू मध्ये एउटा छान्नुहोस्\n2. मेनु नम्बर प्रविष्ट गर्नुहोस् (1, 2, 3...)\n3. वा सीधै आफ्नो प्रश्न प्रविष्ट गर्नुहोस्\n\nगाइड लिङ्क: [URL प्रदान गरिनेछ]'
            }
        };

        switch (action) {
            case 'openCMS':
            case 'contactCoordinator':
            case 'showGuide':
                const msg = actionMessages[action]?.[currentLanguage] || actionMessages[action]?.['vi'] || '';
                addMessage(msg, 'bot');
                break;
            case 'showLateForm':
                setShowLateForm(true);
                break;
            case 'goHome':
                setMessages([]);
                setShowWelcome(true);
                setCurrentMenuPage(0);
                setShowLateForm(false);
                break;
            default:
                if (action.includes('_')) {
                    const [category, index] = action.split('_');
                    selectMenuItem(category, parseInt(index));
                } else {
                    // その他のアクションはデフォルトメッセージを表示
                    const defaultMsg = {
                        vi: 'Vui lòng liên hệ với điều phối viên phụ trách của bạn để biết thêm chi tiết.',
                        ja: '詳細については、担当コーディネーターにお問い合わせください。',
                        en: 'Please contact your assigned coordinator for more details.',
                        ne: 'थप विवरणको लागि कृपया आफ्नो सम्बन्धित समन्वयकलाई सम्पर्क गर्नुहोस्।'
                    };
                    const defaultActions: Action[] = [
                        { type: 'contact', text: currentLanguage === 'vi' ? '📞 Liên hệ điều phối viên' :
                            currentLanguage === 'ja' ? '📞 コーディネーターに連絡' :
                            currentLanguage === 'en' ? '📞 Contact coordinator' :
                            '📞 समन्वयकलाई सम्पर्क', action: 'contactCoordinator' },
                        { type: 'home', text: currentLanguage === 'vi' ? '🏠 Về trang chủ' :
                            currentLanguage === 'ja' ? '🏠 ホームに戻る' :
                            currentLanguage === 'en' ? '🏠 Go home' :
                            '🏠 घर फर्कनुहोस्', action: 'goHome' }
                    ];
                    addMessage(defaultMsg[currentLanguage] || defaultMsg.vi, 'bot', defaultActions);
                }
        }
    };

    const selectMenuItem = (categoryKey: string, itemIndex: number) => {
        const category = lang.categories[categoryKey];
        if (!category) return;
        const item = category.items[itemIndex];
        if (!item) return;
        addMessage(item, 'user');
        
        const answer = getAnswers(categoryKey, itemIndex);
        addMessage(answer.text, 'bot', answer.actions);
    };

    const selectMenuByNumber = (number: number) => {
        const categories = Object.keys(lang.categories);
        let currentNumber = 1;
        
        for (let i = 0; i < categories.length; i++) {
            const category = lang.categories[categories[i]];
            for (let j = 0; j < category.items.length; j++) {
                if (currentNumber === number) {
                    selectMenuItem(categories[i], j);
                    return;
                }
                currentNumber++;
            }
        }
        
        const invalidMessages: Record<string, string> = {
            vi: 'Số menu không hợp lệ. Vui lòng chọn lại.',
            ja: '無効なメニュー番号です。再度選択してください。',
            en: 'Invalid menu number. Please select again.',
            ne: 'अवैध मेनु नम्बर। कृपया फेरि छान्नुहोस्।'
        };
        addMessage(invalidMessages[currentLanguage] || invalidMessages.vi, 'bot');
    };

    const handleInput = async () => {
        const text = inputValue.trim();
        if (!text) return;

        const halfWidthText = text.replace(/[０-９]/g, (s) => 
            String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        );
        
        if (/^\d+$/.test(halfWidthText)) {
            const menuNumber = parseInt(halfWidthText);
            selectMenuByNumber(menuNumber);
            setInputValue('');
            return;
        }

        // ユーザーメッセージを追加
        addMessage(text, 'user');
        
        // キーワードマッチング（拡張版）を試行
        const lowerText = text.toLowerCase();
        const keywords: Record<string, Record<string, string[]>> = {
            salary: {
                vi: ['lương', 'bảng lương', 'tiền lương', 'sổ lương', 'lương tháng', 'tiền lương tháng', 'bảng lương tháng', 'lương tháng này', 'lương tháng trước'],
                ja: ['給与', '給与明細', '賃金', '賃金台帳', '給料', '給料明細', '給与明細書', '給与明細が欲しい', '給料の明細', '給与明細を取得', '給与明細をダウンロード'],
                en: ['salary', 'payslip', 'wage', 'pay', 'payroll', 'salary slip', 'payslip download', 'get payslip'],
                ne: ['तलब', 'तलबको बिल', 'वेतन', 'तलबको बिल चाहिए']
            },
            visa: {
                vi: ['visa', 'thẻ cư trú', 'gia hạn', 'gia hạn visa', 'gia hạn thẻ cư trú', 'thẻ cư trú sắp hết hạn', 'cập nhật visa'],
                ja: ['ビザ', '在留カード', '更新', 'ビザ更新', '在留カード更新', '在留カードの更新', 'ビザの更新について', '在留カードの期限'],
                en: ['visa', 'residence card', 'renewal', 'visa renewal', 'renew residence card', 'residence card expiring'],
                ne: ['भिसा', 'निवास कार्ड', 'नवीकरण', 'भिसा नवीकरण', 'निवास कार्ड नवीकरण']
            },
            attendance: {
                vi: ['nghỉ', 'muộn', 'chấm công', 'vắng mặt', 'đến muộn', 'nghỉ làm', 'nghỉ việc', 'đi muộn', 'sẽ muộn', 'có thể muộn'],
                ja: ['欠勤', '遅刻', '出勤', '休み', '遅刻する', '遅刻するかもしれない', '遅刻します', '欠勤します', '休みます', '遅れます'],
                en: ['absence', 'late', 'attendance', 'absent', 'will be late', 'might be late', 'going to be late', 'taking off'],
                ne: ['अनुपस्थिति', 'ढिलो', 'उपस्थिति', 'ढिलो हुनेछ', 'ढिलो हुन सक्छ']
            },
            shift: {
                vi: ['ca', 'ca làm việc', 'thay đổi ca', 'đổi ca', 'lịch làm việc'],
                ja: ['シフト', 'シフト変更', '労働時間', 'シフトを変更', 'シフト変更したい'],
                en: ['shift', 'work shift', 'change shift', 'shift change', 'working hours'],
                ne: ['कामको समय', 'शिफ्ट', 'शिफ्ट परिवर्तन']
            },
            system: {
                vi: ['cms', 'đăng nhập', 'mật khẩu', 'hệ thống', 'không đăng nhập được', 'quên mật khẩu'],
                ja: ['cms', 'ログイン', 'パスワード', 'システム', 'ログインできない', 'パスワードを忘れた', 'ログインできない'],
                en: ['cms', 'login', 'password', 'system', 'cannot login', 'forgot password'],
                ne: ['cms', 'लगइन', 'पासवर्ड', 'प्रणाली', 'लगइन गर्न सक्दैन']
            }
        };

        let matched = false;
        let matchedCategory: string | null = null;
        let matchedItemIndex = 0;

        // 各カテゴリのキーワードをチェック
        for (const [categoryKey, langKeywords] of Object.entries(keywords)) {
            const keywordsForLang = langKeywords[currentLanguage] || langKeywords.vi || langKeywords.ja;
            if (keywordsForLang && keywordsForLang.some(kw => lowerText.includes(kw))) {
                matchedCategory = categoryKey;
                matched = true;
                break;
            }
        }

        if (matched && matchedCategory) {
            // カテゴリが見つかった場合、最初のメニュー項目を選択
            selectMenuItem(matchedCategory, matchedItemIndex);
            matched = true;
        }

        // キーワードマッチングで判定できない場合、Gemini APIを使用
        if (!matched) {
            try {
                // ローディングメッセージを表示
                const loadingMessages: Record<string, string> = {
                    vi: 'Đang phân tích câu hỏi của bạn...',
                    ja: 'ご質問を分析しています...',
                    en: 'Analyzing your question...',
                    ne: 'तपाईंको प्रश्न विश्लेषण गर्दै...'
                };
                const loadingMsg = loadingMessages[currentLanguage] || loadingMessages.ja;
                addMessage(loadingMsg, 'bot');

                const geminiResponse = await analyzeUserQuery(text, currentLanguage, lang.categories);
                
                if (geminiResponse.categoryKey && geminiResponse.itemIndex !== undefined) {
                    // Geminiが適切なカテゴリとメニュー項目を提案した場合
                    const category = lang.categories[geminiResponse.categoryKey];
                    if (category && category.items[geminiResponse.itemIndex]) {
                        // ローディングメッセージを削除してから正しい回答を表示
                        setMessages(prev => prev.slice(0, -1));
                        selectMenuItem(geminiResponse.categoryKey, geminiResponse.itemIndex);
                    } else {
                        // ローディングメッセージを削除してからデフォルトメッセージを表示
                        setMessages(prev => prev.slice(0, -1));
                        showDefaultMessage();
                    }
                } else {
                    // Geminiがデフォルトメッセージを推奨した場合、または該当するカテゴリがない場合
                    setMessages(prev => prev.slice(0, -1));
                    
                    // フェーズ2: 該当しない質問に対して、より自然な回答を生成
                    if (geminiResponse.suggestedMessage) {
                        addMessage(geminiResponse.suggestedMessage, 'bot');
                    } else {
                        // Gemini APIで動的な回答を生成を試行
                        try {
                            const dynamicResponse = await generateResponse(text, currentLanguage);
                            if (dynamicResponse) {
                                const defaultActions: Action[] = [
                                    { 
                                        type: 'contact', 
                                        text: currentLanguage === 'vi' ? '📞 Liên hệ điều phối viên' :
                                            currentLanguage === 'ja' ? '📞 コーディネーターに連絡' :
                                            currentLanguage === 'en' ? '📞 Contact coordinator' :
                                            '📞 समन्वयकलाई सम्पर्क', 
                                        action: 'contactCoordinator' 
                                    },
                                    { 
                                        type: 'home', 
                                        text: currentLanguage === 'vi' ? '🏠 Về trang chủ' :
                                            currentLanguage === 'ja' ? '🏠 ホームに戻る' :
                                            currentLanguage === 'en' ? '🏠 Go home' :
                                            '🏠 घर फर्कनुहोस्', 
                                        action: 'goHome' 
                                    }
                                ];
                                addMessage(dynamicResponse, 'bot', defaultActions);
                            } else {
                                showDefaultMessage();
                            }
                        } catch (error) {
                            console.error('Error generating dynamic response:', error);
                            showDefaultMessage();
                        }
                    }
                }
            } catch (error) {
                console.error('Error analyzing query with Gemini:', error);
                // エラーが発生した場合はローディングメッセージを削除してデフォルトメッセージを表示
                setMessages(prev => prev.slice(0, -1));
                showDefaultMessage();
            }
        }
        
        setInputValue('');
    };

    const showDefaultMessage = () => {
        const notUnderstandMessages: Record<string, string> = {
            vi: 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Vui lòng chọn từ menu hoặc liên hệ với điều phối viên.',
            ja: '申し訳ございませんが、ご質問を理解できませんでした。メニューから選択するか、コーディネーターにお問い合わせください。',
            en: 'Sorry, I do not understand your question. Please select from the menu or contact the coordinator.',
            ne: 'माफ गर्नुहोस्, म तपाईंको प्रश्न बुझ्न सक्दिन। कृपया मेनुबाट छान्नुहोस् वा समन्वयकलाई सम्पर्क गर्नुहोस्।'
        };
        const defaultActions: Action[] = [
            { 
                type: 'contact', 
                text: currentLanguage === 'vi' ? '📞 Liên hệ điều phối viên' :
                    currentLanguage === 'ja' ? '📞 コーディネーターに連絡' :
                    currentLanguage === 'en' ? '📞 Contact coordinator' :
                    '📞 समन्वयकलाई सम्पर्क', 
                action: 'contactCoordinator' 
            },
            { 
                type: 'home', 
                text: currentLanguage === 'vi' ? '🏠 Về trang chủ' :
                    currentLanguage === 'ja' ? '🏠 ホームに戻る' :
                    currentLanguage === 'en' ? '🏠 Go home' :
                    '🏠 घर फर्कनुहोस्', 
                action: 'goHome' 
            }
        ];
        addMessage(notUnderstandMessages[currentLanguage] || notUnderstandMessages.ja, 'bot', defaultActions);
    };

    const getCategoryMenuItems = () => {
        const categories = Object.keys(lang.categories);
        const categoriesPerPage = 2;
        const startIndex = currentMenuPage * categoriesPerPage;
        const endIndex = Math.min(startIndex + categoriesPerPage, categories.length);
        
        let globalItemNumber = 1;
        for (let i = 0; i < startIndex; i++) {
            globalItemNumber += lang.categories[categories[i]].items.length;
        }
        
        const items: Array<{ categoryKey: string; itemIndex: number; itemNumber: number; itemText: string; categoryTitle: string }> = [];
        
        for (let i = startIndex; i < endIndex; i++) {
            const categoryKey = categories[i];
            const category = lang.categories[categoryKey];
            category.items.forEach((item, index) => {
                items.push({
                    categoryKey,
                    itemIndex: index,
                    itemNumber: globalItemNumber++,
                    itemText: item,
                    categoryTitle: category.title
                });
            });
        }
        
        return { items, hasNext: endIndex < categories.length, hasPrev: currentMenuPage > 0 };
    };

    const commandTexts: Record<string, string[]> = {
        vi: ['🏡 HOME', '🙋🏻‍♀️ CSKH', '📋 HƯỚNG DẪN'],
        ja: ['🏡 HOME', '🙋🏻‍♀️ 担当者', '📋 ガイド'],
        en: ['🏡 HOME', '🙋🏻‍♀️ Coordinator', '📋 GUIDE'],
        ne: ['🏡 HOME', '🙋🏻‍♀️ समन्वयक', '📋 गाइड']
    };

    const navTexts: Record<string, { prev: string; next: string }> = {
        vi: { prev: '← Trước', next: 'Tiếp →' },
        ja: { prev: '← 前', next: '次 →' },
        en: { prev: '← Previous', next: 'Next →' },
        ne: { prev: '← अघिल्लो', next: 'अर्को →' }
    };

    const menuData = getCategoryMenuItems();

  return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="language-selector">
                    <select value={currentLanguage} onChange={handleLanguageChange}>
                        <option value="vi">Tiếng Việt</option>
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                        <option value="ne">नेपाली</option>
                    </select>
      </div>
                <h1>{lang.title}</h1>
                <p>{lang.subtitle}</p>
                <div className="command-buttons">
                    <button className="command-button" onClick={() => handleAction('goHome')}>
                        {commandTexts[currentLanguage][0]}
                    </button>
                    <button className="command-button" onClick={() => handleAction('contactCoordinator')}>
                        {commandTexts[currentLanguage][1]}
                    </button>
                    <button className="command-button" onClick={() => handleAction('showGuide')}>
                        {commandTexts[currentLanguage][2]}
        </button>
                </div>
            </div>
            
            <div className="chat-messages">
                {showWelcome && (
                    <div className="welcome-message">
                        <h2>{lang.welcome.title}</h2>
                        <p>{lang.welcome.message}</p>
                        <p>
                            {currentLanguage === 'vi' ? 'Tôi có thể giúp bạn về:' :
                             currentLanguage === 'ja' ? '以下のことについてお答えできます：' :
                             currentLanguage === 'en' ? 'I can help you with:' :
                             'म तपाईंलाई यसबारे मद्दत गर्न सक्छु:'}
                        </p>
                        <ul>
                            {lang.welcome.services.map((service, index) => (
                                <li key={index}>{service}</li>
                            ))}
                        </ul>
                        <p style={{ marginTop: '15px' }}>{lang.welcome.instruction}</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div key={index}>
                        <div className={`message ${message.sender}`}>
                            <div className="message-content">{message.text}</div>
                        </div>
                        {message.sender === 'bot' && message.actions && message.actions.length > 0 && (
                            <div className="action-buttons">
                                {message.actions.map((action, actionIndex) => {
                                    const icon = action.text.split(' ')[0];
                                    const text = action.text.substring(action.text.indexOf(' ') + 1);
                                    return (
                                        <button
                                            key={actionIndex}
                                            className={`action-button ${action.type === 'contact' || action.type === 'link' ? 'primary' : 'secondary'}`}
                                            onClick={() => handleAction(action.action)}
                                        >
                                            <span className="action-button-icon">{icon}</span> {text}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

                {showWelcome && (
                    <div className="menu-card">
                        {menuData.items.map((item, index) => {
                            const isNewCategory = index === 0 || 
                                menuData.items[index - 1].categoryTitle !== item.categoryTitle;
                            return (
                                <div key={index}>
                                    {isNewCategory && <h3>{item.categoryTitle}</h3>}
                                    <div 
                                        className="menu-item" 
                                        onClick={() => selectMenuItem(item.categoryKey, item.itemIndex)}
                                    >
                                        <div className="menu-item-number">{item.itemNumber}</div>
                                        <div className="menu-item-text">{item.itemText}</div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="menu-navigation">
                            <button 
                                className="nav-button" 
                                disabled={!menuData.hasPrev}
                                onClick={() => setCurrentMenuPage(prev => prev - 1)}
                            >
                                {navTexts[currentLanguage].prev}
                            </button>
                            <button 
                                className="nav-button" 
                                disabled={!menuData.hasNext}
                                onClick={() => setCurrentMenuPage(prev => prev + 1)}
                            >
                                {navTexts[currentLanguage].next}
                            </button>
                        </div>
                    </div>
                )}

                {showLateForm && (
                    <div className="form-container">
                        <h3>
                            {currentLanguage === 'vi' ? 'Thông báo đến muộn/nghỉ làm' :
                             currentLanguage === 'ja' ? '遅刻・欠勤連絡' :
                             currentLanguage === 'en' ? 'Report Late/Absence' :
                             'ढिलो/अनुपस्थिति सूचना'}
                        </h3>
                        <div className="form-group">
                            <label className="form-label">
                                {currentLanguage === 'vi' ? 'Lý do' :
                                 currentLanguage === 'ja' ? '理由' :
                                 currentLanguage === 'en' ? 'Reason' :
                                 'कारण'}
                            </label>
                            <select className="form-select" id="lateReason">
                                <option value="">
                                    {currentLanguage === 'vi' ? 'Chọn lý do' :
                                     currentLanguage === 'ja' ? '理由を選択' :
                                     currentLanguage === 'en' ? 'Select reason' :
                                     'कारण छान्नुहोस्'}
                                </option>
                                <option value="illness">
                                    {currentLanguage === 'vi' ? 'Bệnh' :
                                     currentLanguage === 'ja' ? '病気' :
                                     currentLanguage === 'en' ? 'Illness' :
                                     'रोग'}
                                </option>
                                <option value="delay">
                                    {currentLanguage === 'vi' ? 'Tàu điện trễ' :
                                     currentLanguage === 'ja' ? '電車遅延' :
                                     currentLanguage === 'en' ? 'Train delay' :
                                     'ट्रेन ढिलो'}
                                </option>
                                <option value="other">
                                    {currentLanguage === 'vi' ? 'Khác' :
                                     currentLanguage === 'ja' ? 'その他' :
                                     currentLanguage === 'en' ? 'Other' :
                                     'अन्य'}
                                </option>
                            </select>
                        </div>
                        <div className="form-buttons">
                            <button 
                                className="form-button submit"
                                onClick={() => {
                                    const reason = (document.getElementById('lateReason') as HTMLSelectElement)?.value;
                                    if (reason) {
                                        setShowLateForm(false);
                                        const submitMessages: Record<string, string> = {
                                            vi: 'Cảm ơn bạn đã gửi thông báo. Điều phối viên sẽ liên hệ với bạn sớm nhất có thể.',
                                            ja: '連絡ありがとうございます。コーディネーターからできるだけ早くご連絡いたします。',
                                            en: 'Thank you for your report. The coordinator will contact you as soon as possible.',
                                            ne: 'सूचना पठाउनुभएकोमा धन्यवाद। समन्वयकले यथाशीघ्र तपाईंलाई सम्पर्क गर्नेछ।'
                                        };
                                        addMessage(submitMessages[currentLanguage] || submitMessages.vi, 'bot');
                                    }
                                }}
                            >
                                {currentLanguage === 'vi' ? 'Gửi' :
                                 currentLanguage === 'ja' ? '送信' :
                                 currentLanguage === 'en' ? 'Submit' :
                                 'पठाउनुहोस्'}
                            </button>
                            <button 
                                className="form-button cancel"
                                onClick={() => setShowLateForm(false)}
                            >
                                {currentLanguage === 'vi' ? 'Hủy' :
                                 currentLanguage === 'ja' ? 'キャンセル' :
                                 currentLanguage === 'en' ? 'Cancel' :
                                 'रद्द गर्नुहोस्'}
                            </button>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input-container">
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={lang.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleInput()}
                    />
                    <button className="send-button" onClick={handleInput}>➤</button>
                </div>
            </div>
      </div>
    );
}

export default App;
