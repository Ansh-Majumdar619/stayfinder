/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const navigate = useNavigate();

  const send = async () => {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chatbot`, { message: msg });
    setChat([
      ...chat,
      { from: 'user', text: msg },
      { from: 'bot', text: res.data.reply, listings: res.data.listings }
    ]);
    setMsg('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-black text-[#dfcea9] w-80 sm:w-96 h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#dfcea9]/30"
        >
          {/* Chat Display */}
          <div className="flex-grow p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-[#dfcea9]/30">
            {chat.map((c, i) => (
              <div key={i} className={`flex ${c.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${c.from === 'user' ? 'bg-[#dfcea9] text-black' : 'bg-[#1a1a1a] border border-[#dfcea9]/20'
                    }`}
                >
                  <p>{c.text}</p>

                  {/* Listings from bot */}
                  {c.listings &&
                    c.listings.map((l) => (
                      <div
                        key={l.id}
                        className="mt-3 text-xs space-y-2 bg-black p-2 rounded-lg border border-[#dfcea9]/10"
                      >
                        <img
                          src={
                            l.image
                              ? (l.image.startsWith('http')
                                ? l.image
                                : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${l.image}`)
                              : l.images?.[0]
                                ? (l.images[0].startsWith('http')
                                  ? l.images[0]
                                  : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${l.images[0]}`)
                                : 'https://via.placeholder.com/150'
                          }
                          alt={l.title || 'Property Image'}
                          className="w-full h-20 object-cover rounded"
                        />

                        <div className="font-semibold text-[#dfcea9]">{l.title}</div>
                        <div className="text-[#dfcea9]/70">{l.price}</div>
                        <button
                          onClick={() => navigate(`/listings/${l.id}`)}
                          className="mt-2 w-full bg-[#dfcea9] cursor-pointer hover:bg-[#e8d6a1] text-black py-1 rounded text-xs font-semibold transition-all"
                        >
                          View Property
                        </button>
                      </div>
                    ))}

                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-[#dfcea9]/20 bg-black flex items-center gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#dfcea9] border border-[#dfcea9]/20 focus:outline-none focus:ring-2 focus:ring-[#dfcea9]"
            />
            <button
              onClick={send}
              className="bg-[#dfcea9] hover:bg-[#e8d6a1] cursor-pointer text-black px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#dfcea9] hover:bg-[#e8d6a1] cursor-pointer text-black px-4 py-2 rounded-full shadow-lg font-semibold transition-all"
      >
        {open ? 'Close Chat' : 'Chat'}
      </button>
    </div>
  );
}
