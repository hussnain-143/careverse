"use client";
import React, { useEffect, useState, useRef, useMemo, memo } from "react";
import {
  Send,
  Menu,
  User,
  Settings,
  X,
  Brain,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setApiData } from "../../src/store/dataSlice";
import Loading from "../../loading";
import { apiClient } from '../../src/utils/apiClient';
import Toast from "../common/Toast";

const MessageBubble = memo(({ msg, index }) => {
  const role = msg?.role ?? "user";
  const content = msg?.content ?? "";

  return (
    <div
      className={`flex ${
        role === "assistant"
          ? "justify-start"
          : "items-start flex-row-reverse"
      } items-end gap-3 mb-6 animate-fade-in-up`}
      aria-live="polite"
    >
      {role === "assistant" ? (
        <div className="flex flex-col items-start gap-2 flex-shrink-0">
          <span className="text-sm text-gray-700 font-semibold px-1 mb-1">Careverse</span>
          <div className="relative">
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-full opacity-20 blur-md"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-sm text-gray-700 font-semibold px-1 mb-1">You</span>
          <div className="relative">
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-full opacity-20 blur-md"></div>
          </div>
        </div>
      )}

      <div
        className={`px-5 py-4 max-w-[75%] text-[15px] leading-relaxed shadow-lg break-words ${
          role === "assistant"
            ? "bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] text-white rounded-2xl rounded-tl-sm"
            : "bg-white/70 backdrop-blur-xl text-gray-800 border border-white/60 rounded-2xl rounded-tr-sm"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {

  return (
    prevProps.msg?.role === nextProps.msg?.role &&
    prevProps.msg?.content === nextProps.msg?.content &&
    prevProps.index === nextProps.index
  );
});

MessageBubble.displayName = 'MessageBubble';

const ChatPage = () => {
  const [Sidebar, setSidebar] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ListMsg, setListMsg] = useState([]);
  const [CurrentMsg, setCurrentMsg] = useState([]);
  const [topic, setTopic] = useState("");
  const [input, setInput] = useState("");
  const [popup, setPopup] = useState("");
  const [send, setSend] = useState(false);
  const [generateAssessment, setGenerateAssessment] = useState(false);
  const [toast, setToast] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const router = useRouter();
  const chatScrollRef = useRef(null);
  const dispatch = useDispatch();

  // ---------------- Handlers ----------------

  const moveHome = () => router.push("/");

  const handleSend = async () => {
    if (!input.trim() || send) return;
    
    setSend(true);
    const text = input;
    setInput("");
    const conversationId = sessionStorage.getItem("conversationId");

    setCurrentMsg((prev) => [...prev, { role: "user", content: text }]);
    const thinkingId = Date.now();
    setCurrentMsg((prev) => [
      ...prev,
      { role: "assistant", content: "Thinking...", temp: thinkingId },
    ]);

    // Auto-scroll to bottom after adding message
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);

    try {
      const resp = await apiClient.post(
        `/api/v1/chat/conversations/${conversationId}/messages`,
        { message: text }
      );

      const reply = resp?.data?.message ?? resp?.data ?? null;

      if (reply) {
        setCurrentMsg((prev) =>
          prev.map((m) => (m.temp === thinkingId ? reply : m))
        );
        // Auto-scroll after response
        setTimeout(() => {
          if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
          }
        }, 100);
      } else {
        setCurrentMsg((prev) => prev.filter((m) => m.temp !== thinkingId));
        setToast({ message: "No response received. Please try again.", type: "error" });
      }
    } catch (err) {
      console.error("network error:", err);
      setCurrentMsg((prev) => prev.filter((m) => m.temp !== thinkingId));
      setToast({ message: "Failed to send message. Please check your connection and try again.", type: "error" });
    } finally {
      setSend(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const loadSpecificConversation = async (id) => {
    if (!id) return;
    sessionStorage.setItem("conversationId", id);

    try {
      setLoadingConversation(true);
      const resp = await apiClient.get(`/api/v1/chat/conversations/${id}?page=1&limit=10`);
      const data = resp?.data ?? {};
      const { conversation, messages } = data;

      setTopic(conversation?.title ?? "");
      setCurrentMsg(messages ?? []);
    } catch (err) {
      console.error("loadSpecificConversation error:", err);
      setToast({ message: "Failed to load conversation. Please try again.", type: "error" });
    } finally {
      setLoadingConversation(false);
    }
  };

  const generate_assessment = async () => {
    if (generateAssessment) return;
    
    setGenerateAssessment(true);
    const conversationId = sessionStorage.getItem("conversationId");

    if (!conversationId) {
      setGenerateAssessment(false);
      setToast({ message: "No conversation found. Please start a conversation first.", type: "error" });
      return;
    }

    try {
      const resp = await apiClient.post('/api/v1/assessments/generate', { conversationId });

      if (!resp?.success) {
        setGenerateAssessment(false);
        setToast({ message: resp?.message || "Failed to generate assessment. Please try again.", type: "error" });
        return;
      }

      dispatch(setApiData(resp));
    
      router.push("/assessment-results");
    } catch (err) {
      setGenerateAssessment(false);
      console.error("network error:", err);
      setToast({ message: "Network error. Please check your connection and try again.", type: "error" });
    }
  };

  // ---------------- Effects ----------------

  const [loadingConversation, setLoadingConversation] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
 
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadChats = async () => {
      const conversationId = sessionStorage.getItem("conversationId");

      try {
        
        apiClient.get('/api/v1/chat/conversations?page=1&limit=12')
          .then((listData) => {
            setListMsg(listData?.data?.conversations ?? []);
          })
          .catch((err) => {
            console.error("loadChats error:", err);
          });

       
        if (conversationId) {
          setLoadingConversation(true);
          try {
            const msgData = await apiClient.get(`/api/v1/chat/conversations/${conversationId}?page=1&limit=10`);
            const data = msgData?.data ?? {};
            const { conversation, messages } = data;

            setTopic(conversation?.title ?? "");
            setCurrentMsg(messages ?? []);
          } finally {
            setLoadingConversation(false);
            setIsInitialLoad(false);
          }
        } else {
          setCurrentMsg([]);
          setTopic("");
          setIsInitialLoad(false);
        }
      } catch (err) {
        console.error("loadChats error:", err);
        setLoadingConversation(false);
        setIsInitialLoad(false);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [CurrentMsg]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (popup) {
      setToast({ message: popup, type: "error" });
      const t = setTimeout(() => {
        setPopup("");
        setToast(null);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [popup]);

  const closeToast = () => {
    setToast(null);
    setPopup("");
  };

  // Memoized messages to prevent re-renders when input changes
  const memoizedMessages = useMemo(() => {
    if (!CurrentMsg || CurrentMsg.length === 0) return null;
    
    return CurrentMsg.map((msg, index) => {
      const contentHash = msg.content ? msg.content.substring(0, 50).replace(/\s/g, '') : '';
      const key = `msg-${msg.role}-${index}-${contentHash}`;

    return (
        <MessageBubble 
          key={key} 
          msg={msg} 
          index={index} 
        />
      );
    });
  }, [CurrentMsg]);

  // ---------------- Render ----------------

  if (isInitialLoad) {
    return <Loading message="Loading chat..." />;
  }

  return (
    <>
      
      {loadingConversation && <Loading message="Loading conversation..." />}

      {generateAssessment && <Loading message="Generating Assessment..." />}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="flex min-h-screen bg-gradient-to-br from-[rgb(120,195,235)] via-[rgb(150,177,225)] to-[rgb(180,159,216)] text-gray-800 relative">
      
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
         
          <div className="absolute top-20 left-10 w-72 h-72 bg-[rgb(55,0,231)]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[rgb(75,20,255)]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[rgb(120,195,235)]/25 rounded-full blur-3xl"></div>
    
          <div className="absolute top-40 right-20 w-64 h-64 bg-[rgb(55,0,231)]/8 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-20 w-56 h-56 bg-[rgb(75,20,255)]/8 rounded-full blur-2xl"></div>
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        {/* Sidebar */}
        <aside
          className={`flex flex-col w-72 border-r border-white/60 bg-white/85 backdrop-blur-2xl fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 shadow-2xl
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${Sidebar ? "md:translate-x-0" : "md:-translate-x-full"}
        `}
        >
          {/* Top Section */}
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 justify-between px-6 pt-6 pb-5 border-b border-white/60 flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-[rgb(55,0,231)] group-hover:to-[rgb(75,20,255)] transition-all duration-300">Careverse</h1>
              </Link>
              <button
                className="md:hidden p-2 rounded-xl hover:bg-white/70 transition-all duration-200 hover:scale-105"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="px-5 py-4 flex-shrink-0">
              <button
                onClick={moveHome}
                className="w-full cursor-pointer bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>

            {/* Old Chats */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <p className="text-xs text-gray-600 font-bold mb-3 uppercase tracking-wider px-5 flex-shrink-0">
                Recent Chats
              </p>
              <ul className="overflow-y-auto flex-1 space-y-2 text-sm px-3 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {ListMsg.map((item, i) => {
                const activeId = sessionStorage.getItem("conversationId");
                const isActive = activeId === item.id;
                return (
                  <li
                    key={item.id ?? i}
                    onClick={() => loadSpecificConversation(item.id)}
                      className={`group relative px-4 py-3.5 rounded-xl cursor-pointer transition-all truncate text-sm font-medium ${
                      isActive
                          ? "bg-gradient-to-br from-[rgb(55,0,231)]/20 to-[rgb(75,20,255)]/20 text-[rgb(55,0,231)] border border-[rgb(55,0,231)]/40 shadow-md font-semibold"
                          : "text-gray-700 hover:bg-white/80 hover:text-gray-900 hover:shadow-md border border-transparent hover:border-white/70"
                    }`}
                  >
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)]/8 to-[rgb(75,20,255)]/8 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                      )}
                      <span className="relative z-10 block truncate">{item.title}</span>
                  </li>
                );
              })}
            </ul>
            </div>
          </div>

          {/* User Profile Section with Settings */}
          <div className="border-t border-white/60 py-5 px-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-full opacity-20 blur-md"></div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-900 block truncate">John Doe</span>
                <span className="text-xs text-gray-600 font-medium">Online</span>
              </div>
            </div>

            <Link 
              href="/user" 
              className="group flex items-center gap-3 cursor-pointer text-sm text-gray-800 hover:text-[rgb(55,0,231)] font-semibold w-full text-left p-3.5 rounded-xl bg-white/70 hover:bg-white/95 transition-all duration-200 border border-white/70 hover:border-[rgb(55,0,231)]/40 hover:shadow-lg"
            >
              <div className="p-2 bg-gradient-to-br from-[rgb(55,0,231)]/15 to-[rgb(75,20,255)]/15 rounded-lg group-hover:from-[rgb(55,0,231)]/25 group-hover:to-[rgb(75,20,255)]/25 transition-all duration-200 shadow-sm">
                <Settings className="w-4 h-4 text-[rgb(55,0,231)]" />
              </div>
              <span className="font-semibold">Settings</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 relative z-10 ${
            Sidebar ? "md:ml-72" : "ml-0"
          }`}
        >
          {/* Header */}
          <header className="flex justify-between items-center pb-4 px-6 sm:px-8 pt-6 border-b border-white/40 bg-transparent flex-shrink-0 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (window.innerWidth < 768) setMobileOpen(true);
                  else setSidebar((s) => !s);
                }}
                className="cursor-pointer p-2 rounded-lg hover:bg-white/30 transition-all duration-200"
              >
                <Menu className="w-5 h-5 text-gray-800" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{topic || "New Conversation"}</h2>
            </div>

            <div className="flex items-center gap-3">
                <Link
                  href="/"
                className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition-all duration-200 relative group text-lg"
                >
                  Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(55,0,231)] group-hover:w-full transition-all duration-300"></span>
                </Link>
                <button
                  onClick={generate_assessment}
                  disabled={generateAssessment}
                  className={`bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white cursor-pointer px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[rgb(55,0,231)] focus:ring-offset-2 ${
                    generateAssessment ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  aria-label="Generate assessment from conversation"
                >
                  {generateAssessment ? (
                    <div className="w-4 h-4 border-2 border-white rounded-full border-b-transparent animate-spin"></div>
                  ) : (
                    "Generate Assessment"
                  )}
                </button>
            </div>
          </header>

          {/* Chat Messages */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-8 min-h-0">
            <div className="w-full max-w-3xl mx-auto">
              {CurrentMsg?.length ? (
                <div className="space-y-1">
                  {memoizedMessages}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[500px] py-20">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-2xl shadow-xl flex items-center justify-center animate-float-slow">
                      <Brain className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-2xl opacity-30 blur-2xl animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Start a conversation</h3>
                  <p className="text-gray-600 text-base mb-8">Ask me anything about your health concerns</p>
                  <div className="mt-4 flex flex-wrap gap-3 justify-center max-w-lg">
                    {["What are the symptoms of flu?", "Find a doctor near me", "I have a headache"].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(suggestion);
                          setTimeout(() => handleSend(), 100);
                        }}
                        className="group relative bg-white/70 backdrop-blur-xl text-gray-800 px-5 py-3 rounded-2xl text-sm font-medium cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl border border-white/60 hover:border-[rgb(55,0,231)]/40 hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)]/10 to-[rgb(75,20,255)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 text-gray-800 group-hover:text-[rgb(55,0,231)] transition-colors duration-300">
                          {suggestion}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input/Footer */}
          <div className="border-t border-white/40 bg-transparent p-5 sm:p-6 flex-shrink-0 z-10">
            <div className="w-full max-w-3xl mx-auto">
              <div className="flex items-center w-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-4 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:border-white/60 focus-within:shadow-xl">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={send}
                  placeholder="Tell me what's wrong or what you're looking for..."
                  className="flex-1 bg-transparent focus:outline-none focus:ring-0 border-0 px-2 text-gray-800 placeholder:text-gray-400 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Chat input"
                />
                <button
                  onClick={handleSend}
                  disabled={send || !input.trim()}
                  className={`bg-gradient-to-r cursor-pointer from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white rounded-xl p-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg ${
                    send ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  aria-label="Send message"
                >
                  {send ? (
                    <div className="w-5 h-5 border-2 border-white rounded-full border-b-transparent animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;


