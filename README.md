## Court Management System

This repository contains a simple Court Management System demo implemented with Java servlets and a small embedded Jetty server for local development. The project serves a static frontend from the `web/` folder and exposes several servlet endpoints (for courts, judges, lawyers, clients, cases, hearings, and judgements).

---

## Project layout

- `src/` - Java source files
  - `servlet/` - servlet classes and `JettyServer.java`
  - `model/` - domain models
  - `dao/` - database/connection helpers
- `lib/` - third-party JARs required at runtime and compile time (Jetty, Gson, JDBC driver, etc.)
- `web/` - static frontend files (HTML/CSS/JS)
- `build/` - compiled Java classes (created by javac)

---

## Requirements

- Java 17+ / Java SE 25 LTS (the project was compiled with JavaSE-25 in this workspace)
- A JDBC driver and any additional libraries inside `lib/` (Jetty, Gson, etc.)

Note: The project is intentionally simple and uses an embedded Jetty server for local development rather than a full Tomcat setup.

---

## Quick start (Windows - cmd.exe)

1. Open a command prompt in the project root (where this README is).

2. Create the `build` directory and compile the sources:

```cmd
mkdir build 2>nul
javac -cp "lib/*" -d build src/servlet/*.java src/model/*.java src/dao/*.java
```

3. Run the embedded Jetty server (classpath must include `build` and all jars in `lib`):

```cmd
java -cp "build;lib/*" servlet.JettyServer
```

After startup you should see a message indicating the server URL (for example: http://localhost:8081/).

If your console shows "Server running at" followed by a URL, open that URL in your browser.

---

## Default endpoints

- Static frontend served from `/` (the `web/` folder)
- REST-style endpoints (servlets):
  - `/courts`
  - `/judges`
  - `/lawyers`
  - `/clients`
  - `/cases`
  - `/hearings`
  - `/judgements`

These endpoints return JSON arrays used by the frontend JavaScript to populate tables.

---

## Notes about recent changes and important files

- `src/servlet/JettyServer.java` — small embedded server runner. The server port was changed to `8081` in this workspace to avoid conflicts. To change it, edit the `new Server(PORT)` line and recompile.
- `web/js/admin.js` — frontend admin script that handles data loading and search. There is a backup file `web/js/admin.js.bak` in the same folder if you need to restore a prior version.

If you accidentally replaced a working `admin.js`, restore it with (from the `web/js` folder):

```cmd
cd web\js
copy /Y admin.js.bak admin.js
```

---

## Troubleshooting

- "Could not find or load main class servlet.JettyServer"
  - Make sure you compiled the sources into `build/` and run with `-cp "build;lib/*"`.
  - Example:
    ```cmd
    javac -cp "lib/*" -d build src/servlet/*.java src/model/*.java src/dao/*.java
    java -cp "build;lib/*" servlet.JettyServer
    ```

- "Address already in use" / BindException
  - Another process is listening on the configured port (the default in this workspace was changed to `8081`). Either stop that process or change the port in `src/servlet/JettyServer.java` and recompile.
  - On Windows you can list processes using a port with:
    ```cmd
    netstat -ano | findstr :8080
    tasklist /FI "PID eq <pid>"
    ```

- Classpath issues / NoClassDefFoundError
  - Ensure `lib/*` contains the required libraries (Jetty jars, Gson, JDBC driver). The runtime classpath must include `build` and `lib/*`.

---

## Development tips

- If you change Java sources re-run the `javac` command above to recompile into `build/` before running the server.
- Keep third-party jars in `lib/`. If you add new libraries, include them in the `lib/` folder and restart the server with the same `-cp` pattern.

---

## Tests / Validation

- After starting the server visit the UI in a browser and confirm tables load and that search works in the admin dashboard.
- For quick verification, try the endpoints directly in the browser (e.g., `http://localhost:8081/judges`) to confirm JSON responses.

---

## Contact / Next steps

If you want, I can:
- Add a small Gradle or Maven build file to manage compilation and dependencies.
- Add a simple unit/integration test harness.
- Re-introduce the improved admin.js with optional feature flags, or provide a smaller patch that only fixes the previously broken search.

---

License: MIT (adjust as appropriate)
