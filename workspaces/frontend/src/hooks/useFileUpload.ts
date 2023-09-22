export const useFileUpload = () => {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_TRPC_URL}/fileUpload.uploadFile`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload the file');
      }

      const responseData = await response.json();

      const imageUrl = responseData?.result?.data?.json?.Location;

      if (!imageUrl) {
        throw new Error('Failed to get the image URL from the response');
      }

      return imageUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  return { handleUpload };
};
