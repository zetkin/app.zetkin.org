import React from 'react';

const OrganizationContext = React.createContext<{orgId: string | undefined}>({ orgId: undefined });

export default OrganizationContext;
