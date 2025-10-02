import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ProfileCard from "../components/UserProfile/ProfileCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Profile | SpeakEasy - Public Speaking Assistant"
        description="Manage your SpeakEasy profile and personal information"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Your Profile
        </h3>
        <ProfileCard />
      </div>
    </>
  );
}
