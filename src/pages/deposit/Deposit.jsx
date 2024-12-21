import  { useState } from 'react';
import {
  Button,

} from "@/components/ui/button";
import {
 
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
 


    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,

  } from "@/components/ui/table";

  import {
 

    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,

  } from "@/components/ui/dialog";
  import {
 
    Input,
  } from "@/components/ui/input";

const DepositPage = () => {
  const [data, setData] = useState([
    {
      paymentType: "ggg",
      transactionCode: "4r89ef47t134",
      number: "427834523475",
      status: 1,
      email: "md.osamafaysalsarker@gmail.com",
    },
    {
      paymentType: "abc",
      transactionCode: "5y92dh28j239",
      number: "428392847482",
      status: 2,
      email: "example2@gmail.com",
    },
    {
      paymentType: "xyz",
      transactionCode: "8j73gd29f183",
      number: "493928473924",
      status: 1,
      email: "example3@gmail.com",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const handleDelete = (transactionCode) => {
    setData(data.filter((item) => item.transactionCode !== transactionCode));
  };

  const openDialog = (transactionCode) => {
    setCurrentTransaction(transactionCode);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentTransaction(null);
  };

  const renderTable = (status) => (
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
        {data
          .filter((item) => item.status === status)
          .map((item) => (
            <TableRow key={item.transactionCode}>
              <TableCell>{item.paymentType}</TableCell>
              <TableCell>{item.transactionCode}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.transactionCode)}
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
                        <Input
                          placeholder="Enter details"
                          className="mb-4"
                        />
                        <DialogFooter>
                          <Button variant="ghost" onClick={closeDialog}>
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              alert(`Transaction ${currentTransaction} confirmed!`);
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
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deposit Requests</h1>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="successful">Successful Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">{renderTable(1)}</TabsContent>
        <TabsContent value="successful">{renderTable(2)}</TabsContent>
      </Tabs>
    </div>
  );
};

export default DepositPage;
