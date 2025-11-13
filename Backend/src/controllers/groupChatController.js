
import Chat from "../model/groupChatModel.js";

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the required fields (name and users)." });
    }

    let users;
    try {
        users = JSON.parse(req.body.users);
    } catch (error) {
        return res.status(400).send({ message: "Users list must be a valid JSON array of IDs." });
    }
    if (users.length < 2) {
        return res.status(400).send({
            message: "A group chat requires more than 2 users (including yourself)."
        });
    }
    users.push(req.user._id);

    try {
        // 2. CREATE THE GROUP CHAT
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id, // Set the creator as the admin
        });

        // 3. FETCH AND POPULATE THE NEWLY CREATED CHAT
        // We fetch the chat to populate the user references and the admin reference
        // before sending it back to the client.
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password") // Populate all members, excluding their password
            .populate("groupAdmin", "-password"); // Populate the admin, excluding their password

        // 4. RESPOND WITH THE NEW CHAT
        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default createGroupChat