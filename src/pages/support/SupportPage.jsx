import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from './../../hooks/useAxiosSecure/useAxiosSecure';
// Assuming this hook is defined to get the axios instance.

const SupportPage = () => {
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({ icon: "", link: "", name: "" });

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
    mutationFn: async (newSupport) =>
      await axiosSecure.post(`/supports`, newSupport),
    onSuccess: () => {
      toast.success("Support added successfully!");
      refetch();
      setFormData({ icon: "", link: "", name: "" });
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

  // Handle adding support
  const handleAddSupport = () => {
    if (!formData.icon || !formData.link) {
      toast.error("Icon and Link are required!");
      return;
    }
    addMutation.mutate(formData);
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
      <div className="mb-6">
        <Input
          placeholder="Icon URL"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="mb-2"
        />
        <Input
          placeholder="Link URL"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="mb-2"
        />
        <Input
          placeholder="Name (optional)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mb-2"
        />
        <Button onClick={handleAddSupport} disabled={addMutation.isLoading}>
          {addMutation.isLoading ? "Adding..." : "Add Support"}
        </Button>
      </div>

      {/* Support Cards */}
      {isLoading
        ? renderSkeleton()
        : supports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supports.map((support) => (
              <div key={support._id} className="border p-4 rounded-lg shadow-md">
                <img
                  src={support.icon}
                  alt="Icon"
                  className="h-16 w-16 mx-auto mb-2"
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
