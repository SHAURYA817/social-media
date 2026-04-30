import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";


// 🔥 GET RECOMMENDED USERS (FIXED)
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;

    // ✅ ALWAYS fetch fresh user (NOT req.user)
    const currentUser = await User.findById(currentUserId);

    const recommendedUsers = await User.find({
      _id: {
        $ne: currentUserId,
        $nin: currentUser.friends,
      },
      isOnboarded: true,
    });

    res.status(200).json(recommendedUsers);

  } catch (error) {
    console.error("Error fetching recommended users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


// 🔥 GET MY FRIENDS
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage location"
      );

    res.status(200).json(user.friends);

  } catch (error) {
    console.error("Error fetching friends:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


// 🔥 SEND FRIEND REQUEST
export async function sendfriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res.status(400).json({
        message: "You cannot send a friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // ✅ Already friends check
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // ✅ Existing request check
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already exists",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(200).json(friendRequest);

  } catch (error) {
    console.error("Error sending friend request:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


// 🔥 ACCEPT FRIEND REQUEST (FINAL FIX)
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // ✅ Check authorization
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Fetch fresh users
    const sender = await User.findById(friendRequest.sender);
    const receiver = await User.findById(friendRequest.recipient);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Add each other (NO duplicates)
    if (!sender.friends.includes(receiver._id)) {
      sender.friends.push(receiver._id);
    }

    if (!receiver.friends.includes(sender._id)) {
      receiver.friends.push(sender._id);
    }

    // ✅ Save both users
    await sender.save();
    await receiver.save();

    // ✅ Update request
    friendRequest.status = "accepted";
    await friendRequest.save();

    // 🔥 Optional (clean DB)
    // await FriendRequest.findByIdAndDelete(requestId);

    console.log("Sender friends:", sender.friends);
    console.log("Receiver friends:", receiver.friends);

    res.status(200).json({ message: "Friend request accepted" });

  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// 🔥 GET FRIEND REQUESTS
export async function getFriendRequests(req, res) {
  try {
    const incomingReq = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage location"
    );

    const acceptedReq = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReq, acceptedReq });

  } catch (error) {
    console.error("Error fetching friend requests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


// 🔥 GET OUTGOING REQUESTS
export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingReq = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage location"
    );

    res.status(200).json(outgoingReq);

  } catch (error) {
    console.error("Error fetching outgoing requests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}