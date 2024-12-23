import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure/useAxiosSecure';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; 
import { MdDelete, MdEdit } from 'react-icons/md';
import { DataTable } from '../users/DataTable';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const DepositPage = () => {
  const axiosSecure = useAxiosSecure();
  const [status, setStatus] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false); // Manage dialog visibility

  const openDialog = (transaction) => {
    setCurrentTransaction({ ...transaction });
    setDialogOpen(true); // Open the dialog
  };

  const closeDialog = () => {
    setDialogOpen(false); // Close the dialog
    setCurrentTransaction(null); // Reset transaction state
  };

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/deposit/${id}`);
    },
    onSuccess: () => {
      toast.success('Deposit successfully deleted!');
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete deposit!');
    },
  });

  const onUpdate = useMutation({
    mutationFn: async ({ id, depositBalance, email }) => {
      const payload = { email, depositBalance, status: 'success' };
      await axiosSecure.put(`/deposit/${id}`, payload);
    },
    onSuccess: () => {
      toast.success('Transaction successfully updated!');
      refetch();
      closeDialog(); // Close the dialog on success
    },
    onError: () => {
      toast.error('Failed to update transaction!');
    },
  });

  const onDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate(id);
      }
    });
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['depositRequests', status, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        status,
      });
      const response = await axiosSecure.get(`/deposit?${params.toString()}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  const columns = [
    { header: 'Payment Type', accessorKey: 'paymentType' },
    { header: 'Transaction Code', accessorKey: 'transactionCode' },
    { header: 'Number', accessorKey: 'number' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Status', accessorKey: 'status' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => {
        const deposit = row.original;
        return (
          <div className="flex space-x-2">
            <button
              className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => openDialog(deposit)}
            >
              <MdEdit />
            </button>
            <button
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => onDelete(deposit._id)}
            >
              <MdDelete />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deposit Requests</h1>
      <Tabs value={status} onValueChange={setStatus}>
        <TabsList className="w-full m-4">
          <TabsTrigger className="w-full" value="pending">
            Pending Requests
          </TabsTrigger>
          <TabsTrigger className="w-full" value="success">
            Successful Requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {isLoading ? (
                    <>
                    <Skeleton className="h-10 w-full mb-4" count={10} />
                    <Skeleton className="h-10 w-full mb-4" count={10} />
                    <Skeleton className="h-10 w-full mb-4" count={10} />
                    <Skeleton className="h-10 w-full mb-4" count={10} />
                    <Skeleton className="h-10 w-full mb-4" count={10} />
                    <Skeleton className="h-10 w-full mb-4" count={10} />
                 </>
          ) : (
            <DataTable columns={columns} data={data?.deposits || []} />
          )}
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



        </TabsContent>
        <TabsContent value="success">
          {isLoading ? (
           <>
              <Skeleton className="h-10 w-full mb-4" count={10} />
              <Skeleton className="h-10 w-full mb-4" count={10} />
              <Skeleton className="h-10 w-full mb-4" count={10} />
              <Skeleton className="h-10 w-full mb-4" count={10} />
              <Skeleton className="h-10 w-full mb-4" count={10} />
              <Skeleton className="h-10 w-full mb-4" count={10} />
           </>
          ) : (
            <DataTable columns={columns} data={data?.deposits || []} />
          )}
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
        </TabsContent>
      </Tabs>

      {/* Dialog for editing transactions */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the number and revised amount for the selected transaction and confirm your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <strong>Payment Type:</strong> {currentTransaction?.paymentType}
            </p>
            <p>
              <strong>Transaction Code:</strong> {currentTransaction?.transactionCode}
            </p>
            <p>
              <strong>Email:</strong> {currentTransaction?.email}
            </p>
            <Input
              placeholder="Enter revised amount"
              value={currentTransaction?.revisedAmount || ''}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  revisedAmount: e.target.value,
                })
              }
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onUpdate.mutate({
                  id: currentTransaction._id,
                  depositBalance: currentTransaction.revisedAmount,
                  email: currentTransaction.email,
                })
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepositPage;
