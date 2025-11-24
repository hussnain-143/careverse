import { Suspense } from 'react';
import ChatPage from '../components/chat/Chatpage';
import Loading from '../loading';


const ChatWrapper = () => {
  return (
    <Suspense fallback={<Loading message="Loading chat..." />}>
      <ChatPage />
    </Suspense>
  );
};

export default ChatWrapper;