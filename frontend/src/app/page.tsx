import Image from "next/image";
import Hero from "@/components/Home/Hero";
import Feature from "@/components/Home/Feature";
import Header from "@/components/Home/Header";
import Call_to_action from "@/components/Home/Call_to_action";
import Pricing from "@/components/Home/Pricing";
import Stars from "@/components/Home/Stars";
import FAQ_s from "@/components/Home/FAQ";
import Footer from '@/components/Home/Footer'

export default function Home() {

  return (
    <div>
      <div className="relative">
        <div className="sticky top-0 z-50" >
          <Header />
        </div>
        <Hero />
        <Feature />
        <Call_to_action />
        <Pricing/>
        <Stars/>
        <FAQ_s/>
        <>
        <Footer/>
        </>
      </div>
    </div>
  );
}
