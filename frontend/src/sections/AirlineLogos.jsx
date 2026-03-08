import garudaLogo from '../assets/maskapai/Garuda-Indonesia-Logo.png'
import saudiaLogo from '../assets/maskapai/Saudi-Arabian-Airlines-logo_2023.png'
import emiratesLogo from '../assets/maskapai/Emirates_logo.svg.png'
import etihadLogo from '../assets/maskapai/Etihad-airways-logo.svg.png'
import qatarLogo from '../assets/maskapai/Qatar_Airways_Logo.png'
import turkishLogo from '../assets/maskapai/Turkish_Airlines_logo_2019_compact.svg.png'
import malaysiaLogo from '../assets/maskapai/Malaysia_Airlines_Svg_Logo.svg.png'
import omanLogo from '../assets/maskapai/Oman_Air_logo1.png'
import bruneiLogo from '../assets/maskapai/Royal_Brunei_Airlines.png'
import scootLogo from '../assets/maskapai/Scoot_logo.svg'

const airlines = [
    { name: 'Garuda Indonesia', logo: garudaLogo, h: 38 },
    { name: 'Saudi Arabian Airlines', logo: saudiaLogo, h: 42 },
    { name: 'Emirates', logo: emiratesLogo, h: 32 },
    { name: 'Etihad Airways', logo: etihadLogo, h: 32 },
    { name: 'Qatar Airways', logo: qatarLogo, h: 46 },
    { name: 'Turkish Airlines', logo: turkishLogo, h: 46 },
    { name: 'Malaysia Airlines', logo: malaysiaLogo, h: 36 },
    { name: 'Oman Air', logo: omanLogo, h: 38 },
    { name: 'Royal Brunei Airlines', logo: bruneiLogo, h: 38 },
    { name: 'Scoot', logo: scootLogo, h: 30 },
]

// Duplicate for seamless infinite scroll
const doubled = [...airlines, ...airlines]

export default function AirlineLogos() {
    return (
        <section id="airlines" className="py-12 bg-white border-y border-sage/20 overflow-hidden">

            <p className="text-center section-label mb-8">Maskapai Rekanan Resmi</p>

            {/* Marquee wrapper */}
            <div className="relative w-full overflow-hidden">

                {/* Left fade */}
                <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to right, white 0%, transparent 100%)' }} />
                {/* Right fade */}
                <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, white 0%, transparent 100%)' }} />

                <div className="flex items-center" style={{ animation: 'marquee 28s linear infinite' }}>
                    {doubled.map((airline, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 flex items-center justify-center mx-10"
                            title={airline.name}
                        >
                            <img
                                src={airline.logo}
                                alt={airline.name}
                                style={{
                                    height: airline.h,
                                    width: 'auto',
                                    maxWidth: 120,
                                    objectFit: 'contain',
                                    filter: 'grayscale(30%) opacity(0.75)',
                                    transition: 'filter 0.25s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'grayscale(30%) opacity(0.75)'}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </section>
    )
}
