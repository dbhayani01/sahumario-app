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

export default function ShippingPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Shipping Policy</h1>

      <Section>
        <P>
          Purchases are shipped from our warehouse in Shapar (Veraval), Rajkot, Gujarat,
          India by courier. Please allow the following number of days from receipt of your
          order:
        </P>
        <P>
          <strong>India Wide:</strong> 3 to 7 business days
        </P>
      </Section>

      <Section heading="Delivery">
        <P>
          Order deliveries will be made between 9 am – 8 pm, Monday to Saturday. Goods
          will need to be signed for upon delivery. If you cannot be there to sign for your
          delivery, please suggest an alternative such as a family member, colleague, or
          neighbour.
        </P>
        <P>
          SAHUMÄRIO takes no responsibility for goods signed by an alternative person.
        </P>
      </Section>

      <Section heading="Damage &amp; Claims">
        <P>SAHUMÄRIO is not responsible for damage after delivery.</P>
        <P>
          All claims for shortages or damages must be reported to customer service on the
          day of delivery.
        </P>
      </Section>

      <Section heading="Shipping Charges">
        <P>
          Shipping and handling rates may vary based on product, packaging, size, volume,
          type and other considerations. The shipping and handling charges are displayed at
          the time of checkout so consumers will know the cost before making payment.
        </P>
      </Section>

      <Section heading="Contact">
        <P>
          For any shipping-related queries, please contact us at{" "}
          <a href="tel:+919974599910" className="text-amber-600 hover:underline">
            +91-99745 99910
          </a>{" "}
          or{" "}
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
