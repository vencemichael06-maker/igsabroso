import { createFileRoute } from "@tanstack/react-router";
import { openIgsContact } from "@/lib/contact";
import { useState } from "react";
import { CheckBookingModal } from "@/components/booking-modals";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { HomeHero } from "@/features/home/home-hero";
import { LandingSections } from "@/features/home/landing-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IG Sabroso Construction — Your Dependable Building Partner" },
      {
        name: "description",
        content:
          "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso.",
      },
      {
        property: "og:title",
        content: "IG Sabroso Construction — Your Dependable Building Partner",
      },
      {
        property: "og:description",
        content:
          "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const recovery = import.meta.env.VITE_PAGES_RECOVERY === true;

  return (
    <PageTransition>
      <main>
        <HomeHero onManageBooking={recovery ? openIgsContact : () => setBookingOpen(true)} />
        <LandingSections />
      </main>
      <SiteFooter />
      {!recovery && <CheckBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />}
    </PageTransition>
  );
}
