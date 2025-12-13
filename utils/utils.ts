export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "out-of-stock":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-background  text-gray-800";
    default:
      return "bg-background  text-gray-800";
  }
};
