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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '@/hooks/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';

const WithdrawTable = ({ data, currentPage, setCurrentPage,totalPages,refetch }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const axiosSecure= useAxiosSecure()
  const [currentTransaction, setCurrentTransaction] = useState(null);

 

  const openDialog = (transactionCode) => {
    setCurrentTransaction(transactionCode);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentTransaction(null);
  };

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/withdraw/${id}`);
    },
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
      });
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete user!");
    },
  });


  const onDelete = (id) => {
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
        deleteUser.mutate(id);
      }
    });
  };



  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment Type</TableHead>
            <TableHead>Transaction Code</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() =>onDelete(item._id)}
                  >
                    Delete
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => openDialog(item.transactionCode)}>
                        Show Dialog
                      </Button>
                    </DialogTrigger>
                    {dialogOpen && currentTransaction === item.transactionCode && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Transaction</DialogTitle>
                        </DialogHeader>
                        <Input placeholder="Enter details" className="mb-4" />
                        <DialogFooter>
                          <Button variant="ghost" onClick={closeDialog}>
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              alert(
                                `Transaction ${currentTransaction} confirmed!`
                              );
                              closeDialog();
                            }}
                          >
                            Confirm
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ShadCN Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default WithdrawTable;
