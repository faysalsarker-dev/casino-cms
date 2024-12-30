import  { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { MdDelete, MdEdit } from 'react-icons/md';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Slider = () => {
  const axiosSecure = useAxiosSecure();
  const [currentSlider, setCurrentSlider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sliderForm, setSliderForm] = useState({ image: null, link: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch sliders
  const { data:sliders = [], refetch } = useQuery({
    queryKey: ['sliders'],
    queryFn: async () => {
      const response = await axiosSecure.get('/sliders');
      return response.data;
    },
  });

  // Add or update slider mutation
  const saveSlider = useMutation({
    mutationFn: async (formData) => {
      if (currentSlider) {
        return await axiosSecure.put(`/sliders/${currentSlider._id}`, formData);
      } else {
        return await axiosSecure.post('/sliders', formData);
      }
    },
    onSuccess: () => {
      toast.success(`Slider ${currentSlider ? 'updated' : 'created'} successfully!`);
      refetch();
      closeDialog();
    },
    onError: () => {
      toast.error(`Failed to ${currentSlider ? 'update' : 'create'} slider.`);
    },
  });

  // Delete slider mutation
  const deleteSlider = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/sliders/${id}`),
    onSuccess: () => {
      toast.success('Slider deleted successfully!');
      refetch();
      setIsAlertDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete slider.');
      setIsAlertDialogOpen(false);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSliderForm({ ...sliderForm, image: file });
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSliderForm({ ...sliderForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (sliderForm.image) formData.append('image', sliderForm.image);
    formData.append('link', sliderForm.link);
    saveSlider.mutate(formData);
  };

  const openDialog = (slider = null) => {
    setCurrentSlider(slider);
    setSliderForm(slider ? { image: null, link: slider.link } : { image: null, link: '' });
    setPreviewImage(slider ? slider.image : null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setCurrentSlider(null);
    setSliderForm({ image: null, link: '' });
    setPreviewImage(null);
    setIsDialogOpen(false);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsAlertDialogOpen(true);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Sliders</h1>

      <Button onClick={() => openDialog()} className="mb-4">
        Add New Slider
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSlider ? 'Edit Slider' : 'Create New Slider'}</DialogTitle>
            <DialogDescription>Fill out the form below to save the slider.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded focus:ring focus:ring-primary"
                required={!currentSlider}
              />
              {previewImage && <img src={previewImage ? `http://localhost:5000${previewImage}`: previewImage} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link (Optional)</label>
              <input
                type="text"
                name="link"
                value={sliderForm.link}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:ring focus:ring-primary"
              />
            </div>

            <Button type="submit" className="w-full">
              {currentSlider ? 'Update Slider' : 'Create Slider'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table className="w-full text-sm bg-white shadow-lg rounded-lg border border-gray-200">
  <TableCaption className="text-gray-500">A list of your recent sliders.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px] py-2 px-4">Image</TableHead>
      <TableHead className="py-2 px-4">Link</TableHead>
      <TableHead className="py-2 px-4 text-center">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sliders?.map((slider) => (
      <TableRow
        key={slider._id}
        className="hover:bg-gray-50 transition duration-200 border-b"
      >
        <TableCell className="py-3 px-4">
          <img
            src={`http://localhost:5000${slider.image}`}
            alt="Slider"
            className="h-12 w-12 object-cover rounded shadow"
          />
        </TableCell>
        <TableCell className="py-3 px-4 text-blue-500 underline truncate max-w-xs">
          {slider.link}
        </TableCell>
        <TableCell className="py-3 px-4 text-center">
          <div className="flex justify-center space-x-3">
            <button
              className="flex items-center space-x-1 bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1.5 rounded shadow-md transition duration-150"
              onClick={() => openDialog(slider)}
              title="Edit Slider"
            >
              <MdEdit className="text-lg" />
              <span>Edit</span>
            </button>
            <button
              className="flex items-center space-x-1 bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded shadow-md transition duration-150"
              onClick={() => confirmDelete(slider._id)}
              title="Delete Slider"
            >
              <MdDelete className="text-lg" />
              <span>Delete</span>
            </button>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>



      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Are you sure you want to delete this slider? This action cannot be undone.</p>
          <AlertDialogFooter>
            <Button variant="secondary" onClick={() => setIsAlertDialogOpen(false)}>
              Cancel
            </Button>
            <Button  onClick={() => deleteSlider.mutate(deleteId)}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Slider;
