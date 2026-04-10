import User from "../models/User.js";

export async function getRecommendedUsers(req,res){
    try{
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and:[
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } }, // Exclude friends
                { isOnboarded: true }, // Only include onboarded users
            ],
        })
        res.status(200).json( recommendedUsers );
    } catch (error) {
        console.error("Error fetching recommended users:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyFriends(req,res){
    try{
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage location");

    res.status(200).json( user.friends );    
    } catch (error) {
        console.error("Error fetching friends:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendfriendRequest(req,res){
    try{
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        if(myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({ message: "Recipient user not found" });
        }

        // Check if they are already friends
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // Check if a friend request has already been sent
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        })    
        if(existingRequest) {
            return res.status(400).json({ message: "Friend request already sent to this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        })

        res.status(200).json(friendRequest);
    } catch (error) {
        console.error("Error sending friend request:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req,res){
    try{
        const {id:requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // verify current user is recipient
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each other to friends list
        //AddTOSET = adds element to the array only if it doesn't already exist, preventing duplicates


        await User.findByIdAndUpdate(friendRequest.sender,{
            $AddToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $AddToSet: { friends: friendRequest.sender },
        });   

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error("Error accepting friend request:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFriendRequests(req,res){
    try{
        const incomingReq = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending" 
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage location");

        const acceptedReq = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic ");

        res.status(200).json({ incomingReq, acceptedReq });
    } catch (error) {
        console.error("Error fetching friend requests:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req,res){
    try{
        const outgoingReq = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage location");

        res.status(200).json( outgoingReq );
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}    