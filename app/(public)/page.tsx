import { Hero } from "@/components/landing/Hero";
import { Pains } from "@/components/landing/Pains";
import { ComoFunciona } from "@/components/landing/ComoFunciona";
import { ParaQuien } from "@/components/landing/ParaQuien";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonios } from "@/components/landing/Testimonios";
import { Faq } from "@/components/landing/Faq";
import { CtaFinal } from "@/components/landing/CtaFinal";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Pains />
      <ComoFunciona />
      <ParaQuien />
      <Pricing />
      <Testimonios />
      <Faq />
      <CtaFinal />
    </>
  );
}
