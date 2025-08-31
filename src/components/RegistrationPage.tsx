import React from 'react';
import { RegistrationSearch } from './RegistrationSearch';

interface RegistrationPageProps {
  isDarkMode?: boolean;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ isDarkMode }) => {
  return (
    <div>
      <RegistrationSearch isDarkMode={isDarkMode} />
    </div>
  );
};