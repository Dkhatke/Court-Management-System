
 Court Management System

A Court Management System built using Java Servlets and an embedded Jetty server to manage court-related information such as courts, judges, lawyers, clients, cases, hearings, and judgements.

The system provides a simple web-based dashboard that allows administrators to manage and search legal records efficiently.


---

🚀 Features

📁 Manage Courts

👩‍⚖️ Manage Judges

👨‍💼 Manage Lawyers

👥 Manage Clients

📄 Manage Cases

📅 Manage Hearings

🧾 Manage Judgements

🔍 Search functionality in the admin dashboard

🌐 REST-style API endpoints returning JSON data

⚡ Lightweight embedded Jetty server



---

🛠 Tech Stack

Backend

Java (Servlets)

Jetty Embedded Server

JDBC

Gson (JSON parsing)


Frontend

HTML

CSS

JavaScript


Database

JDBC-based database connectivity



---

📂 Project Structure

Court-Management-System
│
├── src/
│   ├── servlet/        # Servlets and Jetty server
│   ├── model/          # Domain models (Judge, Lawyer, Case etc.)
│   └── dao/            # Database access logic
│
├── web/                # Static frontend (HTML, CSS, JS)
│
├── lib/                # Third-party libraries (Jetty, Gson, JDBC)
│
├── build/              # Compiled Java classes
│
└── README.md


---

⚙️ Requirements

Java 17+

Required JAR files in lib/

Jetty

Gson

JDBC Driver




---

▶️ Running the Project

1️⃣ Clone the repository

git clone https://github.com/Dkhatke/Court-Management-System.git
cd Court-Management-System


---

2️⃣ Compile the project

mkdir build
javac -cp "lib/*" -d build src/servlet/*.java src/model/*.java src/dao/*.java


---

3️⃣ Run the server

java -cp "build;lib/*" servlet.JettyServer


---

4️⃣ Open in browser

http://localhost:8081


---

🔗 API Endpoints

The following endpoints return JSON data used by the frontend.

Endpoint	Description

/courts	List of courts
/judges	List of judges
/lawyers	List of lawyers
/clients	List of clients
/cases	List of cases
/hearings	List of hearings
/judgements	List of judgements


Example:

http://localhost:8081/judges


---

🧪 Testing the System

1. Start the server.


2. Open the Admin Dashboard in your browser.


3. Verify:

Tables load correctly

Search functionality works

API endpoints return JSON data.





---

⚠️ Troubleshooting

Error: Could not find or load main class

Recompile and ensure classpath includes build and lib/*.

javac -cp "lib/*" -d build src/servlet/*.java src/model/*.java src/dao/*.java


---

Error: Address already in use

Change the port inside:

src/servlet/JettyServer.java

Example:

Server server = new Server(8081);


---

📌 Future Improvements

Add authentication and role-based access

Integrate MySQL / PostgreSQL

Implement case tracking dashboard

Add Gradle or Maven build system

Improve UI/UX




That will make recruiters much more likely to click your project.
