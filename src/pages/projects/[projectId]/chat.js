import { useRouter } from 'next/router';

const ChatPage = () => {
  const router = useRouter();
  const { projectId } = router.query;  // Get the project ID from the URL

  return (
    <div>
      <h1>Chat for Project {projectId}</h1>
      {/* Your chat UI will go here */}
    </div>
  );
};

export default ChatPage;
