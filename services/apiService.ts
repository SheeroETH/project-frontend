/**
 * Calls the backend to generate/modify the image.
 * Uses VITE_API_URL environment variable if set (for production), otherwise defaults to localhost.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const generatePfp = async (prompt: string, base64Image?: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                image: base64Image,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate image');
        }

        const data = await response.json();
        return data.result;
    } catch (error: any) {
        console.error("Error calling backend:", error);
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server. If testing on mobile, ensure you are using your computer's IP address, not localhost.");
        }
        throw error;
    }
};
