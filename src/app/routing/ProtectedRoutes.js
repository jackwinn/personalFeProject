import React from 'react';
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, moduleName, userModules, ...rest }) => {
    const userSlice = useSelector((state) => state.user)
    const getModuleAccess = userModules?.find(module => module.name === moduleName && module.read);

    return (
        getModuleAccess ?
            <Component />
            : userSlice.role !== 'Tenant' ?
                <Navigate to='/dashboard' />
                : <Navigate to='/tenant-dashboard' />
    );
};

export default ProtectedRoute;
