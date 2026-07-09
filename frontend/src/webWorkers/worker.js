// worker для отправки файлов на сервер


console.log('Web Worker запущен!');

const url = import.meta.env.VITE_API_URL;

self.addEventListener('message', async (e) => {
    const { file, fullName, comment, userId, token } = e.data;
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', fullName);
        formData.append('comment', comment);
        formData.append('size', file.size);
        formData.append('user', userId);
        
        const response = await fetch(`${url}/api/files/post/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        
        if (response.ok) {
            const newFile = await response.json();
            self.postMessage({ success: true, data: newFile });
        } else {
            const errorData = await response.json();
            self.postMessage({ success: false, error: errorData });
        }
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
});
