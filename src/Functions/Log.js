import chalk from "chalk";

const Styles = {
  info: { prefix: chalk.blue("[INFO]"), func: console.log },
  done: { prefix: chalk.green("[SUCCESS]"), func: console.log },
  warn: { prefix: chalk.yellow("[WARNING]"), func: console.warn },
  error: { prefix: chalk.red("[ERROR]"), func: console.error },
};

/**
 * Logs the given string with a specified style.
 *
 * @param {string} String - The string to be logged.
 * @param {string} Style - The style of the log.
 * @return {undefined} This function does not return a value.
 */
export default function Log(String, Style) {
  const { prefix, func } = Styles[Style] || { func: console.log };
  func(`${prefix + ":" || ""} ${String}`);
}
