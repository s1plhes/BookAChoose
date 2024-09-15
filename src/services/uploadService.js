// src/services/uploadService.js
export class UploadService {
    async uploadFile(file) {
        if (!file) {
            throw new Error('Please select a file first');
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/upload`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                return result.url; // Retorna la URL del archivo subido
            } else {
                throw new Error('File upload failed: ' + result.message);
            }
        } catch (error) {
            throw new Error('An error occurred: ' + error.message);
        }
    }
}

export default new UploadService();
