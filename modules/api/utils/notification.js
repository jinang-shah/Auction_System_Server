const deleteNotifications = function (old, id) {
  let deleteNotif;
  for (let i = 0; i < old.length; i++) {
    let pNotifications = old[i].when;
    for (let j = 0; j < pNotifications.length; j++) {
      if (pNotifications[j]._id.toString() == id) {
        deleteNotif = pNotifications[j];
      }
    }
    if (deleteNotif) {
      old[i].when = pNotifications.filter(
        (n) => n.at.getTime() > deleteNotif.at.getTime()
      );
      if (old[i].when.length == 0) {
        console.log("old before", old);
        old.splice(i, 1);
        console.log("old after", old);
      }
      return old;
    }
  }
  return old;
};

const viewedNotification = function (notif) {
  for (let i = 0; i < notif.length; i++) {
    let prodNotifications = notif[i].when;
    for (let j = 0; j < prodNotifications.length; j++) {
      if (prodNotifications[j].at.getTime() < Date.now()) {
        notif[i].when[j].viewed = true;
      }
    }
  }
  return notif;
};
module.exports = { deleteNotifications, viewedNotification };
