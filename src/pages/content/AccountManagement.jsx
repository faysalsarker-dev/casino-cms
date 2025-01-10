import  { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure/useAxiosSecure";


export default function AccountManagementPage() {
  const axiosSecure = useAxiosSecure();
 

  const { data, refetch } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/payment`);
      return response.data;
    },
  });

  const [accountData, setAccountData] = useState({ paymentType: "", address: "" });
  const [withdrawType, setWithdrawType] = useState({ withdrawType: "" });

  const handleAccountChange = (e) => {
    const { id, value } = e.target;
    setAccountData((prev) => ({ ...prev, [id]: value }));
  };

  const handleWithdrawTypeChange = (e) => {
    const { id, value } = e.target;
    setWithdrawType((prev) => ({ ...prev, [id]: value }));
  };

  const onAdd = useMutation({
    mutationFn: async (data) => await axiosSecure.post(`/payment`, data),
    onSuccess: () => {
      toast.success("Account successfully added!");
      refetch();
      setAccountData({ paymentType: "", address: "" });
    },
    onError: () => toast.error("Failed to add account!"),
  });

  const onAddType = useMutation({
    mutationFn: async (data) => await axiosSecure.post(`/payment/types`, data),
    onSuccess: () => {
      toast.success("Withdraw type successfully added!");
      refetch();
      setWithdrawType({ withdrawType: "" });
    },
    onError: () => toast.error("Failed to add withdraw type!"),
  });

  const onDelete = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/payment/${id}`),
    onSuccess: () => {
      toast.success("Account successfully deleted!");
      refetch();
    },
    onError: () => toast.error("Failed to delete account!"),
  });

  const onDeleteType = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/peyment/types/${id}`),
    onSuccess: () => {
      toast.success("Withdraw type successfully deleted!");
      refetch();
    },
    onError: () => toast.error("Failed to delete withdraw type!"),
  });

  const handleSubmitAccount = (e) => {
    e.preventDefault();
    onAdd.mutate(accountData);
  };

  const handleSubmitType = (e) => {
    e.preventDefault();
    onAddType.mutate(withdrawType);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Deposit Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitAccount} className="space-y-4">
            <Input
              id="paymentType"
              placeholder="Enter account type"
              value={accountData.paymentType}
              onChange={handleAccountChange}
              required
            />
            <Input
              id="address"
              placeholder="Enter account address"
              value={accountData.address}
              onChange={handleAccountChange}
              required
            />
            <Button type="submit" disabled={onAdd.isLoading} className="w-full">
              {onAdd.isLoading ? "Adding..." : "Add Account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Withdraw Type</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitType} className="space-y-4">
            <Input
              id="withdrawType"
              placeholder="Enter withdraw type"
              value={withdrawType.withdrawType}
              onChange={handleWithdrawTypeChange}
              required
            />
            <Button type="submit" disabled={onAddType.isLoading} className="w-full">
              {onAddType.isLoading ? "Adding..." : "Add Withdraw Type"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold">Added Accounts</h2>
        {data?.depositAddresses?.length > 0 ? (
          <ul className="space-y-4 mt-4">
            {data?.depositAddresses?.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded shadow"
              >
                <span>{`${item.paymentType} : ${item.address}`}</span>
                <Button
                  variant="outline"
                  onClick={() => onDelete.mutate(item._id)}
                  disabled={onDelete.isLoading}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No accounts added yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold">Added Withdraw Types</h2>
        {data?.withdrawType?.length > 0 ? (
          <ul className="space-y-4 mt-4">
            {data?.withdrawType?.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded shadow"
              >
                <span>{`Type: ${item.withdrawType}`}</span>
                <Button
                  variant="outline"
                  onClick={() => onDeleteType.mutate(item._id)}
                  disabled={onDeleteType.isLoading}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No withdraw types added yet.</p>
        )}
      </div>
    </div>
  );
}
