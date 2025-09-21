import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-8 space-y-4 font-sans">
      <h1 className="text-3xl font-bold text-primary">Tailwind Colors Test</h1>

      {/* Primary color */}
      <div className="p-4 bg-primary text-white rounded-lg">
        Primary Color (#7F5AF0)
      </div>

      {/* Secondary color */}
      <div className="p-4 bg-secondary text-primary rounded-lg">
        Secondary Color (#E0E7FF)
      </div>

      {/* Danger color */}
      <div className="p-4 bg-danger text-white rounded-lg">
        Danger Color (#F43F5E)
      </div>

      {/* NSFW color */}
      <div className="p-4 bg-nsfw text-white rounded-lg">
        NSFW Color (#EF4444)
      </div>

      {/* Premium gradient */}
      <div className="p-4 bg-premium-gradient text-white rounded-lg">
        Premium Gradient (linear-gradient(to right, #7928CA, #FF0080))
      </div>

      {/* Hero gradient */}
      <div className="p-4 bg-hero-gradient text-white rounded-lg">
        Hero Gradient (linear-gradient(135deg, #7F5AF0 0%, #2563EB 100%))
      </div>

      {/* Font test */}
      <div className="p-4 border border-gray-300 rounded-lg">
        <p className="font-normal">Inter Font - Regular (400)</p>
        <p className="font-medium">Inter Font - Medium (500)</p>
        <p className="font-semibold">Inter Font - Semibold (600)</p>
        <p className="font-bold">Inter Font - Bold (700)</p>
      </div>

      {/* Animation test */}
      <div className="p-4 border border-gray-300 rounded-lg space-y-2">
        <div className="w-8 h-8 bg-primary rounded animate-spin mx-auto"></div>
        <div className="w-8 h-8 bg-accent rounded animate-pulse mx-auto"></div>
        <div className="w-8 h-8 bg-danger rounded animate-bounce mx-auto"></div>
      </div>
    </div>
  );
};

export default TailwindTest;
