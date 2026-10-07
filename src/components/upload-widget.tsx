import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_DELETE_URL,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/constants";
import { UploadWidgetValue } from "@/types";
import { Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (value: UploadWidgetValue | null) => void;
    disabled?: boolean;
}

const UploadWidget = ({ value = null, onChange, disabled = false }: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "uploads",
          maxFileSize: 5000000,
          clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };
            setPreview(payload);
            setDeleteToken(result.info.delete_token ?? null);
            onChangeRef.current?.(payload);
          }
        }
      );
      return true;
    };

    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  const handleDelete = async () => {
    if (!preview) return;

    if (!deleteToken) {
      setPreview(null);
      onChangeRef.current?.(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("token", deleteToken!);

      const response = await fetch(CLOUDINARY_DELETE_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      setPreview(null);
      setDeleteToken(null);
      onChangeRef.current?.(null);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Uploaded file" />

          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete image"
            className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white transition hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
