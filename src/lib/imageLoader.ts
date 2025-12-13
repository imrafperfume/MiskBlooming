export default function cloudinaryLoader({ src, width, quality }: any) {
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];

  // If src is already a full Cloudinary URL, we need to insert params
  if (src.includes("res.cloudinary.com")) {
    const parts = src.split("/upload/");
    return `${parts[0]}/upload/${params.join(",")}/${parts[1]}`;
  }

  return src;
}
