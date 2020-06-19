const { Expo } = require("expo-server-sdk");
let expo = new Expo();

const sendNotification = async (data, tokens, body, title) => {
  let messages = [];
  for (let token of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: token,
      sound: "default",
      priority: "high",
      vibrate: [0, 250, 250, 250],
      body,
      title,
      data,
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      for (let receiptId in receipts) {
        let { status, message, details } = receipts[receiptId];
        if (status === "ok") {
          continue;
        } else if (status === "error") {
          console.error(
            `There was an error sending a notification: ${message}`
          );
          if (details && details.error) {
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = sendNotification;
