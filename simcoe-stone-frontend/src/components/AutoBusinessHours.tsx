// Auto-updating business hours and availability indicator
// No maintenance required - automatically shows correct hours and status

import React, { useState, useEffect } from 'react';
import { generateDynamicSEO } from '../utils/autoSEO';

interface AutoBusinessHoursProps {
  showStatus?: boolean;
  showEmergencyNote?: boolean;
  className?: string;
}

const AutoBusinessHours: React.FC<AutoBusinessHoursProps> = ({ 
  showStatus = true, 
  showEmergencyNote = true,
  className = ''
}) => {
  const [currentStatus, setCurrentStatus] = useState<'open' | 'closed' | 'emergency'>('closed');
  const [nextOpenTime, setNextOpenTime] = useState<string>('');

  useEffect(() => {
    const updateBusinessStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Business hours: Mon-Fri 7AM-7PM, Sat 8AM-4PM, Sun Emergency only
      let isOpen = false;
      let nextOpen = '';

      if (currentDay >= 1 && currentDay <= 5) { // Monday to Friday
        isOpen = currentHour >= 7 && currentHour < 19;
        if (!isOpen && currentHour < 7) {
          nextOpen = 'Opens at 7:00 AM';
        } else if (!isOpen && currentHour >= 19) {
          nextOpen = 'Opens tomorrow at 7:00 AM';
        }
      } else if (currentDay === 6) { // Saturday
        isOpen = currentHour >= 8 && currentHour < 16;
        if (!isOpen && currentHour < 8) {
          nextOpen = 'Opens at 8:00 AM';
        } else if (!isOpen && currentHour >= 16) {
          nextOpen = 'Opens Monday at 7:00 AM';
        }
      } else { // Sunday
        isOpen = false;
        nextOpen = 'Opens Monday at 7:00 AM';
      }

      setCurrentStatus(isOpen ? 'open' : 'emergency');
      setNextOpenTime(nextOpen);
    };

    // Update immediately
    updateBusinessStatus();
    
    // Update every minute
    const interval = setInterval(updateBusinessStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const seoData = generateDynamicSEO();

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'open': return 'text-green-600';
      case 'emergency': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case 'open': return 'Open Now';
      case 'emergency': return 'Emergency Service Available';
      default: return 'Closed';
    }
  };

  return (
    <div className={`auto-business-hours ${className}`}>
      {/* Business Hours Display */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">Business Hours</h3>
        {seoData.businessHours.map((hours, index) => (
          <div key={index} className="text-sm text-gray-600">
            {hours}
          </div>
        ))}
      </div>

      {/* Current Status */}
      {showStatus && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          {nextOpenTime && currentStatus !== 'open' && (
            <div className="text-sm text-gray-600 mt-1">
              {nextOpenTime}
            </div>
          )}
        </div>
      )}

      {/* Emergency Service Note */}
      {showEmergencyNote && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-semibold text-sm">
            24/7 Emergency Service
          </div>
          <div className="text-red-700 text-xs mt-1">
            For urgent stone masonry repairs, call (705) 341-5285 anytime
          </div>
        </div>
      )}

      {/* Structured Data for Business Hours */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OpeningHoursSpecification",
            "opens": currentStatus === 'open' ? "Now" : nextOpenTime,
            "validFrom": new Date().toISOString().split('T')[0],
            "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          })
        }}
      />
    </div>
  );
};

export default AutoBusinessHours;
