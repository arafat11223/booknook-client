
type ImageUploadResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
};

export async function uploadImage(image: File): Promise<string> {
  const formData = new FormData();

  formData.append("image", image);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result =
    (await response.json()) as ImageUploadResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Image upload failed.");
  }

  return result.data.url;
}
