
import Chat from '../models/Chat.js';

//Api contoller for creating a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chatData = {
            userId,
            messages:[],
            name:"New Chat",
            userName: req.user.name,
        }

        await Chat.create(chatData);
        res.json({success:true, message:"New Chat Created"});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

//Api controller for getting all chats of a user
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({userId}).sort({updatedAt:-1});
        res.json({success:true, chats});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}


//Api controller for deleting a chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params; // 👈 take from URL param

    const deleted = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.json({ success: true, message: "Chat Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
