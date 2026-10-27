import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import { ThemeProvider } from './context/ThemeContext';
import { LoginScreen } from './components/LoginScreen';
import { RoadmapAppContent } from './components/RoadmapAppContent';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setIsGuest(false); // Clear guest mode if user logs in
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#191919] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400">Loading Vault...</span>
        </div>
      </div>
    );
  }

  if (!session && !isGuest) {
    return <LoginScreen onGuestAccess={() => setIsGuest(true)} />;
  }

  return (
    <ThemeProvider>
      <RoadmapAppContent />
    </ThemeProvider>
  );
}
