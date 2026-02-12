import "./HomeHero.scss";
import bannerImage from "../../../assets/Banners/Landing-Page-Banner.png";
import mobileBannerImage from "../../../assets/Banners/mobile-banner.jpg";
import { IoMdStar } from "react-icons/io";
import icon11 from "../../../assets/Icons/icon-11.png";
import icon12 from "../../../assets/Icons/icon-12.png";
import icon13 from "../../../assets/Icons/icon-13.png";
import useIsMobile from "../../../Utils/useIsMobile";
import { useChatbot } from "../../../Context/ChatbotContext";
import { FaWhatsapp } from "react-icons/fa";


export default function HomeHero() {
  const isMobile = useIsMobile(768);
  const { openChatbot } = useChatbot();

  return (
    <>
      <div className="home-hero">
        <div className="banner-background">
          <img
            className="banner-image"
            src={isMobile ? mobileBannerImage : bannerImage}
            alt="Doctor At Your Doorstep"
          />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Doctor At Your Doorstep In 30 Mins</h1>

          <p className="hero-description">
            Skip the traffic and waiting rooms. DHA-Licensed Doctors & Nurses are on their way to your home, hotel, or office. 24/7.
          </p>

          <div className="hero-stats">
            <div className="stat-button tertiary-btn">
              <div className="stat-value">50K+</div>
              <div className="stat-label">Patients Covered</div>
            </div>
            <div className="stat-button tertiary-btn">
              <div className="stat-value">100+</div>
              <div className="stat-label">Medical Staffs</div>
            </div>
            <div className="stat-button tertiary-btn">
              <div className="stat-value">4.9 <IoMdStar className="star-icon" /></div>
              <div className="stat-label">1,200+ Google Reviews</div>
            </div>
          </div>

          <div className="hero-buttons">
            <button type="button" className="btn whatsapp-btn" onClick={openChatbot}>
              <FaWhatsapp className="chatbot-icon-btn" aria-hidden="true" />
              Book Instantly Via WhatsApp
            </button>
          </div>
        </div>
      </div>

      <div className="hero-features-section">
        <div className="feature-bar">
          <div className="feature-icon-div">
            <img src={icon11} alt="DHA-Certified" className="feature-icon" />
          </div>
          <span className="feature-text">DHA-Certified Medical Team</span>
        </div>
        <div className="feature-bar">
          <div className="feature-icon-div">
            <img src={icon12} alt="Trusted" className="feature-icon" />
          </div>
          <span className="feature-text">Trusted by 10,000+ Families</span>
        </div>
        <div className="feature-bar">
          <div className="feature-icon-div">
            <img src={icon13} alt="24/7" className="feature-icon" />
          </div>
          <span className="feature-text">24/7 Doctors at Your Doorstep</span>
        </div>
      </div>

      <div className="hero-stats-mobile">
        <div className="stat-button tertiary-btn">
          <div className="stat-value">50K+</div>
          <div className="stat-label">Patients<br /> Covered</div>
        </div>
        <div className="stat-button tertiary-btn">
          <div className="stat-value">100+</div>
          <div className="stat-label">Medical<br /> Staffs</div>
        </div>
        <div className="stat-button tertiary-btn">
          <div className="stat-value">4.9 <IoMdStar className="star-icon" /></div>
          <div className="stat-label">1,200+ Google Reviews</div>
        </div>
      </div>
    </>
  );
}
