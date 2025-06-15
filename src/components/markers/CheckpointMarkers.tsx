import React from 'react';
import { PortfolioSection } from '../../App';

interface CheckpointMarkersProps {
  sections: PortfolioSection[];
  onSectionTrigger: (section: PortfolioSection | null) => void;
}

const CheckpointMarkers: React.FC<CheckpointMarkersProps> = () => {
  return null; // Temporarily disabled
};

export default CheckpointMarkers;