// Shared cache for resource details across all components
const resourceDetailsCache = new Map<string, any>();

// In-flight request tracking to prevent duplicate requests
const pendingRequests = new Map<string, Promise<any>>();

export const getResourceFromCache = (resourceId: string) => {
    return resourceDetailsCache.get(resourceId);
};

export const setResourceInCache = (resourceId: string, data: any) => {
    resourceDetailsCache.set(resourceId, data);
};

export const hasResourceInCache = (resourceId: string) => {
    return resourceDetailsCache.has(resourceId);
};

export const getCachedOrFetch = async (
    resourceId: string,
    fetchFn: () => Promise<any>
): Promise<any> => {
    // Return from cache if available
    if (resourceDetailsCache.has(resourceId)) {
        return resourceDetailsCache.get(resourceId);
    }

    // Return pending request if already in flight
    if (pendingRequests.has(resourceId)) {
        return pendingRequests.get(resourceId);
    }

    // Create new request
    const request = fetchFn().then((data) => {
        resourceDetailsCache.set(resourceId, data);
        pendingRequests.delete(resourceId);
        return data;
    }).catch((error) => {
        pendingRequests.delete(resourceId);
        throw error;
    });

    pendingRequests.set(resourceId, request);
    return request;
};

export const clearResourceCache = () => {
    resourceDetailsCache.clear();
    pendingRequests.clear();
};
