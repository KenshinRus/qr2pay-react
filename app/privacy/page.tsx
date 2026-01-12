export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to QR2Pay (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, and safeguard your information when you use our QR code generation service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2 mt-4">2.1 Account Information</h3>
          <p className="text-muted-foreground mb-3">
            When you create an account, we collect:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Email address</li>
            <li>Name (if provided)</li>
            <li>Authentication credentials (managed securely by Clerk)</li>
            <li>Profile information from OAuth providers (if you sign in with Google)</li>
          </ul>

          <h3 className="text-xl font-medium mb-2 mt-4">2.2 QR Code Data</h3>
          <p className="text-muted-foreground mb-3">
            When you generate QR codes, we store:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Bank account numbers and details you provide</li>
            <li>Payee names and references</li>
            <li>QR code metadata (creation date, last accessed)</li>
          </ul>

          <h3 className="text-xl font-medium mb-2 mt-4">2.3 Usage Information</h3>
          <p className="text-muted-foreground mb-3">
            We automatically collect:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>IP addresses</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and features used</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-3">We use your information to:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Provide and maintain the QR code generation service</li>
            <li>Manage your account and authentication</li>
            <li>Store and retrieve your saved QR codes</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Improve our service and user experience</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-muted-foreground mb-3">
            We implement appropriate technical and organizational measures to protect your data:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Encryption of sensitive data at rest and in transit</li>
            <li>Secure authentication via Clerk (industry-standard security practices)</li>
            <li>Regular security assessments</li>
            <li>Access controls and monitoring</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            However, no method of transmission over the internet is 100% secure. While we strive to protect your data,
            we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Data Sharing and Disclosure</h2>
          <p className="text-muted-foreground mb-3">
            We do not sell your personal information. We may share your data with:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li><strong>Service Providers:</strong> Clerk (authentication), hosting providers, and other essential services</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Third-Party Services</h2>
          <p className="text-muted-foreground mb-3">
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li><strong>Clerk:</strong> Authentication and user management</li>
            <li><strong>Google OAuth:</strong> Optional sign-in method (subject to Google&apos;s Privacy Policy)</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            These services have their own privacy policies. We encourage you to review them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Your Rights</h2>
          <p className="text-muted-foreground mb-3">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct your information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            To exercise these rights, please contact us at qr2payapp@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your data for as long as your account is active or as needed to provide services.
            You may delete your account at any time, which will remove your personal data from our systems,
            subject to legal retention requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground">
            Our service is not intended for users under 13 years of age. We do not knowingly collect
            personal information from children under 13. If you become aware that a child has provided
            us with personal data, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. International Data Transfers</h2>
          <p className="text-muted-foreground">
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place to protect your data in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. We will notify you of any changes by
            posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">12. Contact Us</h2>
          <p className="text-muted-foreground mb-3">
            If you have questions about this privacy policy or our data practices, please contact us:
          </p>
          <ul className="list-none text-muted-foreground space-y-1">
            <li>Email: qr2payapp@gmail.com</li>
            <li>Service: QR2Pay - QR Code Payment Generator</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">13. Cookie Policy</h2>
          <p className="text-muted-foreground mb-3">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Maintain your session and authentication state</li>
            <li>Remember your preferences</li>
            <li>Analyze usage patterns</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            You can control cookies through your browser settings, but disabling cookies may affect functionality.
          </p>
        </section>
      </div>
    </div>
  );
}
