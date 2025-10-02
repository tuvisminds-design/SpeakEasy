import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import UserAvatar from "../ui/avatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import { PencilIcon } from "../../icons";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    company: profile?.company || '',
    job_title: profile?.job_title || '',
    website: profile?.website || '',
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
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user?.email || 'User';

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <UserAvatar
              src={profile?.avatar_url}
              name={displayName}
              size="xl"
              className="flex-shrink-0"
            />
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {displayName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                {profile?.job_title && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.job_title}
                  </p>
                )}
                {profile?.company && (
                  <>
                    {profile?.job_title && (
                      <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {profile.company}
                    </p>
                  </>
                )}
                {profile?.location && (
                  <>
                    {(profile?.job_title || profile?.company) && (
                      <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {profile.location}
                    </p>
                  </>
                )}
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
      
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Professional Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update your professional details.
            </p>
          </div>
          
          <form className="flex flex-col">
            <div className="px-2 pb-3">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <Label>Company (Optional)</Label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <Label>Job Title (Optional)</Label>
                  <Input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder="Enter your job title"
                  />
                </div>

                <div>
                  <Label>Website (Optional)</Label>
                  <Input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
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
    </>
  );
}