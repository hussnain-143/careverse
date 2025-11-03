// app/chat/page.js (or page.tsx)

import { Suspense } from 'react';
import ChatPage from '../components/chat/Chatpage';

// Add a Loading component for a better user experience while the params load
const Loading = () => <div className="p-4 text-center">Loading chat...</div>;

const ChatWrapper = () => {
  return (
    // Wrap the client component in Suspense
    <Suspense fallback={<Loading />}>
      <ChatPage />
    </Suspense>
  );
};

// Export the wrapper component
export default ChatWrapper;