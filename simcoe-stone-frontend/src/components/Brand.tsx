import React from 'react';

interface BrandProps {
    as?: any; // simplified to avoid JSX namespace typing issues
    className?: string;
    inline?: boolean;
}

// Central brand rendering: big, bold, red stonemasonry.ca
const Brand: React.FC<BrandProps> = ({ as = 'span', className = '', inline = true }) => {
    const Comp: any = as;
    return (
        <Comp
            className={`font-extrabold tracking-tight text-red-600 ${inline ? 'inline-block' : 'block'} text-lg md:text-2xl lg:text-3xl ${className}`}
            style={{ letterSpacing: '-0.5px' }}
        >
            STONEMASONRY.CA
        </Comp>
    );
};

export default Brand;
