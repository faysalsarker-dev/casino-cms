import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "./../../hooks/useAxiosSecure/useAxiosSecure";
import { useForm } from "react-hook-form";
import useAxios from "@/hooks/useAxios/useAxios";

const SupportPage = () => {
  const axiosSecure = useAxiosSecure();
  const [previewImage, setPreviewImage] = useState(null);
  const axiosCommon = useAxios()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch support data
  const {
    data: supports = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["supports"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/supports`);
      return response.data;
    },
  });

  // Add support mutation
  const addMutation = useMutation({
    mutationFn: async (formData) => {
      const form = new FormData();
      form.append("image", formData.image[0]);
      form.append("link", formData.link);
      form.append("name", formData.name);
      return await axiosCommon.post(`/supports`, form);
    },
    onSuccess: () => {
      toast.success("Support added successfully!");
      refetch();
      reset();
      setPreviewImage(null);
    },
    onError: () => toast.error("Failed to add support!"),
  });

  // Delete support mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/supports/${id}`),
    onSuccess: () => {
      toast.success("Support successfully deleted!");
      refetch();
    },
    onError: () => toast.error("Failed to delete support!"),
  });

  // Handle image preview
  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  // Handle adding support
  const onSubmit = (data) => {
    addMutation.mutate(data);
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="border p-4 rounded-lg shadow-md">
          <Skeleton className="h-16 w-16 mx-auto mb-2" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Support Management</h1>

      {/* Add Support Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <Input
          type="file"
          accept="image/*"
          {...register("image", { required: "Image is required" })}
          onChange={handleImagePreview}
          className="mb-2"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="h-16 w-16 object-cover rounded mb-2"
          />
        )}
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

        <Input
          placeholder="Link URL"
          {...register("link", { required: "Link is required" })}
          className="mb-2"
        />
        {errors.link && <p className="text-red-500 text-sm">{errors.link.message}</p>}

        <Input
          placeholder="Name (optional)"
          {...register("name")}
          className="mb-2"
        />

        <Button type="submit" disabled={addMutation.isLoading}>
          {addMutation.isLoading ? "Adding..." : "Add Support"}
        </Button>
      </form>

      {/* Support Cards */}
      {isLoading
        ? renderSkeleton()
        : supports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supports.map((support) => (
              <div key={support._id} className="border p-4 rounded-lg shadow-md">
                <img
                  src={`${import.meta.env.VITE_BACKEND_BASE_URL}/images/${support.image}`}
                  alt="Icon"
                  className="h-16 w-16 mx-auto mb-2 object-cover"
                />

                <h2 className="text-lg font-semibold text-center">
                  {support.name || "Support"}
                </h2>
                <p className="text-center text-blue-500">
                  <a
                    href={support.link.startsWith("http") ? support.link : `http://${support.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Link
                  </a>
                </p>
                <Button
                  variant="destructive"
                  className="mt-4 w-full"
                  onClick={() => deleteMutation.mutate(support._id)}
                  disabled={deleteMutation.isLoading}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p>No supports available</p>
        )}
    </div>
  );
};

export default SupportPage;
