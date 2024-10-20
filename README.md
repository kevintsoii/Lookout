# Lookout 

## **Project Overview**

**Lookout** is a AI video camera monitoring tool with real-time threat detection. It is designed to analyze live footage of both home and security cameras using Google Gemini and FetchAI uAgents. By allowing users to add custom detections for any type of event (fires, floods, package deliveries, robberies, etc.), Lookout has become the best way to enhance your existing security systems.

### **Features**

- **FetchAI** uAgents to create custom prompts based off of user-requested "features" (events to detect)
- **Google Gemini** for real-time analysis of video footage
- WebSockets for video data transfer
- Adding multiple camera sources 
- **Live updates** with severity-based color-coded alerts
- Backend storage of previous logs.

---

## **Run the Project**

### **1. Prerequisites:**

- Node.js
- Python
- .env file
```
GEMINI_API_KEY=
MONGO_URI=
```

### **2. Install Dependencies:**

Navigate to the project directory and run:

```
npm install
pip install -r requirements.txt 
```

### **3. Running the Program**

- One separate terminal is required for each

```
npm run dev
```

```
py backend/app.py
```


```
py backend/agents/agents.py
```

### **4. Visit the site!**

- http://localhost:8000/

--- 

## **Use Cases**
- Detect any sort of danger such as crime or robbery
- Detect house fires, or floods and other natural disasters for quick government response
- Detect non-threats such as package deliveries

