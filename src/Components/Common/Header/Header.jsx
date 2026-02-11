import React, { useEffect, useState } from 'react'
import "./Header.scss"
import logoWhite from "../../../assets/Logo/City-Doctor-Logo.avif"
import { useLocation } from 'react-router-dom'
import { BsChatRightTextFill } from "react-icons/bs";
import { useChatbot } from '../../../Context/ChatbotContext'

export default function Header(){
    const location = useLocation()
    const { openChatbot } = useChatbot()
    const [ isSticky, setIsSticky ] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if(location.pathname === "/thank-you" || location.pathname !== "/") {
                setIsSticky(true)
            } else if(window.scrollY > 100) {
                setIsSticky(true)
            } else {
                setIsSticky(false)
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [location.pathname]);

    return (
        <nav className='navbar-container'>
            <div className={`navbar ${isSticky ? "sticky" : ""} ${location.pathname === "/thank-you" ? "thank-you-header" : ""}`}>
                <div className="logo-div">
                    <a href="/" className="logo-link">
                        <img src={logoWhite} alt="City Doctor Logo" className="logo" />
                    </a>
                </div>

                {location.pathname !== "/thank-you" && (
                    <div className="call-div-right">
                        <button type="button" className="whatsapp-button" onClick={openChatbot} aria-label="WhatsApp">
                            <BsChatRightTextFill className="chatbot-icon-btn" aria-hidden="true" />
                            <span className="whatsapp-number">WhatsApp</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}