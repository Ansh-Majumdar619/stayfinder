import React from 'react';


export default function ImagePreview({ files = [], urls = [] }) {
  return (
    <div className="flex gap-2 flex-wrap mt-2">
      {urls.map((url, i) => (
        <img
          key={`url-${i}`}
          src={url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${url}`}
          alt="existing"
          className="h-20 w-28 object-cover rounded"
        />
      ))}
      {files.map((file, i) => (
        <img
          key={`file-${i}`}
          src={URL.createObjectURL(file)}
          alt="preview"
          className="h-20 w-28 object-cover rounded"
        />
      ))}
    </div>
  );
}
