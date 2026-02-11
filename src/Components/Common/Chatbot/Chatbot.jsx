import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { sendChatbotToGoogleSheets } from "../../../Utils/emailService";
import { useChatbot } from "../../../Context/ChatbotContext";
import { services as SERVICE_LIST } from "../../../Constants/services";
import "./Chatbot.scss";
import chatbotAvatar from "../../../assets/Common/chatbot-icon.jpg";
import { BsChatRightTextFill } from "react-icons/bs";

const EMIRATES_OPTIONS = ["Dubai", "Abu Dhabi", "Sharjah"];


// Auto-open intervals in milliseconds
const AUTO_OPEN_INTERVALS = [10000, 30000, 60000, 120000, 300000, 600000, 900000, 1800000];
const CHATBOT_CLOSE_COUNT_KEY = 'chatbotCloseCount';
const CHATBOT_LAST_CLOSE_TIME_KEY = 'chatbotLastCloseTime';

export default function Chatbot() {
    const navigate = useNavigate();
    const { isOpen, setIsOpen, openChatbot, closeChatbot } = useChatbot();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messages, setMessages] = useState([]);
    const [nameInput, setNameInput] = useState("");
    const [hasAutoOpened, setHasAutoOpened] = useState(false);
    const [nameQuestionAsked, setNameQuestionAsked] = useState(false);
    const [urgentQuestionAsked, setUrgentQuestionAsked] = useState(false);
    const [urgentSubmitted, setUrgentSubmitted] = useState(false);
    const [serviceQuestionAsked, setServiceQuestionAsked] = useState(false);
    const [serviceSubmitted, setServiceSubmitted] = useState(false);
    const [emiratesQuestionAsked, setEmiratesQuestionAsked] = useState(false);
    const [emiratesSubmitted, setEmiratesSubmitted] = useState(false);
    const [phoneQuestionAsked, setPhoneQuestionAsked] = useState(false);
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [closeCount, setCloseCount] = useState(() => {
        if (typeof window !== "undefined") {
            return parseInt(localStorage.getItem(CHATBOT_CLOSE_COUNT_KEY) || '0');
        }
        return 0;
    });
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [chatData, setChatData] = useState({
        name: "",
        urgent: "",
        service: "",
        emirates: "",
        phone: "",
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
    });

    const chatContentRef = useRef(null);
    const nameInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const hasInitialized = useRef(false);

    // Step flow: name → urgent → service → emirates → phone → complete
    const getCurrentStep = () => {
        if (!chatData.name) return "name-input";
        if (!urgentSubmitted) return "urgent-input";
        if (!serviceSubmitted) return "service-input";
        if (!emiratesSubmitted) return "emirates-input";
        if (!phoneSubmitted) return "phone-input";
        if (isFormSubmitted || isSubmitting) return "complete";
        return "phone-input";
    };

    const currentStep = getCurrentStep();

    // Initialize messages on mount
    useEffect(() => {
        if (messages.length === 0 && !hasInitialized.current) {
            hasInitialized.current = true;
            setMessages([
                { type: "bot", content: "Hello! 👋 Welcome to City Doctor. I'm here to help you book medical services at your home, hotel, or office. How can I assist you today?", timestamp: new Date() },
            ]);
            setTimeout(() => {
                setMessages((prev) => [...prev, { type: "bot", content: "May I know your name?", timestamp: new Date() }]);
                setNameQuestionAsked(true);
            }, 2000 + Math.random() * 800);
        }
    }, [messages.length]);

    // Auto-open chatbot after 5 seconds (first visit only)
    useEffect(() => {
        const hasOpenedBefore = localStorage.getItem("chatbot-auto-opened");
        if (!hasOpenedBefore && !hasAutoOpened) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                setHasAutoOpened(true);
                localStorage.setItem("chatbot-auto-opened", "true");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [hasAutoOpened, setIsOpen]);

    // Auto-open at intervals if not submitted
    useEffect(() => {
        if (isFormSubmitted || isOpen) return;
        const storedCloseCount = parseInt(localStorage.getItem(CHATBOT_CLOSE_COUNT_KEY) || '0');
        const lastCloseTime = localStorage.getItem(CHATBOT_LAST_CLOSE_TIME_KEY);
        setCloseCount(storedCloseCount);

        let timer;
        if (lastCloseTime) {
            const timeSinceLastClose = Date.now() - parseInt(lastCloseTime);
            const intervalIndex = Math.min(storedCloseCount - 1, AUTO_OPEN_INTERVALS.length - 1);
            const currentInterval = AUTO_OPEN_INTERVALS[intervalIndex];
            if (timeSinceLastClose >= currentInterval) {
                setIsOpen(true);
            } else {
                const remainingTime = currentInterval - timeSinceLastClose;
                timer = setTimeout(() => setIsOpen(true), remainingTime);
            }
        } else if (storedCloseCount > 0) {
            const intervalIndex = Math.min(storedCloseCount - 1, AUTO_OPEN_INTERVALS.length - 1);
            const interval = AUTO_OPEN_INTERVALS[intervalIndex];
            timer = setTimeout(() => setIsOpen(true), interval);
        }
        return () => timer && clearTimeout(timer);
    }, [isOpen, isFormSubmitted, setIsOpen]);

    useEffect(() => {
        if (chatContentRef.current) {
            setTimeout(() => {
                if (chatContentRef.current) chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
            }, 100);
        }
    }, [messages, currentStep]);

    useEffect(() => {
        if (currentStep === "phone-input" && phoneInputRef.current && chatContentRef.current) {
            const timer = setTimeout(() => {
                phoneInputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);


    const calculateTypingDelay = (content) => {
        if (typeof content === "string") {
            const baseDelay = Math.min(Math.max(content.length * 100, 1500), 4000);
            return Math.round(baseDelay + (Math.random() * 1000 - 500));
        }
        return 2000 + Math.random() * 1000;
    };

    const addBotMessageWithTyping = (content, customDelay = null, onComplete = null) => {
        const delay = customDelay !== null ? customDelay : calculateTypingDelay(content);
        setMessages((prev) => [...prev, { type: "typing", content: "", timestamp: new Date() }]);
        setTimeout(() => {
            setMessages((prev) => prev.filter((msg) => msg.type !== "typing").concat({ type: "bot", content, timestamp: new Date() }));
            onComplete && setTimeout(onComplete, 100);
        }, delay);
    };

    const addAcknowledgment = (message, callback, delay = null) => {
        const ackDelay = delay !== null ? delay : Math.max(calculateTypingDelay(message) * 0.6, 800);
        addBotMessageWithTyping(message, ackDelay);
        setTimeout(() => callback?.(), ackDelay + 500);
    };

    const addUserMessage = (content) => {
        setMessages((prev) => [...prev, { type: "user", content, timestamp: new Date() }]);
    };

    const handlePhoneChange = useCallback((phone) => setChatData((prev) => ({ ...prev, phone })), []);

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (!nameInput.trim() || nameInput.trim().length < 2) return;
        const userName = nameInput.trim();
        setChatData((prev) => ({ ...prev, name: userName }));
        addUserMessage(userName);
        setNameInput("");
        setTimeout(() => {
            addAcknowledgment(`Nice to meet you, ${userName}! 😊`, () => {
                setTimeout(() => {
                    addBotMessageWithTyping("Do you need a doctor urgently?", null, () => setUrgentQuestionAsked(true));
                }, 1000 + Math.random() * 500);
            });
        }, 600 + Math.random() * 400);
    };

    const handleUrgentSelect = (answer) => {
        setChatData((prev) => ({ ...prev, urgent: answer }));
        setUrgentSubmitted(true);
        addUserMessage(answer);
        setTimeout(() => {
            addAcknowledgment(`Got it.`, () => {
                setTimeout(() => addBotMessageWithTyping("Which service do you need?", null, () => setServiceQuestionAsked(true)), 800);
            });
        }, 600 + Math.random() * 400);
    };

    const handleServiceSelect = (serviceTitle) => {
        setChatData((prev) => ({ ...prev, service: serviceTitle }));
        setServiceSubmitted(true);
        addUserMessage(serviceTitle);
        setTimeout(() => {
            addAcknowledgment("Thank you!", () => {
                setTimeout(() => addBotMessageWithTyping("Which emirate are you in?", null, () => setEmiratesQuestionAsked(true)), 800);
            });
        }, 600 + Math.random() * 400);
    };

    const handleEmiratesSelect = (emirate) => {
        setChatData((prev) => ({ ...prev, emirates: emirate }));
        setEmiratesSubmitted(true);
        addUserMessage(emirate);
        setTimeout(() => {
            addAcknowledgment("Perfect!", () => {
                setTimeout(() => {
                    addBotMessageWithTyping("📞 Please provide your phone number so our medical team can contact you.", null, () => setPhoneQuestionAsked(true));
                }, 800);
            });
        }, 600 + Math.random() * 400);
    };

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if (!chatData.phone || chatData.phone.length < 10) return;
        setPhoneSubmitted(true);
        addUserMessage(chatData.phone);
        setIsSubmitting(true);

        setTimeout(() => {
            addBotMessageWithTyping("Perfect! Let me process this for you...", 1500 + Math.random() * 500);
        }, 600 + Math.random() * 400);

        const dataToSend = {
            name: chatData.name,
            phone: chatData.phone,
            emirates: chatData.emirates || "",
            symptoms: chatData.service || "-",
            pageUrl: chatData.pageUrl,
        };

        sendChatbotToGoogleSheets(dataToSend)
            .then((result) => {
                if (result.success) {
                    setIsFormSubmitted(true);
                    setCloseCount(0);
                    localStorage.removeItem(CHATBOT_CLOSE_COUNT_KEY);
                    localStorage.removeItem(CHATBOT_LAST_CLOSE_TIME_KEY);

                    setTimeout(() => {
                        addBotMessageWithTyping(
                            <div className="chatbot-success-message">
                                <div className="success-icon">✅</div>
                                <h3>Thank you for your inquiry!</h3>
                                <p>Our medical team will contact you shortly to assist with booking your service.</p>
                                <p className="est-response-time">Est. Response Time: 2 Min</p>
                            </div>,
                            2000,
                            () => setTimeout(() => navigate("/thank-you"), 2500)
                        );
                    }, 1500 + Math.random() * 500);
                } else {
                    setTimeout(() => addBotMessageWithTyping("Something went wrong. Please try again or contact us directly."), 1200);
                }
            })
            .catch((error) => {
                console.error("Submission error:", error);
                setTimeout(() => addBotMessageWithTyping("Something went wrong. Please try again or contact us directly."), 1200);
            })
            .finally(() => setIsSubmitting(false));
    };

    const hasUnsavedInput = () => {
        if (nameInput.trim().length >= 2) return true;
        if (chatData.name && !urgentSubmitted) return true;
        if (chatData.urgent && !serviceSubmitted) return true;
        if (chatData.service && !emiratesSubmitted) return true;
        if (chatData.emirates && (chatData.phone?.length >= 10 || chatData.phone?.length > 0)) return true;
        return false;
    };

    const handleChatClose = () => {
        if (hasUnsavedInput() && !isFormSubmitted) {
            if (!window.confirm("You have unsaved information. Are you sure you want to close?")) {
                return;
            }
        }
        if (!isFormSubmitted) {
            const newCloseCount = closeCount + 1;
            setCloseCount(newCloseCount);
            localStorage.setItem(CHATBOT_CLOSE_COUNT_KEY, newCloseCount.toString());
            localStorage.setItem(CHATBOT_LAST_CLOSE_TIME_KEY, Date.now().toString());
        }
        closeChatbot();
    };

    const resetChat = () => {
        setChatData({ name: "", urgent: "", service: "", emirates: "", phone: "", pageUrl: typeof window !== "undefined" ? window.location.href : "" });
        setNameInput("");
        setNameQuestionAsked(false);
        setUrgentQuestionAsked(false);
        setUrgentSubmitted(false);
        setServiceQuestionAsked(false);
        setServiceSubmitted(false);
        setEmiratesQuestionAsked(false);
        setEmiratesSubmitted(false);
        setPhoneQuestionAsked(false);
        setPhoneSubmitted(false);
        setIsFormSubmitted(false);
        setCloseCount(0);
        localStorage.removeItem(CHATBOT_CLOSE_COUNT_KEY);
        localStorage.removeItem(CHATBOT_LAST_CLOSE_TIME_KEY);
        hasInitialized.current = false;
        setMessages([
            { type: "bot", content: "Hello! 👋 Welcome to City Doctor. I'm here to help you book medical services at your home, hotel, or office. How can I assist you today?", timestamp: new Date() },
        ]);
        setTimeout(() => {
            setMessages((prev) => [...prev, { type: "bot", content: "May I know your name?", timestamp: new Date() }]);
            setNameQuestionAsked(true);
        }, 2000 + Math.random() * 800);
    };

    return (
        <>
            {!isOpen && (
                <button onClick={openChatbot} className="chatbot-toggle-btn" aria-label="Open chat">
                    <BsChatRightTextFill className="chatbot-icon" aria-hidden="true" />
                </button>
            )}

            {isOpen && (
                <div className={`chatbot-container ${isFullScreen ? "chatbot-container--fullscreen" : ""}`}>
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <img src={chatbotAvatar} alt="Chatbot" />
                            </div>
                            <div className="chatbot-header-text">
                                <h3>City Doctor</h3>
                                <p>Available 24/7</p>
                            </div>
                        </div>
                        <div className="chatbot-header-actions">
                            <button
                                type="button"
                                onClick={() => setIsFullScreen((prev) => !prev)}
                                className="chatbot-expand-btn"
                                aria-label={isFullScreen ? "Exit full screen" : "Full screen"}
                            >
                                {isFullScreen ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                    </svg>
                                )}
                            </button>
                            <button onClick={handleChatClose} className="chatbot-close-btn" aria-label="Close chat">✕</button>
                        </div>
                    </div>

                    <div ref={chatContentRef} className="chatbot-messages">
                        {messages.map((message, index) => (
                            message.type === "typing" ? (
                                <div key={index} className="chatbot-message chatbot-message-bot">
                                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                                </div>
                            ) : (
                                <div key={index} className={`chatbot-message ${message.type === "user" ? "chatbot-message-user" : "chatbot-message-bot"}`}>
                                    <div className="message-bubble">
                                        {typeof message.content === "string" ? <p>{message.content}</p> : message.content}
                                    </div>
                                </div>
                            )
                        ))}

                        {currentStep === "name-input" && nameQuestionAsked && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-input-bubble">
                                    <form onSubmit={handleNameSubmit}>
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            placeholder="Enter your name"
                                            className="chatbot-input"
                                            autoFocus
                                        />
                                        <button type="submit" disabled={!nameInput.trim() || nameInput.trim().length < 2} className="chatbot-submit-btn">Send</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {currentStep === "urgent-input" && urgentQuestionAsked && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-options-bubble">
                                    <div className="options-row">
                                        <button type="button" className="option-btn" onClick={() => handleUrgentSelect("Yes")}>Yes</button>
                                        <button type="button" className="option-btn" onClick={() => handleUrgentSelect("No")}>No</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === "service-input" && serviceQuestionAsked && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-options-bubble">
                                    <div className="options-grid options-grid-services">
                                        {SERVICE_LIST.map((service) => (
                                            <button key={service.id} type="button" className="option-btn" onClick={() => handleServiceSelect(service.title)}>
                                                {service.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === "emirates-input" && emiratesQuestionAsked && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-options-bubble">
                                    <div className="options-row">
                                        {EMIRATES_OPTIONS.map((emirate) => (
                                            <button key={emirate} type="button" className="option-btn" onClick={() => handleEmiratesSelect(emirate)}>
                                                {emirate}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === "phone-input" && phoneQuestionAsked && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-input-bubble">
                                    <form onSubmit={handlePhoneSubmit}>
                                        <div ref={phoneInputRef} className="chatbot-phone-input-wrapper">
                                            <PhoneInput
                                                country={"ae"}
                                                value={chatData.phone}
                                                onChange={handlePhoneChange}
                                                inputProps={{ name: "phone", required: true, autoFocus: true }}
                                                inputStyle={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid rgba(0, 0, 0, 0.2)", backgroundColor: "white", color: "#111b21", paddingLeft: "50px", fontSize: "14px" }}
                                                buttonStyle={{ border: "none", backgroundColor: "transparent", borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}
                                                containerStyle={{ width: "100%" }}
                                            />
                                        </div>
                                        <button type="submit" disabled={!chatData.phone || chatData.phone.length < 10 || isSubmitting} className="chatbot-submit-btn">
                                            {isSubmitting ? "Sending..." : "Submit"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
