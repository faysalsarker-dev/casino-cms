import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure/useAxiosSecure';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import DepositTable from './DepositTable';

const DepositPage = () => {
  const axiosSecure = useAxiosSecure();
  const [status, setStatus] = useState('pending');
  const [currentPage, setCurrentPage] = useState('pending');
  const [searchTerm] = useState('pending');


  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['depositRequests', status,currentPage,searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit : 10,
        search: searchTerm,
        status:status 
      });
      const response = await axiosSecure.get(`/deposit?${params.toString()}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  console.log(data);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deposit Requests</h1>
      <Tabs value={status} onValueChange={setStatus} className=''>
        <TabsList className='w-full m-4'>
          <TabsTrigger className='w-full' value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger className='w-full' value="success">Successful Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <DepositTable refetch={refetch} isError={isError} isLoading={isLoading} currentPage={currentPage} setCurrentPage={setCurrentPage} data={data?.deposits} totalPages={data?.totalPages} />
        </TabsContent>
        <TabsContent value="success">
          <DepositTable refetch={refetch} isError={isError} isLoading={isLoading} currentPage={currentPage} setCurrentPage={setCurrentPage} data={data?.deposits} totalPages={data?.totalPages} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepositPage;