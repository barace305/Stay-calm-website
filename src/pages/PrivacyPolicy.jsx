import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout'

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-navy-200 text-lg leading-8">
        This Privacy Policy explains how Stay Calm collects, uses, discloses, and protects information when you use our website or communicate with us.
      </p>

      <LegalSection title="1. Information We Collect">
        <p>We may collect information you voluntarily provide, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name, phone number, and email address</li>
          <li>City and state</li>
          <li>Whether you report being injured</li>
          <li>A description of an accident, incident, or situation</li>
          <li>Your preferred or best time to be contacted</li>
          <li>Information submitted through website forms</li>
          <li>Other information you voluntarily submit</li>
        </ul>
        <p>
          The website or its hosting infrastructure may also automatically collect limited technical information, such as your IP address, browser type, device information, referring page, and basic usage or log information.
        </p>
        <p>
          The website currently uses a Google tag to measure website activity and advertising conversions. This may allow Google to receive limited device and interaction information in accordance with its own privacy practices.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Use Information">
        <p>We may use information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Respond to inquiries and contact users who request assistance</li>
          <li>Understand a user's reported situation and determine what information or assistance may be appropriate</li>
          <li>Coordinate requested communications</li>
          <li>Connect users with participating or relevant service providers when requested or authorized</li>
          <li>Operate, maintain, protect, and improve the website</li>
          <li>Prevent fraud, misuse, and security issues</li>
          <li>Maintain appropriate business records and comply with legal obligations</li>
        </ul>
        <p>Stay Calm does not guarantee that assistance or a service provider will be available.</p>
      </LegalSection>

      <LegalSection title="3. Service Providers and Third Parties">
        <p>
          We may use service providers that support website hosting, communications, security, technology infrastructure, customer communications, and other operational functions. These providers may process information only as needed to perform services for us.
        </p>
        <p>
          Attorneys, chiropractors, medical providers, towing providers, and other participating professionals or businesses may be independent third parties. Personal information may be shared with an appropriate third-party provider only when necessary to respond to your request, coordinate requested assistance, when you authorize it, or when otherwise permitted or required by law.
        </p>
      </LegalSection>

      <LegalSection title="4. No Sale of Personal Information">
        <p>Stay Calm does not sell personal information.</p>
      </LegalSection>

      <LegalSection title="5. SMS Communications">
        <p>
          Stay Calm may send SMS messages after you provide consent to receive them. Consent may be provided during a live telephone conversation or through another clearly disclosed opt-in method. Messages may include requested information, demo links, follow-up information, or other communications related to your request or interaction with Stay Calm.
        </p>
        <p>
          Message frequency varies. Message and data rates may apply. Reply STOP to opt out. Reply HELP for assistance. Consent to receive SMS messages is not a condition of purchasing any product or service.
        </p>
        <p>
          Mobile information, including phone numbers and SMS opt-in consent, will not be shared with third parties or affiliates for their marketing or promotional purposes. This does not prevent us from using service providers that help deliver communications or sharing other information with a provider you specifically request or authorize, as described above.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We may retain personal information for as long as reasonably necessary for the purposes described in this policy, responding to inquiries, maintaining business records, meeting legal and regulatory obligations, resolving disputes, and enforcing agreements.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          Stay Calm uses reasonable administrative, technical, and organizational safeguards designed to protect information. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="8. User Choices">
        <p>
          You may ask questions about your information, request corrections, or request deletion when applicable by contacting us. You may opt out of SMS messages at any time by replying STOP.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          The website is not intended for children under 13, and Stay Calm does not knowingly collect personal information from children under 13.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time. When changes are made, we will update the effective date shown at the top of this page.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Questions about this Privacy Policy may be sent to <a href="mailto:help@staycalm.today" className="text-gold-400 hover:text-gold-300">help@staycalm.today</a> or by calling <a href="tel:4049901344" className="text-gold-400 hover:text-gold-300">(404) 990-1344</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
