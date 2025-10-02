import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../context/AuthContext";
import { PencilIcon } from "../../icons";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    location: profile?.location || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfile(formData);
      closeModal();
    } catch (error) {
      console.error('Failed to update location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Location
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profile?.location || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
      
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Location
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update your location information.
            </p>
          </div>
          
          <form className="flex flex-col">
            <div className="px-2">
              <div>
                <Label>Location (Optional)</Label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} disabled={isLoading}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}