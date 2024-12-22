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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleEdit = (item) => {
    setSelectedItem(item);
  };

  const closeDialog = () => {
    setSelectedItem(null);
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
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.email}</TableCell>
                <TableCell>${item.amount.toFixed(2)}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center space-x-1"
                        >
                          <AiOutlineDelete />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this transaction? This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <Button onClick={closeDialog} variant="ghost">Cancel</Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Edit Button */}
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(item)}
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
              <TableCell colSpan={5} className="text-center">
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

      {/* Edit Dialog */}
      {selectedItem && (
        <AlertDialog open={true} onOpenChange={closeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Transaction</AlertDialogTitle>
              <AlertDialogDescription>
                {`Update the status for the transaction with email: ${selectedItem.email}`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {selectedItem.status === 'rejected' && (
                <>
                  <Button variant="ghost" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-500"
                    onClick={() => {
                      onUpdate.mutate({ id: selectedItem._id, action: 'approved' });
                      closeDialog();
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}

              {selectedItem.status === 'approved' && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedItem._id);
                    closeDialog();
                  }}
                >
                  Delete
                </Button>
              )}

              {selectedItem.status !== 'approved' &&
                selectedItem.status !== 'rejected' && (
                  <div className="flex justify-between w-full">
                    <Button variant="ghost" onClick={closeDialog}>
                      Cancel
                    </Button>
                    <div>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          onUpdate.mutate({ id: selectedItem._id, action: 'rejected' });
                          closeDialog();
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        className="bg-blue-500 ml-3"
                        onClick={() => {
                          onUpdate.mutate({ id: selectedItem._id, action: 'approved' });
                          closeDialog();
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default WithdrawTable;
