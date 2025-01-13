import { useEffect, useState } from 'react';

function useDelayUnmount(isMounted: boolean, delayTime: number) {
    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        let timeoutId: number;

        if (isMounted && !showComponent) {
            setShowComponent(true);
        } else if (!isMounted && showComponent) {
            timeoutId = window.setTimeout(() => setShowComponent(false), delayTime);
        }

        return () => clearTimeout(timeoutId);
    }, [isMounted, delayTime, showComponent]);

    return showComponent;
}

export default useDelayUnmount;
