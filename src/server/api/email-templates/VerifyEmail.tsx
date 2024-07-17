import * as React from "react";

interface VerifyEmailTemplateProps {
  name: string;
  code: string;
}

const VerifyEmailTemplate: React.FC<Readonly<VerifyEmailTemplateProps>> = ({ name, code }) => (
  <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">Welcome {name}, to Roc8 Moonshot Ecommerce</h1>
    </div>
    <div className="space-y-2">
      <p className="text-gray-700">
        Thank you for joining the Roc8 Moonshot Ecommerce family! Here’s your verification code. This code will be <strong>valid for 1 hour</strong>.
      </p>
      <h2 className="text-lg text-black">{ code }</h2>
    </div>
    <div className="text-gray-600 text-sm">
      <p>If you did not register for this account, please ignore this email.</p>
      <p>Thank you,</p>
      <p>The Roc8 Moonshot Ecommerce Team</p>
    </div>
  </div>
);

export default VerifyEmailTemplate;
