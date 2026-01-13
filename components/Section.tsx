import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, className = '', children }) => {
  return (
    <section 
      id={id} 
      className={`min-h-screen w-full flex flex-col justify-center px-6 py-20 md:px-12 lg:px-24 transition-colors duration-700 ease-in-out ${className}`}
    >
      <div className="max-w-7xl mx-auto w-full">
        {children}
      </div>
    </section>
  );
};

export default Section;