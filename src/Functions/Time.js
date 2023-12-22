/**
 * Formats a given time value according to a specified style.
 *
 * @param {number} time - The time value to be formatted.
 * @param {import("discord.js").TimestampStylesString} style - The style to be applied to the formatted time.
 * @return {string} The formatted time string.
 */
export default function Time(Time, Style) {
  return `<t:${Math.floor(Time / 1000)}${Style ? `:${Style}` : ""}>`;
}
