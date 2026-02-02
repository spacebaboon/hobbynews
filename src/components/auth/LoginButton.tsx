'use client';

import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { LoginModal } from './LoginModal';

export function LoginButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
      >
        <LogIn size={16} />
        <span className="hidden sm:inline">Sign in</span>
      </button>
      <LoginModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
