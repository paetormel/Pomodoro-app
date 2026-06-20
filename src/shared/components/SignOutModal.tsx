import React, { useEffect, useRef } from "react";

interface SignOutModalProps {
  setShowSignOutModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmSignOut: () => Promise<void> | void;
}

const SignOutModal = ({
  setShowSignOutModal,
  handleConfirmSignOut,
}: SignOutModalProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowSignOutModal(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) {
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        }
        return;
      }

      if (document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [setShowSignOutModal]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-title"
      aria-describedby="signout-description"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-4xl border border-white/10 bg-[#121212] p-6 shadow-2xl shadow-black/40"
      >
        <h2 id="signout-title" className="text-xl font-semibold text-white">
          Sign out?
        </h2>
        <p id="signout-description" className="mt-2 text-sm leading-6 text-white/60">
          Are you sure you want to sign out? You&apos;ll need to log in again to access your saved tasks and sessions.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            ref={cancelButtonRef}
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
