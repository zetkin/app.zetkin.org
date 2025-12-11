'use client';
import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocs() {
  useEffect(() => {
    const checkCookie = () => {
      const cookies = document.cookie.split(';');
      const zsidCookie = cookies.find((c) => c.trim().startsWith('zsid='));

      if (zsidCookie) {
        const zsidValue = zsidCookie.split('=')[1];
        setTimeout(() => {
          const swaggerUI = (window as any).ui;
          if (swaggerUI && zsidValue) {
            swaggerUI.preauthorizeApiKey('cookieAuth', zsidValue);
          }
        }, 1000);
      }
    };

    checkCookie();
  }, []);

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #1a1a1a;
        }

        .swagger-ui {
          filter: invert(88%) hue-rotate(180deg);
        }

        .swagger-ui .scheme-container {
          background: #fff;
          box-shadow: 0 1px 2px #00000026;
          margin: 0 0 20px;
          padding: 30px 0;
        }

        .swagger-ui .microlight {
          filter: invert(100%) hue-rotate(180deg);
        }

        .swagger-ui img {
          filter: invert(100%) hue-rotate(180deg);
        }

        .swagger-ui .opblock-tag {
          border-bottom: 1px solid #555;
        }

        .swagger-ui .opblock {
          border: 1px solid #555;
          background: #2a2a2a;
        }

        .swagger-ui .opblock .opblock-summary {
          border-color: #555;
        }

        .swagger-ui .topbar {
          background: #2a2a2a;
        }

        .swagger-ui select {
          background: #2a2a2a;
          color: #e0e0e0;
          border: 1px solid #555;
        }

        .swagger-ui label {
          color: #e0e0e0;
        }

        .swagger-ui .btn.authorize.locked span::after {
          content: 'd';
        }
      `}</style>
      <SwaggerUI
        url="/openapi/openapi.json"
        docExpansion="none"
        defaultModelsExpandDepth={-1}
        displayRequestDuration={true}
        filter={false}
        onComplete={(system: any) => {
          (window as any).ui = system;

          const cookies = document.cookie.split(';');
          const zsidCookie = cookies.find((c) => c.trim().startsWith('zsid='));
          if (zsidCookie) {
            const zsidValue = zsidCookie.split('=')[1];
            if (zsidValue) {
              system.preauthorizeApiKey('cookieAuth', zsidValue);
            }
          }
        }}
      />
    </>
  );
}
