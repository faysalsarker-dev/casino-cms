import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure/useAxiosSecure';
import WithdrawTable from './WithdrawTable';
import useAxios from './../../hooks/useAxios/useAxios';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
const WithdrawPage = () => {
  const axiosCommon = useAxios();
  const axiosSecure = useAxiosSecure();
  const [status, setStatus] = useState('pending');
  const [date, setDate] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['depositRequests', status,currentPage,searchTerm,date,debouncedSearchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit : 10,
        search: debouncedSearchTerm,
        page: currentPage,
        status:status 
      });
      const response = await axiosCommon.get(`/withdraw?${params.toString()}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value) => {
    setStatus(value);
  };

  const handleDateChange = (value) => {
    setDate(value);
    setSearchTerm('');
    
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Withdraw Requests</h1>

      {/* Search and Sort Section */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-1/2"
        />

        {/* Status Dropdown */}
        <Select onValueChange={handleSortChange} value={status}>
          <SelectTrigger className="w-full md:w-1/4">
            <div className="w-full">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
           
          </SelectContent>
        </Select>

        {/* Date Dropdown */}
        <Select onValueChange={handleDateChange} value={date}>
          <SelectTrigger className="w-full md:w-1/4">
            <div className="w-full">
              {date === 'newest' ? 'Newest First' : 'Oldest First'}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Withdraw Table */}
      <WithdrawTable
        refetch={refetch}
        isError={isError}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        data={data?.withdraws}
        totalPages={data?.totalPages}
      />
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
    </div>
  );
};

export default WithdrawPage;
