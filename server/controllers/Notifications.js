import Notification from "../models/Notifications.js";
import Notification2 from "../models/Notifications2.js";
import Relationship from "../models/Relationship.js";
export const getAllNotifications = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const filter = {
      user: userId,
    };
    const Notifications = await Notification.find(filter);
    return res.status(201).json(Notifications);
  } catch (error) {
    next(error);
  }
};
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(201).json({ notif });
  } catch (error) {
    next(error);
  }
};
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    return res
      .status(201)
      .json({ message: "Notification deleted successfully." });
  } catch (error) {
    next(error);
  }
};
export const deleteAllNotifications = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const filter = {
      user: userId,
    };
    const Notifications = await Notification.deleteMany(filter);
    return res.status(201).json({ message: "Notifications deleted" });
  } catch (error) {
    next(error);
  }
};

export const responseToRequest = async (req, res, next) => {
  const { notificationId, response } = req.body;
  try {
    const notification = await Notification2.findById(notificationId);

    if (response === "accept") {
      const newRelationship = new Relationship({
        user1: notification.userId,
        user2: notification.recipentId,
        tag: notification.tag,
      });

      //   const user = await User.findById(req.user.id);
      //   const notifDate = new Date();
      //   const newNotification1 = new Notification({
      //     user: user1,
      //     message: `You added ${user2Username} as ${tag}. Tap to see!`,
      //     timeStamp: notifDate,
      //     read: false,
      //     type: 1,
      //     relId: newRelationship._id,
      //   });
      //   const newNotification2 = new Notification({
      //     user: user2._id,
      //     message: `${user.name} added you as ${tag}. Tap  to see!`,
      //     timeStamp: notifDate,
      //     read: false,
      //     type: 1,
      //     relId: newRelationship._id,
      //   });
      await newRelationship.save();
      await Notification2.findByIdAndDelete(notificationId);
      res.status(201).send(newRelationship);
    } else if (response === "decline") {
      await Notification2.findByIdAndDelete(notificationId);
      res.status(201).send({ message: "request denied" });
    }
    // await newNotification1.save();
    // await newNotification2.save();
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  const recipentId = req.user.id;
  try {
    const filter = {
      recipentId: recipentId,
    };
    const Notifications = await Notification2.find(filter);
    return res.status(201).json(Notifications);
  } catch (error) {
    next(error);
  }
};
