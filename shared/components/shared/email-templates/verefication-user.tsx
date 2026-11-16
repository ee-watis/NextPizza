import React from 'react';

interface EmailTemplateProps {
  code: string;
}

export function VerificationUserTemplate({ code }: EmailTemplateProps) {
  return (
    <div>
        <p>Код подтверждения: <h2>{code}</h2></p>
    
        <a href={`http://localhost:3000/api/auth/verify?code=${code}`}>Подтвердить регистрацию</a>
    </div>
  );
}