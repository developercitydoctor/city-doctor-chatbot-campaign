import "./ServicesSection.scss";
import { FaWhatsapp } from "react-icons/fa";
import { useChatbot } from "../../../Context/ChatbotContext";
import service1 from "../../../assets/Services/image-1.webp";
import service2 from "../../../assets/Services/image-2.webp";
import service3 from "../../../assets/Services/image-3.webp";
import service4 from "../../../assets/Services/image-4.webp";
import service5 from "../../../assets/Services/image-5.webp";
import service6 from "../../../assets/Services/image-6.webp";
import service7 from "../../../assets/Services/image-7.webp";
import service8 from "../../../assets/Services/image-8.webp";
import service9 from "../../../assets/Services/image-9.webp";
import service10 from "../../../assets/Services/image-10.webp";

// import { FaWhatsapp } from "react-icons/fa";

const services = [
  {
    id: 1,
    image: service1,
    title: "Fever & Flu",
    description: "Fever, body pain, infections"
  },
  {
    id: 2,
    image: service2,
    title: "UTI Symptoms",
    description: "Burning urination & lower pain"
  },
  {
    id: 3,
    image: service3,
    title: "Food Poisoning & Diarrhea",
    description: "Stomach infection & loose motions"
  },
  {
    id: 4,
    image: service4,
    title: "Headache & Migraine",
    description: "Severe headache & light sensitivity"
  },
  {
    id: 5,
    image: service5,
    title: "Nausea & Vomiting",
    description: "Vomiting, nausea & weakness"
  },
  {
    id: 6,
    image: service6,
    title: "Period Pain & PMS",
    description: "Menstrual pain & PMS symptoms"
  },
  {
    id: 7,
    image: service7,
    title: "Cough & Congestion",
    description: "Chest congestion & breathing issues"
  },
  {
    id: 8,
    image: service8,
    title: "Rash & Allergies",
    description: "Skin rashes, itching & reactions"
  },
  {
    id: 9,
    image: service9,
    title: "Kids Fever, Vomiting & Rashes",
    description: "Fever, vomiting & skin rashes in kids"
  },
  {
    id: 10,
    image: service10,
    title: "Ear Pain & Wax",
    description: "Ear infection & sharp pain"
  }
];

const ServicesSection = () => {
  const { openChatbot } = useChatbot();
  return (
    <section id="services" className="services-section">
      <div className="services-wrapper">
        <h1 className="section-title">We Treat You Where You<br/> Are Comfortable</h1>
        <p className="section-description">
        Proper diagnosis and the right treatment plan at your location. We also provide extended care including lab tests, blood tests, IV drips, nebulization, and more at home.
        </p>
        
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="service-card"
            >
              <div className="service-image-wrapper">
                <img src={service.image} alt={service.title} className="service-image" />
              </div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
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

export default ServicesSection;
