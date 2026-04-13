import Notification from "../database/models/notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (String(notification.userId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this notification" });
    }
    notification.isRead = true;
    await notification.save();
    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
