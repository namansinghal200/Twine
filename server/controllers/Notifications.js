import Notification from "../models/Notifications.js";
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
