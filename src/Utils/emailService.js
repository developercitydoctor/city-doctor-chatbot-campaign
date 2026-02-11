import { getAttributionData, generateLeadId } from "./attribution";

// Google Apps Script Web App URL - Replace with your deployed web app URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrZFzuHdbfIu0QICDoyxGnP7CMwawUzA12ZhEABMh_2AmdnYK_NHuwPmrPON8oVXIy/exec";

// Campaign name for this project (ChatBot Campaign only)
const CAMPAIGN_NAME = "ChatBot Campaign";

/**
 * Sends chatbot lead data to Google Sheets
 * Sheet columns: Lead ID | Date & Time | Name | Phone Number | Emirates | Symptoms | Campaign Name | Lead Status | Conversion Sent | gclid | fbclid | Remarks
 * @param {Object} chatData - Chatbot data object
 * @param {string} chatData.name - User's name
 * @param {string} chatData.phone - User's phone number
 * @param {string} chatData.emirates - Emirates (Dubai, Abu Dhabi, Sharjah)
 * @param {string} chatData.symptoms - Symptoms or health concern
 * @param {string} chatData.pageUrl - Page URL (optional)
 * @returns {Promise<Object>} - Returns { success: boolean, error? }
 */
export const sendChatbotToGoogleSheets = async (chatData) => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
        console.warn("Google Sheets integration not configured. Skipping...");
        return { success: false, error: "Google Sheets URL not configured" };
    }

    const attribution = getAttributionData() || {};
    const leadId = chatData.leadId || generateLeadId();

    const dataToSend = {
        leadId,
        name: chatData.name || "",
        phone: chatData.phone || "",
        emirates: chatData.emirates || "",
        symptoms: chatData.symptoms || "",
        campaignName: CAMPAIGN_NAME,
        leadStatus: "New",
        conversionSent: "No",
        gclid: attribution.gclid || "",
        fbclid: attribution.fbclid || "",
        remarks: "",
    };

    try {
        // Use text/plain to avoid CORS preflight; Apps Script parses JSON from body
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(dataToSend),
        });
        const text = await response.text();
        if (!response.ok) {
            console.error("Google Sheets error:", response.status, text);
            return { success: false, error: text || response.statusText };
        }
        let result;
        try {
            result = text ? JSON.parse(text) : {};
        } catch (_) {
            result = { message: text };
        }
        if (result.success === false) {
            console.error("Google Sheets returned error:", result.error || result);
            return { success: false, error: result.error || result.message };
        }
        console.log("Chatbot lead saved to Google Sheets successfully");
        return { success: true };
    } catch (error) {
        console.error("Failed to save chatbot data:", error);
        return { success: false, error };
    }
};
