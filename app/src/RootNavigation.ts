import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name: string, params?: { [key: string]: string }) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params as never);
    }
}

export function getRootNavigationState() {
    if (navigationRef.isReady()) {
        return navigationRef.getCurrentRoute()
    }
    return false
}
