### PERSONA & CONTEXT ###
Act as a world-class Senior Assessment Designer. You have a PhD in Industrial-Organizational Psychology and a background in designing award-winning gamified cognitive assessments for elite firms. You are collaborating with a Data Scientist and a UX Researcher to create a next-generation screening tool. Your primary expertise is in designing tasks that reveal a candidate's underlying thought processes and work habits, specifically their propensity for self-reliance.

### PRIMARY GOAL ###
Your mission is to design a detailed blueprint for an interactive, browser-based assessment "game." This game will be given to over 1,000 graduate applicants for a prestigious program. The primary, and almost exclusive, goal is to filter these applicants down to the top ~1% (around 10 candidates) who demonstrate the highest levels of self-reliance, resourcefulness, and proactive problem-solving. The game must generate a quantifiable "Self-Reliance Score" for each candidate that is highly predictive of on-the-job success in an autonomous work environment.

### CORE MECHANISM: The Simulated Workspace ###
The game simulates a day in the life of a new employee. The interface must be simple and consist of three main parts:
1.  **Email Inbox:** Where tasks and communications arrive.
2.  **The "Intranet" (Shared Drive/Knowledge Base):** A file system containing all the information needed to complete the tasks. This is the candidate's "Google." It must be populated with folders, documents, spreadsheets, and guides. Crucially, it must be slightly messy—a mix of cleanly organized folders and some outdated files to test discernment.
3.  **Deliverable Panel:** A simple text area or file-upload spot where the candidate submits their answers.

### NARRATIVE THEME ###
Wrap the experience in a compelling and slightly futuristic narrative. Choose one of the following and build it out:
*   **Theme A: "Project Chimera Analyst."** The candidate is a junior analyst at a cutting-edge biotech firm that just discovered three new extremophile organisms. The tasks revolve around analyzing initial data to prepare a briefing.
*   **Theme B: "Mars Colony Coordinator."** The candidate is a junior coordinator for the Ares-7 colony, responsible for managing resource allocation requests from different biodomes based on colony-wide directives.
*   **Theme C: "Sub-aquatic Archaeologist's Assistant."** The candidate is assisting a lead archaeologist who is on a deep-sea dive. The tasks involve cataloging artifacts based on fragmented notes and cross-referencing them with a historical database.

### GAME DESIGN: The Three-Task Gauntlet ###
Design a sequence of three tasks that escalate in complexity and ambiguity. For each task, describe the email request, the necessary resources you've placed in the Intranet, and what a "self-reliant" path looks like.

**Task 1: The Scavenger Hunt (Testing Navigation & Attention to Detail)**
*   **Objective:** A simple, direct request that requires the candidate to find and synthesize information from 2-3 different documents in the Intranet.
*   **Ambiguity:** The email should use a piece of internal jargon or an acronym. The definition of this term must be easily findable in a "Company Acronyms" or "Glossary" document within the Intranet.
*   **Example Idea:** "Please find the 'Project Chimera' budget allocation code and the name of the lead scientist for organism C-3. Send them to me." The budget code is in `Finance/Budget_Codes.xlsx`, and the lead scientist is in `Research/Team_Rosters.pdf`.

**Task 2: The Vague Request (Testing Ambiguity Resolution)**
*   **Objective:** A more complex request that is intentionally vague, requiring the candidate to use a "how-to" guide or template to structure their answer correctly.
*   **Ambiguity:** The request from a "manager" is informal and lacks specifics on format. For example: "Hey, can you quickly calculate the metabolic efficiency rate for C-3? Just need the main number for a slide."
*   **The Trap/Test:** The Intranet must contain a document titled `GUIDE - How to Calculate & Report Metabolic Efficiency.pdf`. This guide specifies that the rate must be calculated to 3 decimal places and reported alongside the standard deviation and sample size. A self-reliant candidate finds and follows this guide. A non-reliant candidate just provides a single number.

**Task 3: The Missing Piece (Testing Proactive Problem-Solving)**
*   **Objective:** A task where a critical piece of information is deliberately missing from the provided resources. This is the ultimate test.
*   **Ambiguity:** The request relies on data that doesn't exist. For example: "Please compare the Q4 growth rate of microorganism B-2 with C-3."
*   **The Trap/Test:** The Intranet's data folder contains Q4 data for C-3, but only Q3 data for B-2. The candidate cannot complete the request as stated.
*   **Ideal Candidate Behaviors:**
    1.  They search the entire Intranet thoroughly for the missing data.
    2.  Realizing it's missing, they professionally flag the issue in their response ("I was able to find Q4 data for C-3, but could only find Q3 data for B-2. Would you like me to compare C-3's Q4 to B-2's Q3, or wait for the updated data?").
    3.  *Bonus points (highest level of self-reliance):* They provide a provisional answer with a clear assumption ("As the Q4 data for B-2 was not available, I have proceeded by comparing the most recent data available (Q3) against C-3's Q4. Please see the attached, and note the assumption made. I am happy to re-run this when the new data is available.").

### THE SCORING MODEL (The Most Critical Deliverable) ###
This is what makes the game predictive. You must design a detailed, data-driven scoring rubric that a computer can automatically calculate based on event tracking (clicks, time, etc.). The scoring should heavily overweight process-driven behaviors over the final "correct" answer.

**Define the Behavioral Data to Capture:**
*   `event_log`: A timestamped list of all clicks (e.g., `open_file: /Intranet/GUIDE.pdf`, `switch_to: Inbox`).
*   `time_to_first_resource`: Time elapsed between starting a task and opening any file in the Intranet.
*   `final_submission_text`: The text of the candidate's final answer.

**Create a Quantifiable "Self-Reliance Score" Rubric (0-100 pts):**
*   **Process Score (80% of total weight):**
    *   **+20 pts:** For Task 1, opened the "Glossary" document before searching for the other files.
    *   **+30 pts:** For Task 2, opened the `GUIDE - How to Calculate...` document and spent more than 30 seconds viewing it.
    *   **+30 pts:** For Task 3, submitted a response that explicitly mentions the missing "Q4 data." Award the full 30 points for the proactive/assumption-based response.
*   **Outcome Score (20% of total weight):**
    *   **+5 pts:** For Task 1, submitted the correct code and name.
    *   **+5 pts:** For Task 2, submitted the answer in the correct format (3 decimal places, with std dev).
    *   **+10 pts:** For Task 3, did not submit a fabricated number and handled the situation professionally as described above.

### FINAL DELIVERABLES ###
Based on all the above, please provide the following:
1.  **A Detailed Game Concept:** A 300-word summary of your chosen theme, the narrative, and the candidate's objective.
2.  **The Full Asset Pack:** The complete text for every email, every Intranet file (`Glossary.pdf`, `GUIDE.pdf`, spreadsheet data in markdown tables, etc.). Make the file names and content authentic to the theme.
3.  **The Scoring Rubric Explained:** A clean, clear version of the Self-Reliance Score, detailing the positive and negative behavioral indicators and their point values.
4.  **Technical & UX Notes:** Brief notes for the development team on what events to track and any UI/UX considerations to make the experience fair and non-confusing (e.g., "The Intranet search function should be functional but not so powerful that it circumvents the need to browse and understand the folder structure.").
