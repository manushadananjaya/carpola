import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            Last updated: November 7, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Carpola.lk. We respect your privacy and are committed
              to protecting your personal data. This privacy policy will inform
              you about how we look after your personal data when you visit our
              website and tell you about your privacy rights and how the law
              protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We collect several types of information from and about users of
              our website, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Personal identification information (Name, email address, phone
                number, etc.)
              </li>
              <li>Vehicle information that you provide for listings</li>
              <li>Transaction and payment information</li>
              <li>Usage data and cookies</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and maintain our vehicle marketplace service</li>
              <li>Process your vehicle listings and transactions</li>
              <li>Contact you regarding your listings or inquiries</li>
              <li>Improve our website and user experience</li>
              <li>
                Send you updates and marketing communications (with your
                consent)
              </li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <p className="mb-4">We may share your personal information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Other users when you list a vehicle or make an inquiry</li>
              <li>Service providers who assist in operating our website</li>
              <li>Law enforcement when required by law</li>
              <li>Third-party analytics services to improve our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              Internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="mb-4">
              Under Sri Lankan data protection laws, you have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request transfer of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our website and hold certain information. You can instruct your
              browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <ul className="list-none pl-6 mb-4">
              <li>Email: info@carpola.lk</li>
              <li>Address: No08,DevotaRoad,Nupe,Matara, Sri Lanka</li>
              <li>Phone: +94712770284</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
