// app/chat/page.js (or page.tsx)

import { Suspense } from 'react';
import ChatPage from '../components/chat/Chatpage';
import Loading from '../loading';


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