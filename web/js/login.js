document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "admin123") {
      window.location.href = "admin-dashboard.html";
    } else if (username === "user" && password === "user123") {
      window.location.href = "user-dashboard.html";
    } else {
      msg.textContent = "Invalid username or password!";
    }
  });
});
