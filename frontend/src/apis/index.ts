export const ErrServerError = 'SERVER';
export const ErrNetworkUnreachable = 'NETWORK';

const baseUrl = 'http://localhost:9000';

export const sendRequest = async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body: unknown = null,
) => {
    //const token = localStorage.getItem('token');
    const url = `${baseUrl}/${endpoint}`;
    const headers: { [key: string]: string; } = {
        'Content-Type': 'application/json'
    };
    // if (token) {
    //    headers.Authorization = 'Bearer ' + token;
    //}
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        if (response.status >= 400 && response.status < 500) {
            const json = await response.json();
            throw new Error(json.message);
        } else if (response.status >= 500) {
            throw new Error(ErrServerError);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        const err: Error = error as Error;
        if (
            err.message === 'Network request failed' ||
            err.message.includes('invalid token')
        ) {
            throw new Error(ErrNetworkUnreachable);
        }
        throw error;
    }
};

