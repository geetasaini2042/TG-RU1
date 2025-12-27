import React from 'react';

const WelcomeText = ({ name }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-white mb-1">Welcome Back!</h2>
      <p className="text-blue-200 text-sm font-medium">
        Ready to study, {name?.split(' ')[0]}?
      </p>
    </div>
  );
};

export default WelcomeText;
