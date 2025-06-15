import React from 'react';

export interface PortfolioSection {
  id: string;
  title: string;
  // Add other fields as needed
}

interface CheckpointMarkersProps {
  sections: PortfolioSection[];
  onSectionTrigger: (section: PortfolioSection | null) => void;
}

const CheckpointMarkers: React.FC<CheckpointMarkersProps> = () => {
  return null; // Temporarily disabled
};

export default CheckpointMarkers;