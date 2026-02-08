import React from "react";

function Section({ heading, children }) {
  return (
    <div className="mt-6">
      {heading && (
        <h2 className="text-base font-semibold text-[var(--color-text)]">{heading}</h2>
      )}
      <div className="mt-1 space-y-2">{children}</div>
    </div>
  );
}

function P({ children }) {
  return (
    <p className="text-sm text-[var(--color-text)] leading-relaxed">{children}</p>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>

      <Section>
        <P>
          Sahumärio insists upon the highest standards for secure transactions and
          protection of your Personal Information and its privacy. Please read the
          following statement to learn about our information gathering and dissemination
          practices.
        </P>
        <P>
          <strong>Note:</strong> Our privacy policy is subject to change at any time
          without notice. To make sure you are aware of any changes, please review this
          policy periodically.
        </P>
        <P>
          Sahumärio is committed to protecting and safeguarding your privacy. This
          Privacy Policy describes the types of personal information collected on the
          Sahumärio website, how we use that information, and with whom we may share it.
          It also describes the measures we take to protect the security of this
          information and how you can access, modify, or delete your personal information.
        </P>
        <P>
          By using the website, you expressly consent to our use and disclosure of your
          personal information in accordance with this Privacy Policy.
        </P>
      </Section>

      <Section heading="Collection of Personally Identifiable Information (PII)">
        <P>
          Sahumärio limits itself to collecting information in order to ensure accurate
          service. Most information we collect is very basic and is needed to complete a
          purchase or provide a refund. Examples include your name, address, telephone
          number, date of birth, email address, descriptions of items requested or
          purchased, language preference, the IP address and operating system of your
          computer, and the browser type and version being used by you.
        </P>
        <P>We will not sell, distribute, or lease your personal information to third parties.</P>
        <P>
          We may automatically track certain information about you based upon your
          behaviour on our site to better understand, protect and serve our users. This
          information is compiled and analysed on an aggregated basis.
        </P>
      </Section>

      <Section heading="Credit Card, Debit Card and Banking Information">
        <P>
          Sahumärio does not collect or store credit card, debit card, or any banking
          information — it is directly transmitted through the payment gateway provider to
          the payment network or bank.
        </P>
      </Section>

      <Section heading="Registration">
        <P>
          In order to take advantage of some features of the site, you must register and
          create a member account, which is free of cost. Your password is a component of
          our security system. Do not share your password with any third parties.
        </P>
      </Section>

      <Section heading="Technologies That Allow Us to Customise Your Experience">
        <P>
          We use various technologies to collect information relating to your visit to our
          website, such as the URL that referred you, Internet Protocol address, browser
          type, browser language, and the date and time of your request. This enables us
          to enhance and customise your experience on our website.
        </P>
      </Section>

      <Section heading="Web Beacons and Tracking Links">
        <P>
          Web Beacons (also called clear gifs and pixel tags) and tracking links consist
          of a few lines of code embedded on the pages of our website. They may relay
          information to third parties such as our service providers and may be used to
          track customer response to advertising and to enhance customer support.
        </P>
      </Section>

      <Section heading="Cookies">
        <P>
          We use data collection devices such as "cookies" on certain pages of the website
          to help analyse our web page flow, measure promotional effectiveness, and promote
          trust and safety. You are always free to decline our cookies if your browser
          permits, although in that case you may not be able to use certain features.
        </P>
      </Section>

      <Section heading="Use of Your Personal Information">
        <P>
          We use personal information to provide the services you request. We use your
          personal information to resolve disputes, troubleshoot problems, help promote a
          safe service, collect money, measure consumer interest in our products and
          services, inform you about online and offline offers, customise your experience,
          detect and protect us against error, fraud and other criminal activity, and
          enforce our terms and conditions.
        </P>
      </Section>

      <Section heading="Marketing Communications">
        <P>
          If you choose to leave your email address with us, we may deliver newsletters,
          surveys, or other promotional information. You may unsubscribe at any time using
          the 'Unsubscribe' link in any email. If you have provided your mobile number, you
          may receive SMS alerts with product information or promotions. Sahumärio does not
          charge any fee for text messages, though your mobile service provider may.
        </P>
      </Section>

      <Section heading="Sharing of Personal Information">
        <P>
          We may share personal information with our corporate entities and affiliates to
          help detect and prevent identity theft, fraud, and other potentially illegal acts.
          We retain companies and individuals to perform functions on our behalf consistent
          with this Privacy Policy (e.g., order processing, courier services, data
          analysis, customer support). Such third parties may not use such information
          other than on our behalf.
        </P>
        <P>
          We may disclose personal information if required to do so by law or in the good
          faith belief that such disclosure is reasonably necessary to respond to court
          orders or other legal process.
        </P>
      </Section>

      <Section heading="Business Transfer">
        <P>
          We and our affiliates will share or sell some or all of your personal information
          with another business entity should we plan to merge with or be acquired by that
          business entity. The new entity will be required to follow this privacy policy.
        </P>
      </Section>

      <Section heading="Transfer of Data to Other Countries">
        <P>
          Sahumärio and its affiliates shall be located in India and are required to honour
          the privacy representations made in this Privacy Policy under applicable laws of
          this country.
        </P>
      </Section>

      <Section heading="Choice / Opt-Out">
        <P>
          We provide all users with the opportunity to opt-out of receiving non-essential
          (promotional, marketing-related) communications from us after setting up an
          account.
        </P>
      </Section>

      <Section heading="Policy Change">
        <P>
          Our Privacy Policy may change from time to time. We will not reduce your rights
          under this Privacy Policy without your explicit consent. We will post any privacy
          policy changes on this page. Prior versions will be kept in an archive for your
          review.
        </P>
      </Section>

      <Section heading="Children">
        <P>
          The Sahumärio website is not designed for persons under the age of 18 and we do
          not knowingly collect personally identifiable information from anyone under the
          age of 18.
        </P>
      </Section>

      <Section heading="Your Consent">
        <P>
          By using the website and/or by providing your information, you consent to the
          collection and use of the information you disclose on the website in accordance
          with this Privacy Policy.
        </P>
      </Section>

      <Section heading="Contact Us">
        <P>
          If you have questions or comments about our privacy policies, feel free to write
          to us at{" "}
          <a
            href="mailto:sahumariofragrance@gmail.com"
            className="text-amber-600 hover:underline"
          >
            sahumariofragrance@gmail.com
          </a>
          .
        </P>
      </Section>
    </section>
  );
}
