System:
You are an expert game-design AI tasked with creating a 20-minute, web-based “Resourceful Graduate Challenge” simulation. Your goal is to screen for self-reliance: how well candidates independently seek, synthesize, and apply information with minimal hand-holding. Deliver a complete design specification (in JSON) covering environment layout, tasks, UI wireframes, logging/metrics, scoring rubrics, and dynamic AI-driven interactions.

User:
Design “Resourceful Graduate Challenge” with these requirements:

1. Simulation Overview
   • Title: “Resourceful Graduate Challenge”  
   • Duration: 15–20 minutes  
   • Target outcome: Identify top ~1% (10 out of 1,000) most self-reliant candidates  
   • Delivery: Single-page web app with multiple embedded “tools” (wiki, chat, code repo)

2. Digital Workspace Environment
   • Home dashboard with links to:
     – `Project Brief.pdf` (scattered key facts)  
     – Team Wiki (hierarchical pages, some dead-ends)  
     – Code Repository (simple code snippet with bugs)  
     – Chat widget (AI “manager” NPC)  
   • Hidden hint files (`FAQ_Guide.docx`, `Old_Project_Archive.zip`) that require exploration to uncover  
   • Search bar that indexes all documents; no upfront tutorial  

3. Layered Task Structure
   • Tier 1 – Lookup challenge  
     – Task: Summarize a key policy from `Project Brief.pdf` in one sentence  
   • Tier 2 – Guided problem  
     – Task: Debug a 5-line script in the repository using inline comments and wiki pages  
   • Tier 3 – Open-ended scenario  
     – Task: Draft a 3-slide presentation outline for a fictitious client, pulling data from at least three sources  
   • Task hints only available via “Help” button (logs a help request)

4. Data Logging & Metrics
   • Clickstream: every click, scroll, and navigation path  
   • Search queries: text, timestamps, results clicked  
   • Time-on-page per document or tool  
   • Help requests: count and context  
   • Chat interactions: full transcript, response times  

5. Scoring Rubric (Self-Reliance Index)
   • Exploratory score (0–100): breadth & depth of unique resources accessed  
   • Persistence score (0–100): time spent before first help request or give-up  
   • Efficiency score (0–100): tasks completed per minute without help  
   • Composite Self-Reliance Score = 0.4 × Exploratory + 0.3 × Persistence + 0.3 × Efficiency  

6. Dynamic AI-Driven Adaptation
   • NPC “Manager” (chatbot) that:
     – Acknowledges correct progress with subtle praise  
     – Offers progressively minimal hints upon repeated stalled attempts  
     – Escalates difficulty (e.g., fewer keywords in errors) if candidate flies through early tasks  
   • Branching narrative: success/failure on each tier unlocks different next steps  

7. Output Format
   Return a single JSON object with these top-level keys:
   ```json
   {
     "metadata": { … },
     "environment": { … },
     "documents": [ … ],
     "tasks": [ … ],
     "ui_wireframes": { … },
     "logging_spec": { … },
     "scoring_rubric": { … },
     "npc_scripts": { … },
     "adaptive_logic": { … }
   }
