export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using QR2Pay (&quot;the Service&quot;), you accept and agree to be bound by these Terms of Service
            (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
          <p className="text-muted-foreground mb-3">
            QR2Pay provides a free service to generate QR codes containing bank payment details. The Service allows users to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Generate QR codes with bank account information</li>
            <li>Save and manage multiple QR codes (with account)</li>
            <li>Share QR codes for payment collection purposes</li>
            <li>Download QR codes for printing or digital distribution</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <h3 className="text-xl font-medium mb-2 mt-4">3.1 Account Registration</h3>
          <p className="text-muted-foreground mb-3">
            To use certain features, you may need to create an account. You agree to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activities under your account</li>
          </ul>

          <h3 className="text-xl font-medium mb-2 mt-4">3.2 Account Termination</h3>
          <p className="text-muted-foreground">
            You may delete your account at any time. We reserve the right to suspend or terminate accounts
            that violate these Terms or for any other reason at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Acceptable Use</h2>
          <h3 className="text-xl font-medium mb-2 mt-4">4.1 Permitted Use</h3>
          <p className="text-muted-foreground mb-3">
            You may use the Service for lawful purposes to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Generate QR codes for legitimate payment collection</li>
            <li>Share your bank details in a convenient format</li>
            <li>Facilitate personal or business transactions</li>
          </ul>

          <h3 className="text-xl font-medium mb-2 mt-4">4.2 Prohibited Activities</h3>
          <p className="text-muted-foreground mb-3">
            You agree NOT to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Use the Service for any illegal or fraudulent activities</li>
            <li>Create QR codes with false or misleading information</li>
            <li>Impersonate others or misrepresent your identity</li>
            <li>Use the Service to collect payments for illegal goods or services</li>
            <li>Attempt to interfere with, disrupt, or gain unauthorized access to the Service</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Reverse engineer, decompile, or attempt to extract source code</li>
            <li>Remove or modify any copyright, trademark, or proprietary notices</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Data and Privacy</h2>
          <p className="text-muted-foreground mb-3">
            Your use of the Service is also governed by our Privacy Policy. Key points:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>We store bank account details you provide to generate QR codes</li>
            <li>You are responsible for the accuracy of information you enter</li>
            <li>We use encryption to protect your data</li>
            <li>You can delete your data by deleting your account</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            Please review our Privacy Policy at <a href="/privacy" className="text-primary hover:underline">/privacy</a> for complete details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
          <h3 className="text-xl font-medium mb-2 mt-4">6.1 Our Rights</h3>
          <p className="text-muted-foreground mb-3">
            The Service, including its design, code, graphics, and content, is owned by QR2Pay and protected by
            intellectual property laws. You may not copy, modify, or distribute the Service without permission.
          </p>

          <h3 className="text-xl font-medium mb-2 mt-4">6.2 Your Content</h3>
          <p className="text-muted-foreground mb-3">
            You retain ownership of the data you input. By using the Service, you grant us a license to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Store and process your data to provide the Service</li>
            <li>Generate and display QR codes based on your information</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            We will not use your data for purposes beyond providing the Service, except as described in our Privacy Policy.
          </p>

          <h3 className="text-xl font-medium mb-2 mt-4">6.3 Generated QR Codes</h3>
          <p className="text-muted-foreground">
            QR codes generated through the Service belong to you. You may use, share, and distribute them freely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Disclaimers and Limitations</h2>
          <h3 className="text-xl font-medium mb-2 mt-4">7.1 Service Provided &quot;As Is&quot;</h3>
          <p className="text-muted-foreground mb-3">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. We do not guarantee that:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>The Service will be uninterrupted or error-free</li>
            <li>Defects will be corrected</li>
            <li>The Service is free from viruses or harmful components</li>
            <li>QR codes will be compatible with all scanning devices</li>
          </ul>

          <h3 className="text-xl font-medium mb-2 mt-4">7.2 No Financial Advice</h3>
          <p className="text-muted-foreground">
            QR2Pay is a technical tool for generating QR codes. We do not provide financial, legal, or tax advice.
            Consult appropriate professionals for such matters.
          </p>

          <h3 className="text-xl font-medium mb-2 mt-4">7.3 User Responsibility</h3>
          <p className="text-muted-foreground mb-3">
            You are solely responsible for:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Verifying the accuracy of bank details entered</li>
            <li>Ensuring QR codes are distributed to intended recipients</li>
            <li>Monitoring transactions to your accounts</li>
            <li>Complying with applicable laws and regulations</li>
            <li>Securing your account and generated QR codes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-3">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, QR2PAY SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Unauthorized transactions or fraudulent use of QR codes</li>
            <li>Errors in bank details entered by users</li>
            <li>Service interruptions or data loss</li>
            <li>Third-party actions or omissions</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            Our total liability shall not exceed the amount you paid us (which is $0 for our free service).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Indemnification</h2>
          <p className="text-muted-foreground">
            You agree to indemnify and hold harmless QR2Pay, its affiliates, and service providers from any claims,
            damages, or expenses arising from your use of the Service, violation of these Terms, or infringement
            of any rights of others.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Third-Party Services</h2>
          <p className="text-muted-foreground mb-3">
            The Service uses third-party services including:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Clerk for authentication</li>
            <li>Google OAuth for sign-in</li>
            <li>Hosting and infrastructure providers</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            These services have their own terms and conditions. We are not responsible for third-party services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Modifications to the Service</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time
            without notice. We will not be liable for any modification, suspension, or discontinuation of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">12. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these Terms from time to time. Changes will be posted on this page with an updated
            &quot;Last updated&quot; date. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">13. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to
            conflict of law principles. Any disputes shall be resolved in the appropriate courts.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">14. Severability</h2>
          <p className="text-muted-foreground">
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
            shall continue in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">15. Entire Agreement</h2>
          <p className="text-muted-foreground">
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and QR2Pay
            regarding the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">16. Contact Information</h2>
          <p className="text-muted-foreground mb-3">
            If you have questions about these Terms, please contact us:
          </p>
          <ul className="list-none text-muted-foreground space-y-1">
            <li>Email: qr2payapp@gmail.com</li>
            <li>Service: QR2Pay - QR Code Payment Generator</li>
          </ul>
        </section>

        <section className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Important Notice:</strong> These Terms of Service are provided as a standard template and may need
            customization based on your specific jurisdiction and business needs. We recommend consulting with a legal
            professional to ensure compliance with applicable laws.
          </p>
        </section>
      </div>
    </div>
  );
}
