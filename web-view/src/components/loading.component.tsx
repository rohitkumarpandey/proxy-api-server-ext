import React, { useEffect, useState } from 'react';
import './loading.scss';
import { LoadingService } from '../service/loading.service';
const LoadingComponent: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        // Subscribe to the loading$ observable
        const subscription = LoadingService.loading$.subscribe((loading) => {
            setIsLoading(loading);
        });
        return () => subscription.unsubscribe();
    }, []);
    return (
        <>{isLoading && (
            <div className='loading-container'>
                <div>
                    <div className='loading-box'>
                        <div></div>
                    </div>
                </div>
            </div>
        )
        }
        </>
    );
};

export default LoadingComponent;