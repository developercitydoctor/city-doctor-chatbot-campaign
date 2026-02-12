import "./ProcessSection.scss";
import { FaWhatsapp } from "react-icons/fa";
import { useChatbot } from "../../../Context/ChatbotContext";
import step1Image from "../../../assets/Icons/icon-6.png";
import step2Image from "../../../assets/Icons/icon-7.png";
import step3Image from "../../../assets/Icons/icon-8.png";

// import { FaWhatsapp } from "react-icons/fa";

const steps = [
  {
    id: 1,
    stepNumber: "1",
    image: step1Image,
    title: "WhatsApp or Chat",
    description: "Click the button to book instantly via WhatsApp and request a doctor visit."
  },
  {
    id: 2,
    stepNumber: "2",
    image: step2Image,
    title: "Share Your Location",
    description: "Send your address and preferred time. We confirm instantly."
  },
  {
    id: 3,
    stepNumber: "3",
    image: step3Image,
    title: "Doctor at Your Door",
    description: "A DHA-certified medical team arrives at your home, hotel or office in 30-60 mins"
  }
];

const ProcessSection = () => {
  const { openChatbot } = useChatbot();
  return (
    <section id="process" className="process-section section-container">
      <div className="process-wrapper">
        <h1 className="process-title">Relief Is 3 Steps Away</h1>
        <p className="section-description">
          No apps to download, no complicated portals, no waiting on hold. Just fast access to the best home visiting medical team exactly when you need it.
        </p>
        
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.id} className="step-card">
              <div className="step-image-wrapper">
                <div className="step-label">{step.stepNumber}</div>
                <div className="step-icon-container">
                  <img src={step.image} alt={step.title} className="step-image" />
                </div>
              </div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="whatsapp-booking-wrapper">
          <button type="button" className="btn whatsapp-btn" onClick={openChatbot}>
            <FaWhatsapp className="chatbot-icon-btn" aria-hidden="true" />
            Book Instantly Via WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
