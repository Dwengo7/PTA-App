import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

const TeacherMessageParents = () => {
  const auth = getAuth();
  const [parentsList, setParentsList] = useState([]);
  const [selectedParentUID, setSelectedParentUID] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [teacherSchool, setTeacherSchool] = useState('');
  const [replies, setReplies] = useState([]);
  const [selectedReply, setSelectedReply] = useState(null);

  // Fetch the teacher's school
  useEffect(() => {
    const fetchTeacherSchool = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userQuery = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setTeacherSchool(userData.school);
      }
    };

    fetchTeacherSchool();
  }, );

  // Fetch the parents from the same school
  useEffect(() => {
    const fetchParents = async () => {
      if (!teacherSchool) return;

      const parentsQuery = query(
        collection(db, 'users'),
        where('school', '==', teacherSchool),
        where('role', '==', 'parent')
      );

      const parentsSnapshot = await getDocs(parentsQuery);
      const parentList = parentsSnapshot.docs.map(doc => ({
        uid: doc.id,
        email: doc.data().email,
      }));

      setParentsList(parentList);
    };

    fetchParents();
  }, [teacherSchool]);

  // Fetch replies sent to the teacher
  useEffect(() => {
    const fetchReplies = async () => {
      if (!auth.currentUser) return;

      const repliesQuery = query(
        collection(db, 'messages'),
        where('to', '==', auth.currentUser.uid)
      );

      const repliesSnapshot = await getDocs(repliesQuery);
      const repliesList = repliesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReplies(repliesList);
    };

    fetchReplies();
  }, [auth.currentUser]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedParentUID || !subject || !messageBody) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        to: selectedParentUID,
        from: auth.currentUser.uid,
        subject,
        messageBody,
        timestamp: new Date(),
        school: teacherSchool,
        isRead: false, // Default unread
      });

      alert('Message sent successfully!');
      setSelectedParentUID('');
      setSubject('');
      setMessageBody('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  return (
    <div className="p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6">Send Message to Parents</h1>

      {/* Form to send a new message */}
      <form onSubmit={handleSendMessage} className="space-y-4 mb-10">
        <div>
          <label className="block text-sm font-bold mb-1">Select Parent</label>
          <select
            value={selectedParentUID}
            onChange={(e) => setSelectedParentUID(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a Parent</option>
            {parentsList.map((parent) => (
              <option key={parent.uid} value={parent.uid}>
                {parent.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Message</label>
          <textarea
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 border rounded"
            rows="5"
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send Message
        </button>
      </form>

      {/* List of replies */}
      <h2 className="text-xl font-semibold mb-4">Replies from Parents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {replies.length === 0 ? (
          <p>No replies yet.</p>
        ) : (
          replies.map((reply) => (
            <div
              key={reply.id}
              className="border p-4 rounded-lg shadow-md bg-gray-100 cursor-pointer"
              onClick={() => setSelectedReply(reply)}
            >
              <h3 className="font-semibold">{reply.subject}</h3>
              <p className="text-gray-600 text-sm">{new Date(reply.timestamp.seconds * 1000).toLocaleString()}</p>
              <p className="text-gray-500 mt-2 truncate">{reply.messageBody}</p>
            </div>
          ))
        )}
      </div>

      {/* Selected reply view */}
      {selectedReply && (
        <div className="mt-10 p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-bold mb-2">{selectedReply.subject}</h2>
          <p className="text-gray-600 text-sm mb-4">{new Date(selectedReply.timestamp.seconds * 1000).toLocaleString()}</p>
          <p>{selectedReply.messageBody}</p>

          <button
            onClick={() => setSelectedReply(null)}
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Back to Replies
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherMessageParents;

