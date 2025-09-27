import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ================== FETCH USER ==================
  const fetchUser = async (customToken) => {
    try {
        const authToken = customToken || token;
      const { data } = await axios.get("/api/user/getuser", {
        headers: { Authorization: authToken },
      });

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // ================== CREATE NEW CHAT ==================
  const createNewChat = async () => {
    try {
      if (!user) return toast.error("Login to create a new chat");
      navigate("/");
      await axios.post(
        "/api/chat/create",
        {},
        { headers: { Authorization: token } }
      );
      await fetchUsersChats();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ================== FETCH USER'S CHATS ==================
const fetchUsersChats = async () => {
  try {
    const { data } = await axios.get("/api/chat/getchats", {
      headers: { Authorization: token },
    });

    if (data.success) {
      setChats(data.chats);

      // ✅ Only set first chat if exists
      if (data.chats.length > 0) {
        setSelectedChat(data.chats[0]);
      }
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  // ================== EFFECTS ==================
  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  // ================== CONTEXT VALUE ==================
  const value = {
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    navigate,
    createNewChat,
    loadingUser,
    fetchUsersChats,
    fetchUser,
    token,
    setToken,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
