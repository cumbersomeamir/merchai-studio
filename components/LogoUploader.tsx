
import React from 'react';

interface LogoUploaderProps {
  onUpload: (base64: string) => void;
  currentLogo: string | null;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onUpload, currentLogo }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50 hover:border-blue-500 transition-colors cursor-pointer relative group">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      {currentLogo ? (
        <div className="flex flex-col items-center space-y-4">
          <img src={currentLogo} alt="Logo Preview" className="h-24 object-contain" />
          <p className="text-xs text-slate-400">Click or drag to change logo</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2 py-4">
          <i className="fa-solid fa-cloud-arrow-up text-3xl text-blue-400"></i>
          <p className="text-sm font-medium text-slate-200">Upload your logo</p>
          <p className="text-xs text-slate-500">PNG or SVG with transparency works best</p>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;
