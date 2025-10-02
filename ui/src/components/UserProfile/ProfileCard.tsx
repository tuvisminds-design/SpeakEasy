import { useState } from "react";
import UserAvatar from "../ui/avatar/UserAvatar";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";
import { PencilIcon, CheckLineIcon, CloseLineIcon } from "../../icons";

export default function ProfileCard() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    company: profile?.company || '',
    job_title: profile?.job_title || '',
    website: profile?.website || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      company: profile?.company || '',
      job_title: profile?.job_title || '',
      website: profile?.website || '',
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      company: profile?.company || '',
      job_title: profile?.job_title || '',
      website: profile?.website || '',
    });
  };

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user?.email || 'User';

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <UserAvatar
              src={profile?.avatar_url}
              name={displayName}
              size="xl"
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                {displayName}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {user?.email}
              </p>
              {profile?.bio && !isEditing && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <CloseLineIcon className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <CheckLineIcon className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-800 dark:text-white/90">
              Personal Information
            </h5>
            
            <div className="space-y-4">
              <div>
                <Label>First Name</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 py-2">
                    {profile?.first_name || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 py-2">
                    {profile?.last_name || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <Label>Bio</Label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 py-2">
                    {profile?.bio || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <Label>Location</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco, CA"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 py-2">
                    {profile?.location || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-800 dark:text-white/90">
              Professional Information
            </h5>
            
            <div className="space-y-4">
              <div>
                <Label>Company</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 py-2">
                    {profile?.company || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <Label>Job Title</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder="Enter your job title"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 py-2">
                    {profile?.job_title || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <Label>Website</Label>
                {isEditing ? (
                  <Input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 py-2">
                    {profile?.website ? (
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
