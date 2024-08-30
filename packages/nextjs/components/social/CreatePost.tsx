import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Text } from "lucide-react";

const CreatePost: FC<{
  isOpen: boolean;
  setIsPopupOpen: (i: boolean) => void;
}> = ({ isOpen, setIsPopupOpen }) => {
  const [image, setImage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isOpen) document.body.classList.add("lock");
    else document.body.classList.remove("lock");
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 top-0 z-[999] flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-3 transition-opacity ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="relative w-full max-w-[500px] rounded-lg bg-white p-6">
        {image && (
          <div className="mb-2 flex justify-center">
            <Image src={image} alt="product-create" width={300} height={300} />
          </div>
        )}

        <form onSubmit={e => e.preventDefault()}>
          <div className="mb-2 flex items-center gap-3 rounded border px-5 py-3">
            <ImagePlus size={20} color="#9095a9" />
            <input
              onChange={handleFileChange}
              type="file"
              className="block w-full appearance-none text-sm outline-none"
            />
          </div>

          <div className="mb-2 flex gap-3 rounded border px-5 py-3">
            <Text size={20} color="#9095a9" />
            <textarea
              className="block w-full resize-none appearance-none bg-white text-sm outline-none"
              placeholder="Text"
              rows={3}
            />
          </div>

          <div className="mt-5 flex gap-4">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="w-full rounded-md bg-red-400 px-4 py-2 text-white transition-colors hover:bg-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
