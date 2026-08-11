import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout'

export default function TermsConditions() {
  return (
    <LegalPageLayout title="Terms & Conditions">
      <p className="text-navy-200 text-lg leading-8">
        These Terms &amp; Conditions govern your use of the Stay Calm website and related communications and services.
      </p>

      <LegalSection title="1. Acceptance of Terms">
        <p>
          By using this website or submitting information through it, you agree to these Terms &amp; Conditions. If you do not agree, do not use the website or submit information.
        </p>
      </LegalSection>

      <LegalSection title="2. About Stay Calm">
        <p>
          Stay Calm is a marketing and assistance platform operated by Mine City LLC. It may help individuals obtain information or connect with participating service providers, including attorneys, chiropractors, medical providers, towing providers, and other relevant businesses or professionals.
        </p>
        <p>
          Stay Calm is not itself a law firm, healthcare provider, chiropractor, towing company, or emergency service.
        </p>
      </LegalSection>

      <LegalSection title="3. No Legal or Medical Advice">
        <p>
          Stay Calm is not a law firm and does not provide legal advice. Stay Calm is not a healthcare provider and does not provide medical diagnosis or medical advice. Information on the website is general in nature. You should consult qualified professionals regarding legal or medical matters.
        </p>
      </LegalSection>

      <LegalSection title="4. No Guarantee of Services or Outcomes">
        <p>
          Stay Calm does not guarantee that any provider will accept or work with you, that services will be available, or that any legal, medical, financial, insurance, recovery, settlement, treatment, or other outcome will occur. Stay Calm may choose not to pursue or respond to every inquiry.
        </p>
      </LegalSection>

      <LegalSection title="5. Third-Party Providers">
        <p>
          Attorneys, chiropractors, healthcare providers, towing providers, and other participating businesses or professionals are independent third parties unless specifically stated otherwise. They are responsible for their own services, fees, professional advice, availability, licensing, decisions, client or patient relationships, and conduct. Stay Calm does not control or guarantee third-party performance.
        </p>
      </LegalSection>

      <LegalSection title="6. User Responsibilities">
        <p>By using the website, you agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide information you reasonably believe to be accurate</li>
          <li>Not misuse the website</li>
          <li>Not submit fraudulent, unlawful, abusive, harmful, or intentionally misleading information</li>
          <li>Not attempt to interfere with website security or operation</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Emergency Disclaimer">
        <p>
          Stay Calm is not an emergency service. If you are experiencing an emergency or immediate danger, contact 911 or the appropriate emergency service.
        </p>
      </LegalSection>

      <LegalSection title="8. Website Availability">
        <p>
          Stay Calm does not guarantee that the website will always be available, uninterrupted, error-free, or free of technical problems.
        </p>
      </LegalSection>

      <LegalSection title="9. Intellectual Property">
        <p>
          The Stay Calm name, branding, logos, site content, graphics, design, software, text, and other materials are owned by or licensed to Mine City LLC unless otherwise stated. You may not reproduce, distribute, sell, or commercially exploit these materials without permission, except where allowed by law.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, Mine City LLC and Stay Calm will not be liable for losses or damages arising from use of or inability to use the website, reliance on general website information, third-party providers, third-party websites or services, interruptions or technical failures, or events outside their reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="11. Indemnification">
        <p>
          You agree to indemnify and hold Mine City LLC and Stay Calm harmless from claims, losses, or expenses arising from your misuse of the website, violation of these Terms, or unlawful conduct, to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="12. SMS Terms">
        <p>
          Stay Calm may send SMS messages after the recipient provides consent. Messages may include requested information, demo links, follow-up information, or communications related to the recipient's interaction with Stay Calm. Message frequency varies. Message and data rates may apply. Reply STOP to opt out. Reply HELP for help. Consent to receive SMS messages is not a condition of purchase. Wireless carriers are not responsible for delayed or undelivered messages.
        </p>
        <p>
          See our <a href="/privacy" className="text-gold-400 hover:text-gold-300">Privacy Policy</a> for information about how we handle personal information and SMS consent.
        </p>
      </LegalSection>

      <LegalSection title="13. Third-Party Links">
        <p>
          The website may link to third-party websites. Stay Calm is not responsible for their content, privacy practices, or services.
        </p>
      </LegalSection>

      <LegalSection title="14. Governing Law">
        <p>
          These Terms are governed by the laws of the State of Florida, without regard to conflict-of-law principles, and subject to applicable federal law.
        </p>
      </LegalSection>

      <LegalSection title="15. Changes to These Terms">
        <p>
          We may update these Terms from time to time. When changes are made, we will update the effective date shown at the top of this page.
        </p>
      </LegalSection>

      <LegalSection title="16. Contact">
        <p>
          Questions about these Terms may be sent to <a href="mailto:help@staycalm.today" className="text-gold-400 hover:text-gold-300">help@staycalm.today</a> or by calling <a href="tel:4049901344" className="text-gold-400 hover:text-gold-300">(404) 990-1344</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
