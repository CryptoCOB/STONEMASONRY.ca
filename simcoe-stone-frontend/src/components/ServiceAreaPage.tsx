import React from 'react';
import { useParams } from 'react-router-dom';
import AdvancedSEO from './AdvancedSEO';

interface AreaConfig {
    name: string;
    title: string;
    description: string;
    intro: string;
    focusServices: string[];
    keywords: string[];
}

const areas: Record<string, AreaConfig> = {
    'barrie-stone-masonry': {
        name: 'Barrie',
        title: 'Barrie Stone Masonry Services | STONEMASONRY.CA',
        description: 'Professional stone masonry services in Barrie: fireplaces, retaining walls, patios, restoration & emergency repairs.',
        intro: 'Serving Barrie with high-end residential and estate-grade stone craftsmanship for over two decades.',
        focusServices: ['Custom Fireplaces', 'Retaining Walls', 'Stone Patios', 'Heritage Restoration', 'Emergency Stone Repair'],
        keywords: ['Barrie stone masonry', 'Barrie stone repair', 'Barrie fireplace installation']
    },
    'midland-stone-masonry': {
        name: 'Midland',
        title: 'Midland Stone Masonry Services | STONEMASONRY.CA',
        description: 'Premium stone masonry services in Midland and Georgian Bay area. Structural, aesthetic & restoration work.',
        intro: 'From waterfront properties to heritage structures, we deliver precision stonework throughout Midland.',
        focusServices: ['Waterfront Stonework', 'Chimney Repair', 'Patio Construction', 'Stone Veneer', 'Custom Fireplaces'],
        keywords: ['Midland stone masonry', 'Georgian Bay masonry', 'Midland stone contractor']
    },
    'orillia-stone-masonry': {
        name: 'Orillia',
        title: 'Orillia Stone Masonry Experts | STONEMASONRY.CA',
        description: 'Orillia stone masonry services including structural repair, custom outdoor living, and precision stone installations.',
        intro: 'We support Orillia homeowners and builders with stone projects built for durability and character.',
        focusServices: ['Retaining Walls', 'Outdoor Living Spaces', 'Stone Walkways', 'Fireplace Installation', 'Brick & Chimney Repair'],
        keywords: ['Orillia stone masonry', 'Orillia masonry repair', 'stone contractor Orillia']
    },
    'collingwood-stone-masonry': {
        name: 'Collingwood',
        title: 'Collingwood Stone Masonry | Custom & Structural Work',
        description: 'Custom stone masonry craftsmanship in Collingwood: heritage restoration, estate builds, patios, retaining systems.',
        intro: 'Delivering refined masonry solutions for Collingwood homes, chalets, and heritage properties.',
        focusServices: ['Heritage Restoration', 'Stone Patios', 'Retaining Walls', 'Fireplace Masonry', 'Structural Repair'],
        keywords: ['Collingwood stone masonry', 'Collingwood heritage stone', 'stone patio Collingwood']
    },
    'muskoka-stone-masonry': {
        name: 'Muskoka',
        title: 'Muskoka Cottage Stone Masonry | Luxury Craftsmanship',
        description: 'Luxury stone masonry for Muskoka cottages & estates: fireplaces, outdoor living, retaining walls, pathways.',
        intro: 'We elevate Muskoka properties with bespoke natural stone placements built for rugged beauty and longevity.',
        focusServices: ['Outdoor Living Spaces', 'Custom Fireplaces', 'Natural Stone Pathways', 'Retaining Systems', 'Waterfront Stone Features'],
        keywords: ['Muskoka stone masonry', 'Muskoka cottage stonework', 'Muskoka outdoor stone']
    }
};

const ServiceAreaPage: React.FC = () => {
    const { areaSlug } = useParams<{ areaSlug: string }>();
    const area = areaSlug ? areas[areaSlug] : undefined;

    if (!area) {
        return <div className="container-custom py-24 text-center"><h1 className="heading-h2 text-primaryRed">Service Area Not Found</h1><p className="mt-4 text-gray-600">This location page is coming soon. View our core services or contact the team directly.</p></div>;
    }

    return (
        <div className="container-custom py-16">
            <AdvancedSEO
                title={area.title}
                description={area.description}
                keywords={area.keywords}
                canonicalUrl={`https://stonemasonry.ca/service-areas/${areaSlug}`}
                breadcrumbs={[{ name: 'Service Areas', url: 'https://stonemasonry.ca/service-areas' }, { name: area.name, url: `https://stonemasonry.ca/service-areas/${areaSlug}` }]}
            />
            <header className="mb-10 text-center">
                <h1 className="heading-h1 text-primaryRed mb-4">{area.name} Stone Masonry</h1>
                <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">{area.intro}</p>
            </header>
            <section className="grid md:grid-cols-2 gap-10 mb-16">
                <div>
                    <h2 className="heading-h3 mb-4 text-gray-800">Focus Services</h2>
                    <ul className="space-y-2">
                        {area.focusServices.map(s => <li key={s} className="pl-4 border-l-2 border-primaryRed text-gray-700">{s}</li>)}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="heading-h4 mb-3 text-primaryRed">Request Local Consultation</h3>
                    <p className="text-sm text-gray-600 mb-4">We tailor stone solutions to regional climate, soil conditions, and architectural style.</p>
                    <a href="/consultation" className="btn-primary inline-block">Book a Consultation</a>
                </div>
            </section>
        </div>
    );
};

export default ServiceAreaPage;
