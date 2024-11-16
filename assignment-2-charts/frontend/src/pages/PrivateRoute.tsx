import { SERVER_ADDRESS } from '@/global/global-variables';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ForbiddenPage } from './ForbiddenPage';

export const PrivateRoutes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    async function getUser() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            const config = {
                method: 'get',
                url: `${SERVER_ADDRESS}auth/me`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.request(config);
            if (response.status === 200) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? <Outlet /> : <ForbiddenPage />;
};
