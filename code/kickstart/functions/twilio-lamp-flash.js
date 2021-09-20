const axios = require("axios");

exports.handler = async (context, event, callback) => {
  if (event.payload === undefined) {
    return callback(new Error("Not formatted like GitHub webhook"));
  }
  const payload = JSON.parse(event.payload);
  const msg = {};
  if (payload.starred_at === null) {
    msg.message = "This was unstarred";
  } else {
    const headers = {
      Authorization: `Bearer ${context.LIFX_TOKEN}`,
    };
    const config = { headers };

    const twilioRed = "#F22F46";
    const twilioWhite = "#FFFFFF";

    const params = {
      period: 0.5,
      cycles: 4,
      color: twilioWhite,
      from_color: twilioRed,
    };

    const paramBody = new URLSearchParams(params).toString();
    console.log("paramBody", paramBody);

    try {
      const response = await axios.post(
        `https://api.lifx.com/v1/lights/id:${context.LIFX_LIGHT_ID}/effects/pulse`,
        // If you pass a string it is assumed  to be form-url-encoded
        paramBody,
        config
      );
      msg.message = "Pulsed the light";
    } catch (err) {
      console.error("Whoops", err);
      return callback(err, msg);
    }
  }
  return callback(null, msg);
};
