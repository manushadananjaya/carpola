// app/thank-you/page.tsx
export default function ThankYouPage() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Thank You for Registering!</h1>
      <p>
        Your email has been successfully verified. Please log in again to
        activate your account.
      </p>
      <a
        href="auth/signin"
        style={{ color: "#4CAF50", textDecoration: "underline" }}
      >
        Go to Login
      </a>
    </div>
  );
}
