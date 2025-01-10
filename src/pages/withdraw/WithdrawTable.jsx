/* eslint-disable react/prop-types */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Pagination } from '@/components/ui/pagination';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import useAxiosSecure from '@/hooks/useAxiosSecure/useAxiosSecure';

const WithdrawTable = ({
  data = [],
  currentPage,
  setCurrentPage,
  totalPages,
  refetch,
  isError,
  isLoading,
}) => {
  const axiosSecure = useAxiosSecure();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const onUpdate = useMutation({
    mutationFn: async ({ id, action }) => {
      await axiosSecure.put(`/withdraw/${id}`, { status: action });
    },
    onSuccess: () => {
      toast.success('Transaction updated successfully.');
      refetch();
    },
    onError: () => {
      toast.error('Failed to update transaction.');
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/withdraw/${id}`);
    },
    onSuccess: () => {
      toast.success('Transaction deleted successfully.');
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete transaction.');
    },
  });

  const handleDelete = (id) => {
    deleteTransaction.mutate(id);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading data.</p>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length > 0 ? (
            data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.email}</TableCell>
                <TableCell>${item.amount}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      className="flex items-center space-x-1"
                      onClick={() => {
                        setSelectedItem(item);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <AiOutlineDelete />
                    </Button>

                    {/* Edit Button */}
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedItem(item);
                        setEditDialogOpen(true);
                      }}
                      className="flex items-center space-x-1"
                    >
                      <AiOutlineEdit />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Delete Dialog */}
      {isDeleteDialogOpen && selectedItem && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={() => setDeleteDialogOpen(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this transaction? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDelete(selectedItem._id);
                  setDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Edit Dialog */}
      {isEditDialogOpen && selectedItem && (
        <AlertDialog
          open={isEditDialogOpen}
          onOpenChange={() => setEditDialogOpen(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Transaction</AlertDialogTitle>
              <AlertDialogDescription>
                {`Update the status for the transaction with email: ${selectedItem.email}`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-500"
                onClick={() => {
                  onUpdate.mutate({ id: selectedItem._id, action: 'approved' });
                  setEditDialogOpen(false);
                }}
              >
                Approve
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default WithdrawTable;
