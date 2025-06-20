import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 始终可见的打赏二维码卡片
 */
const DonationCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white rounded-lg shadow-xl p-4 w-48 text-center border border-gray-200">
      <h4 className="text-md font-semibold text-gray-800 mb-2">
        {t('donationTitle')}
      </h4>
      <img
        src="/donation-qr-code.png"
        alt="Donation QR Code"
        className="w-full h-auto rounded-md"
      />
      <p className="text-xs text-gray-600 mt-2">
        {t('donationPrompt')}
      </p>
    </div>
  );
};

export default DonationCard; 