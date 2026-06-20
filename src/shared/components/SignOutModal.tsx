import React from "react";

interface SignOutModalProps {
  setShowSignOutModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmSignOut: () => Promise<void> | void;
}

const SignOutModal = ({
  setShowSignOutModal,
  handleConfirmSignOut,
}: SignOutModalProps) => {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-4xl border border-white/10 bg-[#121212] p-6 shadow-2xl shadow-black/40">
        <h2 className="text-xl font-semibold text-white">Sign out?</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Are you sure you want to sign out? You&apos;ll need to log in again to access your saved tasks and sessions.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowSignOutModal(false)}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmSignOut}
            className="rounded-full bg-[#1DB954] px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
