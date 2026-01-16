import type { LanguageData } from './types';

export const languages: Record<string, LanguageData> = {
    vi: {
        title: "LABORO Chatbot",
        subtitle: "Hỗ trợ tự động",
        welcome: {
            title: "Xin chào!",
            message: "Bạn đang trò chuyện với tính năng robot hỗ trợ tự động của LABORO!",
            services: [
                "💰 Lương và bảng lương",
                "🛂 Visa và thẻ cư trú",
                "📅 Chấm công và nghỉ làm",
                "⏰ Ca làm việc",
                "💻 Hệ thống CMS"
            ],
            instruction: "Vui lòng chọn một trong các tùy chọn bên dưới hoặc nhập câu hỏi của bạn."
        },
        placeholder: "Nhập câu hỏi hoặc số menu...",
        categories: {
            salary: {
                title: "💰 LƯƠNG VÀ BẢNG LƯƠNG",
                items: [
                    "Lấy bảng lương",
                    "Sổ lương cho visa",
                    "Giấy khấu trừ thuế",
                    "Lương không đủ",
                    "Phí đi lại"
                ]
            },
            visa: {
                title: "🛂 VISA VÀ THẺ CƯ TRÚ",
                items: [
                    "Nộp thẻ cư trú",
                    "Gia hạn thẻ cư trú",
                    "Thẻ cư trú sắp hết hạn"
                ]
            },
            attendance: {
                title: "📅 CHẤM CÔNG VÀ NGHỈ LÀM",
                items: [
                    "Thông báo đến muộn/nghỉ làm",
                    "Số ngày làm việc không đủ",
                    "Hồ sơ chấm công sai"
                ]
            },
            shift: {
                title: "⏰ CA LÀM VIỆC",
                items: [
                    "Thay đổi ca làm việc",
                    "Giới hạn giờ làm việc"
                ]
            },
            system: {
                title: "💻 HỆ THỐNG",
                items: [
                    "Không thể đăng nhập CMS",
                    "Quên mật khẩu"
                ]
            },
            other: {
                title: "❓ KHÁC",
                items: [
                    "Gia hạn hợp đồng",
                    "Khấu trừ phụ thuộc",
                    "Xe buýt và địa điểm"
                ]
            }
        }
    },
    ja: {
        title: "LABORO チャットボット",
        subtitle: "自動サポート",
        welcome: {
            title: "こんにちは！",
            message: "LABOROの自動サポートロボットです。",
            services: [
                "💰 給与・給与明細",
                "🛂 ビザ・在留カード",
                "📅 出勤・欠勤",
                "⏰ シフト",
                "💻 CMSシステム"
            ],
            instruction: "下記のオプションから選択するか、ご質問を入力してください。"
        },
        placeholder: "質問またはメニュー番号を入力...",
        categories: {
            salary: {
                title: "💰 給与・給与明細",
                items: [
                    "給与明細を取得",
                    "ビザ更新用の賃金台帳",
                    "源泉徴収票",
                    "給与が足りない",
                    "交通費"
                ]
            },
            visa: {
                title: "🛂 ビザ・在留カード",
                items: [
                    "在留カードの提出",
                    "在留カードの更新",
                    "在留カードの期限が近い"
                ]
            },
            attendance: {
                title: "📅 出勤・欠勤",
                items: [
                    "遅刻・欠勤連絡",
                    "出勤日数が足りない",
                    "出勤記録が間違っている"
                ]
            },
            shift: {
                title: "⏰ シフト",
                items: [
                    "シフト変更",
                    "労働時間の上限"
                ]
            },
            system: {
                title: "💻 システム",
                items: [
                    "CMSにログインできない",
                    "パスワードを忘れた"
                ]
            },
            other: {
                title: "❓ その他",
                items: [
                    "契約更新",
                    "扶養控除",
                    "シャトルバス・派遣先"
                ]
            }
        }
    },
    en: {
        title: "LABORO Chatbot",
        subtitle: "Automated Support",
        welcome: {
            title: "Hello!",
            message: "You are chatting with LABORO's automated support robot!",
            services: [
                "💰 Salary and payslip",
                "🛂 Visa and residence card",
                "📅 Attendance and absence",
                "⏰ Work shift",
                "💻 CMS System"
            ],
            instruction: "Please select one of the options below or enter your question."
        },
        placeholder: "Enter question or menu number...",
        categories: {
            salary: {
                title: "💰 SALARY AND PAYSLIP",
                items: [
                    "Get payslip",
                    "Salary ledger for visa",
                    "Tax deduction certificate",
                    "Insufficient salary",
                    "Transportation fee"
                ]
            },
            visa: {
                title: "🛂 VISA AND RESIDENCE CARD",
                items: [
                    "Submit residence card",
                    "Renew residence card",
                    "Residence card expiring soon"
                ]
            },
            attendance: {
                title: "📅 ATTENDANCE AND ABSENCE",
                items: [
                    "Report late/absence",
                    "Insufficient work days",
                    "Incorrect attendance record"
                ]
            },
            shift: {
                title: "⏰ WORK SHIFT",
                items: [
                    "Change work shift",
                    "Working hours limit"
                ]
            },
            system: {
                title: "💻 SYSTEM",
                items: [
                    "Cannot login to CMS",
                    "Forgot password"
                ]
            },
            other: {
                title: "❓ OTHER",
                items: [
                    "Contract renewal",
                    "Dependent deduction",
                    "Shuttle bus and location"
                ]
            }
        }
    },
    ne: {
        title: "LABORO Chatbot",
        subtitle: "स्वचालित सहायता",
        welcome: {
            title: "नमस्ते!",
            message: "तपाईं LABORO को स्वचालित सहायता रोबोटसँग कुरा गर्दै हुनुहुन्छ!",
            services: [
                "💰 तलब र तलबको बिल",
                "🛂 भिसा र निवास कार्ड",
                "📅 उपस्थिति र अनुपस्थिति",
                "⏰ कामको समय",
                "💻 CMS प्रणाली"
            ],
            instruction: "कृपया तलका विकल्पहरू मध्ये एउटा छान्नुहोस् वा आफ्नो प्रश्न प्रविष्ट गर्नुहोस्।"
        },
        placeholder: "प्रश्न वा मेनु नम्बर प्रविष्ट गर्नुहोस्...",
        categories: {
            salary: {
                title: "💰 तलब र तलबको बिल",
                items: [
                    "तलबको बिल लिनुहोस्",
                    "भिसा को लागि तलबको बही",
                    "कर कटौती प्रमाणपत्र",
                    "तलब अपर्याप्त",
                    "यातायात शुल्क"
                ]
            },
            visa: {
                title: "🛂 भिसा र निवास कार्ड",
                items: [
                    "निवास कार्ड पेश गर्नुहोस्",
                    "निवास कार्ड नवीकरण",
                    "निवास कार्ड छिट्टै समाप्त हुने"
                ]
            },
            attendance: {
                title: "📅 उपस्थिति र अनुपस्थिति",
                items: [
                    "ढिलो/अनुपस्थिति सूचना",
                    "कामको दिन अपर्याप्त",
                    "गलत उपस्थिति रेकर्ड"
                ]
            },
            shift: {
                title: "⏰ कामको समय",
                items: [
                    "कामको समय परिवर्तन",
                    "कामको समय सीमा"
                ]
            },
            system: {
                title: "💻 प्रणाली",
                items: [
                    "CMS मा लगइन गर्न सक्दैन",
                    "पासवर्ड बिर्सनुभयो"
                ]
            },
            other: {
                title: "❓ अन्य",
                items: [
                    "सम्झौता नवीकरण",
                    "निर्भर कटौती",
                    "शटल बस र स्थान"
                ]
            }
        }
    }
};
