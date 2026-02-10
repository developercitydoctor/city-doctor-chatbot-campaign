import "./Footer.scss";
import { FaFacebook, FaTiktok } from "react-icons/fa";
import logo from "../../../assets/Logo/City-Doctor-Logo-White.svg";
import { useChatbot } from "../../../Context/ChatbotContext";
import { RiInstagramFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import tiktokIcon from "../../../assets/Icons/tiktok-icon.png";
import instagramIcon from "../../../assets/Icons/instagram-icon.png";
import facebookIcon from "../../../assets/Icons/facebook-icon.png";

import { FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    const { openChatbot } = useChatbot();
    return (
        <footer className="footer">
            <div className="footer_content">
                {/* Left Column - Logo and License */}
                <div className="footer_col footer_col_logo">
                    <div className="logo_section">
                        <img src={logo} alt="City Doctor" className="logo_image" />
                    </div>
                    {/* <p className="license_text">MOHAP License: 0QA5X607-080623</p> */}
                </div>

                {/* Middle Column - Contact Us */}
                <div className="footer_col footer_col_contact">
                    <h2 className="footer_heading">Contact Us</h2>
                    <div className="contact_details">
                        <p>Phone: +971 55 154 8684</p>
                        <p><button type="button" className="footer-link-btn" onClick={openChatbot}>Book Instantly Via WhatsApp</button></p>
                        <p>Email: <a href="mailto:support@citydoctor.ae">support@citydoctor.ae</a></p>
                    </div>
                </div>

                {/* Right Column - Follow Us */}
                <div className="footer_col footer_col_social">
                    <h2 className="footer_heading">Follow Us</h2>
                    <p className="social_description">Stay updated and connected:</p>
                    <div className="social_icons">
                        {/* <a href="https://www.linkedin.com/company/citydoctor" target="_blank" rel="noopener noreferrer" className="social_icon">
                            <img src={tiktokIcon} alt="TikTok" className="social_icon_image" />
                        </a> */}
                        <a href="https://www.linkedin.com/company/citydoctor" target="_blank" rel="noopener noreferrer" className="social_icon linkedin_icon">
                            <FaLinkedinIn className="social_icon_image" />
                        </a>
                        <a href="https://www.instagram.com/citydoctor.ae/?hl=en" target="_blank" rel="noopener noreferrer" className="social_icon">
                            <img src={instagramIcon} alt="Instagram" className="social_icon_image" />
                        </a>
                        <a href="https://www.facebook.com/citydoctor.ae/" target="_blank" rel="noopener noreferrer" className="social_icon">
                            <img src={facebookIcon} alt="Facebook" className="social_icon_image" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="footer_copyright">
                <div className="copyright_divider"></div>
                <p className="copyright_text">© 2026 City Doctor Healthcare LLC. All Rights Reserved.</p>
            </div>
        </footer>
    );
}