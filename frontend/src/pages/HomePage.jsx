import Navbar from '../components/Navbar'
import HeroSection from '../sections/HeroSection'
import AirlineLogos from '../sections/AirlineLogos'
import WhyUsSection from '../sections/WhyUsSection'
import PackageList from '../sections/PackageList'
import TestimonialsSlider from '../sections/TestimonialsSlider'
import GalleryGrid from '../sections/GalleryGrid'
import FAQSection from '../sections/FAQSection'
import CTASection from '../sections/CTASection'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function HomePage() {
    return (
        <div className="bg-gray-950 min-h-screen">
            <Navbar />
            <main>
                <HeroSection />
                <AirlineLogos />
                <WhyUsSection />
                <PackageList />
                <TestimonialsSlider />
                <GalleryGrid />
                <FAQSection />
                <CTASection />
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    )
}
