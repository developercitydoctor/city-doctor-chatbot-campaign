import "./WhyChooseUsSection.scss";
import { FaWhatsapp } from "react-icons/fa";
import { useChatbot } from "../../../Context/ChatbotContext";
import heroImage from "../../../assets/Images/image-1.png";
import icon1 from "../../../assets/Icons/icon-1.png";
import icon2 from "../../../assets/Icons/icon-2.png";
import icon3 from "../../../assets/Icons/icon-3.png";
import icon4 from "../../../assets/Icons/icon-4.png";
import icon5 from "../../../assets/Icons/icon-5.png";

import chatbotIcon from "../../../assets/Common/chatbot-icon-white.png";

const features = [
  {
    id: 1,
    icon: icon1,
    title: "Licensed & Safe",
    description: "All staff are DHA/MOH licensed and strictly vetted."
  },
  {
    id: 2,
    icon: icon2,
    title: "24/7 Doctor at Home",
    description: "Day or night, we are ready to visit you anytime."
  },
  {
    id: 3,
    icon: icon3,
    title: "Faster Than Clinics",
    description: "Doctor ETA within 30-60 minutes. No waiting rooms."
  },
  {
    id: 4,
    icon: icon4,
    title: "Multilingual Team",
    description: "Doctors speak English, Arabic, Russian, Hindi and Urdu."
  },
  {
    id: 5,
    icon: icon5,
    title: "Trusted by 10,000+ Families",
    description: "Reliable care across Dubai and the UAE."
  }
];

const WhyChooseUsSection = () => {
  const { openChatbot } = useChatbot();
  return (
    <section id="why-choose-us" className="why-choose-us-section section-container">
      <div className="why-choose-us-wrapper">
        <div className="why-choose-us-content">
          <div className="hero-image-container">
            <img src={heroImage} alt="City Doctor Hero" className="hero-image" />
          </div>
          <div className="features-container">
            <h1 className="section-title">Why UAE Residents Trust Us More Than Clinics.</h1>
            <div className="features-list">
              {features.map((feature) => (
                <div key={feature.id} className="feature-item">
                  <div className="feature-icon-wrapper">
                    <img src={feature.icon} alt={feature.title} className="feature-icon" />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="whatsapp-booking-wrapper">
              <button type="button" className="btn primary-btn" onClick={openChatbot}>
                <img src={chatbotIcon} alt="Book Instantly Via WhatsApp" className="btn-icon" />
                Book Instantly Via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
