# Lookout 

## **Project Overview**

**Lookout** is a real-time threat detection tool designed with Google Gemini and FetchAI uAgents. Lookout is a way home cameras to analyze live footage and focus on potential threats, cutting the amount of alerts that pose no danger. 

---

## **Features**

- **FetchAI** uAgents that fetch new prompts from user created features...
- ... In combination with real-time analyzation of threats with **Google Gemini** 
- Ability to add multiple media / camera sources 
- **Concurrent log updates** with Severity-based color-coded alerts
- Backend integration with API endpoints for fetching or pushing logs and new features dynamically.
- **Responsive UI** with animations to highlight new alerts.


---

## **Instructions to Run the Project**

### **1. Prerequisites:**

- Node.js
- Python
- Socket.io 

### **2. Install Dependencies:**

Navigate to the project directory and run:

- npm install

- pip install flask

- pip install uagents

- pip install -r requirements.txt 

### **3. Running the Program**

- npm run dev

- py backend/app.py

- py backend/agents/agents.py

--- 

## **Possible Use Cases**
- Detect any sort of danger such as crime, or assault
- Detect house fires, or floods
