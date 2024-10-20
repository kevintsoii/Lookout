# **Lookout **

## **Project Overview**

**Lookout** is a real-time threat detection tool designed with Google Gemini and FetchAI uAgents. Lookout is a way home cameras to analyze live footage and focus on potential threats, cutting the amount of alerts that pose no danger. 

---

## **Features**

- **Real-time log updates** via polling or WebSocket for instant notifications.
- **Severity-based color-coded alerts**:
  - **Red:** Critical danger (e.g., fire, intruder)
  - **Yellow:** Warnings or less severe issues (e.g., smoke detection)
  - **Green:** All-clear status.
- **Responsive UI** with animations to highlight new alerts.
- Backend integration with API endpoints for fetching or pushing logs and new features dynamically.

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

### **3. Running the Program **

- npm run dev

- py backend/app.py

- py backend/agents/agents.py

--- 

## **Possible Use Cases**
- Detect any sort of danger such as crime, or assault
- Detect house fires, or floods
