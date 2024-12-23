import { useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/useAxiosSecure/useAxiosSecure";
import { DataTable } from "./DataTable";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import Swal from "sweetalert2";
import { MdDelete, MdEdit } from "react-icons/md";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
const Users = () => {
  const axiosSecure = useAxiosSecure();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState('all');
  const [date, setDate] = useState('newest');
  const limit = 10;
  const [role, setRole] = useState("all");
  // Fetch users
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["users", currentPage, debouncedSearchTerm, status, date, role],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        search: debouncedSearchTerm,
        role: role === "all" ? "" : role,
        status:status=='all'?'':status,
        date,
      });
      const response = await axiosSecure.get(`/users?${params.toString()}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Mutation to update user
  const updateUser = useMutation({
    mutationFn: async (updatedUser) => {
      const response = await axiosSecure.put(`/users/${updatedUser.id}`, updatedUser);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update user!");
    },
  });

  // Mutation to delete user
  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      await axiosSecure.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "User has been deleted.", "success");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete user!");
    },
  });

  const onDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate(userId);
      }
    });
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setCurrentPage(1); 
  };
  
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (data?.totalPages && currentPage < data.totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Columns for DataTable
  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Role", accessorKey: "role" },
    { header: "Win Balance", accessorKey: "winBalance" },
    { header: "Deposit Balance", accessorKey: "depositBalance" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        const statusClass = {
          active: "bg-green-100 text-green-600",
          block: "bg-red-100 text-red-600",
          ban: "bg-gray-100 text-gray-600",
        }[status] || "bg-gray-100 text-gray-600";

        return <span className={`px-2 py-1 rounded ${statusClass}`}>{status}</span>;
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <button
              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => setSelectedUser(user)}
            >
              <MdEdit />
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => onDelete(user.uid)}
            >
              <MdDelete />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Users</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row  items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
<Select onValueChange={handleRoleChange} value={role}>
  <SelectTrigger className="w-full md:w-1/4">
    <div className="w-full">
      {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
    </div>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Roles</SelectItem>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="moderator">Moderator</SelectItem>
    <SelectItem value="user">User</SelectItem>
  </SelectContent>
</Select>
        <Select onValueChange={setStatus} value={status}>
          <SelectTrigger className="w-full md:w-1/4">{status}</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="block">Blocked</SelectItem>
            <SelectItem value="ban">Banned</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setDate} value={date}>
          <SelectTrigger className="w-full md:w-1/4">{date === 'newest' ? 'Newest' : 'Oldest'}</SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data.</p>}
      {data && (
        <>
          <DataTable columns={columns} data={data.users} />
            <Pagination className={'mt-8'}>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationPrevious>
              {Array.from({ length: data?.totalPages || 1 }).map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded ${
                        currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, data?.totalPages || 1))
                }
                disabled={currentPage === data?.totalPages}
              >
                Next
              </PaginationNext>
            </PaginationContent>
          </Pagination>
       
        </>
      )}

      {/* Edit Dialog */}
      {selectedUser && (
  <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
    <DialogContent>
      <DialogHeader>
        <h3 className="text-lg font-semibold">Edit User</h3>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUser.mutate({ id: selectedUser._id, ...selectedUser });
          setSelectedUser(null);
        }}
        className="space-y-4"
      >
        {/* Name */}
    <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            />
          </div>
  
          {/* Email */}
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={selectedUser.email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 text-gray-500"
            />
          </div>
    </div>

        {/* Phone */}
    <div className="flex gap-2">
          <div className="w-3/4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone:</label>
            <input
              type="text"
              value={selectedUser.phone || ''}
              onChange={(e) =>
                setSelectedUser((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            />
          </div>
  
          {/* Role */}
          <div className="w-1/4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Role:</label>
            <select
              value={selectedUser.role || 'user'}
              onChange={(e) =>
                setSelectedUser((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
    </div>

        {/* Status */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Status:</label>
          <select
            value={selectedUser.status || 'active'}
            onChange={(e) =>
              setSelectedUser((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
          >
            <option value="active">Active</option>
            <option value="block">Block</option>
            <option value="ban">Ban</option>
          </select>
        </div>

        {/* Deposit Balance */}
    <div className="flex gap-2">
          <div  className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Deposit Balance:</label>
            <input
              type="number"
              value={selectedUser.depositBalance || ''}
              onChange={(e) =>
                setSelectedUser((prev) => ({
                  ...prev,
                  depositBalance: Number(e.target.value),
                }))
              }
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            />
          </div>
  
          {/* Win Balance */}
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Win Balance:</label>
            <input
              type="number"
              value={selectedUser.winBalance || ''}
              onChange={(e) =>
                setSelectedUser((prev) => ({
                  ...prev,
                  winBalance: Number(e.target.value),
                }))
              }
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            />
          </div>
    </div>

        {/* Dialog Footer */}
        <DialogFooter className="mt-4">
          <button
            type="button"
            onClick={() => setSelectedUser(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
)}


    </div>
  );
};

export default Users;
