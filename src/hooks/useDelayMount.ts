import { useEffect, useState } from 'react';

function useDelayUnmount(isMounted: boolean, delayTime: number) {
    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        let timeoutId: number;

        if (!isMounted && showComponent) {
            setShowComponent(false);
        } else if (isMounted && !showComponent) {
            timeoutId = window.setTimeout(() => setShowComponent(true), delayTime);
        }

        return () => clearTimeout(timeoutId);
    }, [isMounted, delayTime, showComponent]);

    return showComponent;
}

export default useDelayUnmount;
