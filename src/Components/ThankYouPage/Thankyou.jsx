import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ThankYou.css";
import useIsMobile from "../../Utils/useIsMobile";
import Helmet from "../../General/Helmet";
import bannerImage from "../../assets/Banners/Landing-Page-Banner.png";
import mobileBannerImage from "../../assets/Banners/mobile-banner.jpg";

const WHATSAPP_URL = "https://wa.me/971551548684";
const THANKYOU_FROM_CHATBOT_KEY = "thankyou_from_chatbot";
const THANKYOU_SYMPTOMS_KEY = "thankyou_symptoms";

function buildWhatsAppLink(symptoms) {
    const symptomsText = Array.isArray(symptoms) && symptoms.length > 0
        ? symptoms.join(", ")
        : "Medical service inquiry";
    const message = `Hi,\nI need a doctor home visit please.\n\nSymptoms: ${symptomsText}`;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

// Auto-redirect: same-tab works reliably (window.open from timer is blocked by popup blockers)
function redirectToWhatsApp(whatsappLink) {
    if (typeof window !== "undefined" && whatsappLink) {
        window.location.href = whatsappLink;
    }
}

export default function Thankyou() {
    const isMobile = useIsMobile(768);
    const location = useLocation();
    const fromChatbotFirstLoad = location.state?.fromChatbot === true;
    const [refreshedSymptoms, setRefreshedSymptoms] = useState(() => {
        if (location.state?.fromChatbot) return null;
        try {
            if (typeof window !== "undefined" && sessionStorage.getItem(THANKYOU_FROM_CHATBOT_KEY) === "1") {
                const s = sessionStorage.getItem(THANKYOU_SYMPTOMS_KEY);
                return s ? JSON.parse(s) : [];
            }
        } catch { /* ignore */ }
        return null;
    });

    const symptoms = fromChatbotFirstLoad ? (location.state?.symptoms || []) : (refreshedSymptoms || []);
    const whatsappLink = buildWhatsAppLink(symptoms);
    const [countdown, setCountdown] = useState(5);
    const showRedirectCountdown = fromChatbotFirstLoad;
    const showOnlyWhatsAppButton = !fromChatbotFirstLoad && refreshedSymptoms !== null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (fromChatbotFirstLoad) {
            sessionStorage.setItem(THANKYOU_FROM_CHATBOT_KEY, "1");
            sessionStorage.setItem(THANKYOU_SYMPTOMS_KEY, JSON.stringify(location.state?.symptoms || []));
        }
    }, [fromChatbotFirstLoad, location.state?.symptoms]);

    useEffect(() => {
        if (refreshedSymptoms !== null) {
            sessionStorage.removeItem(THANKYOU_FROM_CHATBOT_KEY);
            sessionStorage.removeItem(THANKYOU_SYMPTOMS_KEY);
        }
    }, [refreshedSymptoms]);

    // After 5 sec countdown, redirect to WhatsApp (same-tab so it is not blocked by popup blockers)
    useEffect(() => {
        if (!showRedirectCountdown) return;
        if (countdown <= 0) {
            redirectToWhatsApp(whatsappLink);
            return;
        }
        const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [showRedirectCountdown, countdown, whatsappLink]);

    return (
        <>
            <Helmet title="City Doctor | Thank You" />
            <div className="thankyou-hero">
                <div className="thankyou-banner-background">
                    <img
                        className="thankyou-banner-image"
                        src={isMobile ? mobileBannerImage : bannerImage}
                        alt="Thank You"
                    />
                </div>
                <div className="thankyou-hero-content">
                    <h1 className="thankyou-content-title">Thank You</h1>
                    <p className="thankyou-content-description">We'll get back to you soon.</p>
                    {showRedirectCountdown && (
                        <div className="thankyou-redirect-glass">
                            <p className="thankyou-redirect-text">You are being redirected to City Doctor WhatsApp...</p>
                            <p className="thankyou-countdown">Redirecting in <span className="thankyou-countdown-number">{countdown}</span> sec</p>
                            {countdown <= 0 && (
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="thankyou-whatsapp-link">
                                    Open WhatsApp
                                </a>
                            )}
                        </div>
                    )}
                    {showOnlyWhatsAppButton && (
                        <div className="thankyou-redirect-glass">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="thankyou-whatsapp-link">
                                Open WhatsApp
                            </a>
                        </div>
                    )}
                    <a href="/">
                        <button type="button" className="btn primary-btn thankyou-content-button">
                            Back To Home
                        </button>
                    </a>
                </div>
            </div>
        </>
    );
}
