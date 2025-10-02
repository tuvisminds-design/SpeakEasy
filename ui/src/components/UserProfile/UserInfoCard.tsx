import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import UserAvatar from "../ui/avatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { PencilIcon } from "../../icons";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user?.email || 'User';

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <UserAvatar
            src={profile?.avatar_url}
            name={displayName}
            size="lg"
            className="flex-shrink-0"
          />
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
              {displayName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {user?.email}
            </p>
            {profile?.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <PencilIcon className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profile
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update your basic information.
            </p>
          </div>
          
          <form className="flex flex-col">
            <div className="px-2 pb-3">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <Label>Bio (Optional)</Label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>
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
    </div>
  );
}