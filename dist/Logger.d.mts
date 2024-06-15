declare enum AnsiStyle {
    Reset = "\u001B[0m",
    Bold = "1",
    Dim = "2",
    Italic = "3",
    Underline = "4",
    Blink = "5",
    Inverse = "7",
    Hidden = "8",
    Strikethrough = "9",
    Black = "30",
    Red = "31",
    Green = "32",
    Yellow = "33",
    Blue = "34",
    Magenta = "35",
    Cyan = "36",
    White = "37",
    BrightBlack = "90",
    BrightRed = "91",
    BrightGreen = "92",
    BrightYellow = "93",
    BrightBlue = "94",
    BrightMagenta = "95",
    BrightCyan = "96",
    BrightWhite = "97",
    BgBlack = "40",
    BgRed = "41",
    BgGreen = "42",
    BgYellow = "43",
    BgBlue = "44",
    BgMagenta = "45",
    BgCyan = "46",
    BgWhite = "47",
    BgBrightBlack = "100",
    BgBrightRed = "101",
    BgBrightGreen = "102",
    BgBrightYellow = "103",
    BgBrightBlue = "104",
    BgBrightMagenta = "105",
    BgBrightCyan = "106",
    BgBrightWhite = "107"
}
/**
 * Logger class for logging messages with ANSI styling and formatting.
 */
declare class Logger {
    /** Prefix for log messages with UTILS styling */
    private prefix;
    /**
     * Pads the given text to the specified length using the specified characters.
     * @param text - The text to pad.
     * @param length - The desired length of the padded text.
     * @param chars - The characters to use for padding. Defaults to a space.
     * @returns The padded text.
     */
    pad(text: string, length: number, chars?: string): string;
    /**
     * Creates an ANSI escape code string with the specified styles.
     * @param styles - The styles to apply.
     * @returns The ANSI escape code string.
     */
    createAnsiCode(...styles: string[]): string;
    /**
     * Colors the given text with the specified ANSI styles.
     * @param text - The text to color.
     * @param styles - The styles to apply.
     * @returns The styled text.
     */
    color(text: string, ...styles: string[]): string;
    /**
     * Formats the given text by adding a tab character before each line.
     * @param text - The text to format.
     * @returns The formatted text.
     */
    format(text: string): string;
    /**
     * Logs an informational message.
     * @param from - The source of the message.
     * @param message - The message to log.
     */
    info(from: string, message: string): void;
    /**
     * Logs a debug message.
     * @param from - The source of the message.
     * @param message - The message to log.
     */
    debug(from: string, message: string): void;
    /**
     * Logs a warning message.
     * @param from - The source of the message.
     * @param message - The message to log.
     */
    warn(from: string, message: string): void;
    /**
     * Logs an error message.
     * @param from - The source of the message.
     * @param error - The error message to log.
     */
    error(from: string, error: string): void;
    /**
     * Gets the current date and time formatted as a string.
     * @returns The formatted date and time string.
     */
    private get time();
}

export { AnsiStyle, Logger };
