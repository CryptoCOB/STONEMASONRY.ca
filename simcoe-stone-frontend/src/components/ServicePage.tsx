import React from 'react';
import { useParams } from 'react-router-dom';
import AdvancedSEO from './AdvancedSEO';

interface ServiceConfig {
    title: string;
    description: string;
    intro: string;
    benefits: string[];
    keywords: string[];
}

const services: Record<string, ServiceConfig> = {
    'fireplace-installation': {
        title: 'Custom Stone Fireplace Installation | STONEMASONRY.CA',
        description: 'Design & installation of custom indoor/outdoor stone fireplaces across Ontario. Premium materials, precision craftsmanship, lasting performance.',
        intro: 'We design and build premium custom stone fireplaces that become the architectural heart of your space.',
        benefits: [
            'Custom design & material sourcing',
            'Indoor & outdoor applications',
            'Precision draft & venting considerations',
            'Natural & manufactured stone options',
            'Integration with mantels & feature walls'
        ],
        keywords: ['stone fireplace installation', 'custom fireplace Ontario', 'outdoor stone fireplace']
    },
    'retaining-walls': {
        title: 'Retaining Wall Construction | Structural Stone Solutions',
        description: 'Engineered natural stone retaining walls built for longevity and drainage performance. Residential & estate-grade installs.',
        intro: 'Our retaining walls are engineered for stability, drainage, and refined aesthetics.',
        benefits: [
            'Engineered stability',
            'Proper drainage systems',
            'Frost heave mitigation',
            'Premium natural stone sourcing',
            'Structural + decorative hybrid designs'
        ],
        keywords: ['stone retaining wall', 'retaining wall contractor', 'natural stone wall Ontario']
    },
    'heritage-restoration': {
        title: 'Heritage Stone Restoration Specialists | Conservation Masonry',
        description: 'Expert restoration of historic stone structures using conservation-grade techniques and materials for authentic preservation.',
        intro: 'We specialize in the preservation and restoration of heritage stone elements with authenticity and structural respect.',
        benefits: [
            'Lime-based mortar matching',
            'Stone sourcing & replication',
            'Structural stabilization',
            'Water ingress remediation',
            'Historic detail preservation'
        ],
        keywords: ['heritage stone restoration', 'historic masonry repair', 'lime mortar restoration']
    },
    'patio-construction': {
        title: 'Stone Patio Construction | Outdoor Living Foundations',
        description: 'Custom stone patio design & installation for luxury outdoor living spaces. Drainage, base prep, premium finishes.',
        intro: 'We build stone patios that balance drainage performance, structural integrity, and finish elegance.',
        benefits: [
            'Proper base excavation & compaction',
            'Drainage & grading considerations',
            'Custom edge restraints',
            'Premium natural stone or paver options',
            'Integration with walkways & fire features'
        ],
        keywords: ['stone patio construction', 'natural stone patio', 'outdoor stone contractor']
    },
    'walkway-installation': {
        title: 'Stone Walkway Installation | Precision Surface Craft',
        description: 'Durable natural stone & paver walkway design and installation. Safe, stable, visually cohesive pathways.',
        intro: 'Our stone walkways are crafted for durability, safety, and architectural alignment with the property.',
        benefits: [
            'Frost-resistant base',
            'Precision joint alignment',
            'Slip-resistant finishes',
            'Curved & multi-plane layouts',
            'Integration with patios & entrances'
        ],
        keywords: ['stone walkway installation', 'stone path builder', 'natural stone walkway Ontario']
    },
    'chimney-repair': {
        title: 'Chimney Repair & Rebuilds | Masonry Safety Experts',
        description: 'Structural chimney repair, rebuilds, crown replacement, flashing fixes, liner coordination & safety remediation.',
        intro: 'We repair and rebuild damaged chimneys ensuring structural safety, draft performance, and weather resilience.',
        benefits: [
            'Full/partial rebuilds',
            'Crown & cap replacement',
            'Leak & flashing remediation',
            'Brick & stone integration',
            'Fireplace system compatibility'
        ],
        keywords: ['chimney repair Ontario', 'chimney rebuild', 'masonry chimney services']
    },
    'brick-repair': {
        title: 'Brick Repair & Repointing | Structural Envelope Care',
        description: 'Crack repair, repointing, mortar joint restoration, brick replacement & structural stabilization.',
        intro: 'We restore failing brickwork using compatible mortar systems and precise joint tooling.',
        benefits: [
            'Mortar color & composition matching',
            'Spall & crack remediation',
            'Localized rebuilds',
            'Moisture management',
            'Facade aesthetic preservation'
        ],
        keywords: ['brick repair', 'repointing service', 'brick masonry restoration']
    }
};

const ServicePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const service = slug ? services[slug] : undefined;

    if (!service) {
        return <div className="container-custom py-24 text-center"><h1 className="heading-h2 text-primaryRed">Service Not Found</h1><p className="mt-4 text-gray-600">This service page is coming soon. Please explore our core offerings or contact us directly.</p></div>;
    }

    return (
        <div className="container-custom py-16">
            <AdvancedSEO
                title={service.title}
                description={service.description}
                keywords={service.keywords}
                canonicalUrl={`https://stonemasonry.ca/services/${slug}`}
                serviceType={service.title}
                breadcrumbs={[{ name: 'Services', url: 'https://stonemasonry.ca/services' }, { name: service.title, url: `https://stonemasonry.ca/services/${slug}` }]}
            />
            <header className="mb-10 text-center">
                <h1 className="heading-h1 text-primaryRed mb-4">{service.title}</h1>
                <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">{service.intro}</p>
            </header>
            <section className="grid md:grid-cols-2 gap-10 mb-16">
                <div>
                    <h2 className="heading-h3 mb-4 text-gray-800">Why This Service Matters</h2>
                    <p className="text-gray-700 mb-6">{service.description}</p>
                    <ul className="space-y-2">
                        {service.benefits.map(b => <li key={b} className="pl-4 border-l-2 border-primaryRed text-gray-700">{b}</li>)}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="heading-h4 mb-3 text-primaryRed">Request a Consultation</h3>
                    <p className="text-sm text-gray-600 mb-4">Get expert recommendations, transparent pricing, and material guidance for your project.</p>
                    <a href="/consultation" className="btn-primary inline-block">Start Your Quote</a>
                </div>
            </section>
        </div>
    );
};

export default ServicePage;
