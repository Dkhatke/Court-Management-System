package servlet;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class JettyServer {
    public static void main(String[] args) throws Exception {

        // Create server on port 8080
        Server server = new Server(8080);

        // ✅ Absolute path to your 'web' folder to prevent 404
        String webDir = System.getProperty("user.dir") + "/web";

        // ✅ Serve static files (HTML, CSS, JS) from /web
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setDirectoriesListed(false);
        resourceHandler.setWelcomeFiles(new String[]{"index.html"});
        resourceHandler.setResourceBase(webDir);

        // ✅ Create context for servlets (your backend)
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        // ✅ Register all servlets (backend endpoints)
        context.addServlet(new ServletHolder(new CourtServlet()), "/courts");
        context.addServlet(new ServletHolder(new JudgeServlet()), "/judges");
        context.addServlet(new ServletHolder(new LawyerServlet()), "/lawyers");
        context.addServlet(new ServletHolder(new ClientServlet()), "/clients");
        context.addServlet(new ServletHolder(new CaseServlet()), "/cases");
        context.addServlet(new ServletHolder(new HearingServlet()), "/hearings");
        context.addServlet(new ServletHolder(new JudgementServlet()), "/judgements");
        context.addServlet(new ServletHolder(new LoginServlet()), "/login");

        // ✅ Combine both static files + servlet handling
        HandlerList handlers = new HandlerList();
        handlers.addHandler(resourceHandler);
        handlers.addHandler(context);

        server.setHandler(handlers);

        // ✅ Start server
        System.out.println("🚀 Server running at: http://localhost:8080/");
        System.out.println("📂 Serving static files from: " + webDir);

        server.start();
        server.join();
    }
}
