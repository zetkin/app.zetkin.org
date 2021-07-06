import React from 'react';

const OrganizationContext = React.createContext<{orgId: string }>({ orgId: '' });

export default OrganizationContext;
