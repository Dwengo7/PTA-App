import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

const ParentMessages = () => {
  const auth = getAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Fetch messages addressed to the parent
  useEffect(() => {
    const fetchMessages = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, 'messages'),
        where('to', '==', auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messageList);
    };

    fetchMessages();
  }, [auth.currentUser]);

  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);

    // Mark the message as read in Firestore if not already
    if (!message.isRead) {
      const messageRef = doc(db, 'messages', message.id);
      await updateDoc(messageRef, { isRead: true });

      // Update locally too
      setMessages(prev =>
        prev.map((m) =>
          m.id === message.id ? { ...m, isRead: true } : m
        )
      );
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert('Reply cannot be empty.');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        to: selectedMessage.from,            // send reply back to original sender
        from: auth.currentUser.uid,           // current parent
        subject: `Re: ${selectedMessage.subject}`, 
        messageBody: replyText,
        timestamp: new Date(),
        school: selectedMessage.school,
        isRead: false,
      });

      setReplyText('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply.');
    }
  };

  return (
    <div className="p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6">Your Messages</h1>

      {/* List of Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`border p-4 rounded-lg shadow-md cursor-pointer ${msg.isRead ? 'bg-gray-100' : 'bg-yellow-100'}`}
              onClick={() => handleOpenMessage(msg)}
            >
              <h2 className="text-lg font-semibold">{msg.subject}</h2>
              <p className="text-gray-600 text-sm">{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</p>
              <p className="text-gray-500 mt-2 truncate">{msg.messageBody}</p>
            </div>
          ))
        )}
      </div>

      {/* Selected Message Detail */}
      {selectedMessage && (
        <div className="mt-10 p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
          <p className="text-gray-600 text-sm mb-4">{new Date(selectedMessage.timestamp.seconds * 1000).toLocaleString()}</p>
          <p className="mb-6">{selectedMessage.messageBody}</p>

          <h3 className="text-lg font-semibold mb-2">Reply:</h3>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
            rows="4"
            className="w-full p-2 border rounded"
          ></textarea>

          <button
            onClick={handleSendReply}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send Reply
          </button>

          <button
            onClick={() => setSelectedMessage(null)}
            className="ml-4 mt-4 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Back to Messages
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentMessages;
