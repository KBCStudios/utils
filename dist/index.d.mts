import * as discord_js from 'discord.js';
import { Client, Guild, Message, WebhookClient } from 'discord.js';
export { AnsiStyle, Logger } from './Logger.mjs';
import { EvalRespose, ExecRespose, RandomString, MCServer, Rule34, RedditMeme } from './types.mjs';

declare class Util {
    private _custom;
    constructor();
    get version(): string;
    /**
     * Updates the package
     * @param manager Manager to use, default: npm install
     */
    update(manager?: string): void | false;
    /**
     * Evals a code in TypeScript (Compatible with JavaScript)
     * Note: At the end of the code you should put a "return" to mark what will be returned.
     * @param code Code to eval
     * @returns Promise<EvalRespose>
     */
    eval(code: string): Promise<EvalRespose>;
    /**
     * Execute a console command
     * @param command Command to execute
     * @returns Promise<ExecRespose>
     */
    exec(command: string): Promise<ExecRespose>;
    /**
     * This is where your custom functions are stored
     */
    get custom(): {
        [k: string]: Function;
    };
    /**
     * With this you create a custom function
     * @param name Name of the function
     * @param f Function to save
     * @returns boolean
     */
    create(name: string, f: Function): boolean;
    /**
     * With this you deletes a custom function
     * @param name Name of the function
     * @returns boolean
     */
    delete(name: string): boolean;
    /**
     * Restart the runtime process
     */
    reboot(): void;
    /**
     * Get the code of any function of the package or any function that you want to use.
     * @param method Path of the function in class or a function.
     * @returns string
     */
    source(method: string | Function): string;
    /**
     * Utilities oriented to a Discord Client
     */
    get discord(): {
        /**
         * Get the entire list of users of a bot
         * @param client Discord Client, see: [Discord.js Client](https://discord.js.org/docs/packages/discord.js/main/Client:class)
         * @returns number
         */
        allMembersCount(client: Client): number;
        /**
         * Generate an array with strings based on a string, in turn you can give a prefix to be deleted from the first word
         * @param prefix This is the prefix to be removed, it is optional
         * @returns string[]
         */
        argsIfy(message: string, prefix?: string): string[];
        /**
         * Checks if the provided id was banned from the given [Guild](https://discord.js.org/docs/packages/discord.js/main/Guild:class)
         * @param user User ID
         * @param guild [Guild](https://discord.js.org/docs/packages/discord.js/main/Guild:class)
         * @returns boolean
         */
        isBanned(user: string, guild: Guild): boolean;
        /**
         * Gets a member from a server, otherwise will return to the author if desired or null
         * @param message [Message](https://discord.js.org/docs/packages/discord.js/main/Message:class)
         * @param id string
         * @param returnAuthor boolean
         * @returns Promise<GuildMember | null>
         */
        getMember(message: Message, id: string, returnAuthor?: boolean): Promise<discord_js.GuildMember | null>;
        /**
         * Gets a user, otherwise will return to the author if desired or null
         * @param message [Message](https://discord.js.org/docs/packages/discord.js/main/Message:class)
         * @param id string
         * @param returnAuthor boolean
         * @returns Promise<User | null>
         */
        getUser(message: Message, id: string, returnAuthor?: boolean): Promise<discord_js.User | null>;
        /**
         * Creates a webhook client to interact with and use a webhook
         * @param url Webhook URL
         * @returns WebhookClient
         */
        webhook(url: string): WebhookClient;
        /**
         * Check if the given user has voted for a bot on the [top.gg](https://top.gg/) page.
         * @param bot Your discord bot's id
         * @param id ID of the user
         * @param token Your top.gg token, to get it see [authentication](https://docs.top.gg/docs/API/@reference#authentication)
         * @returns Promise<boolean>
         */
        voted(bot: string, id: string, token: string): Promise<boolean>;
    };
    /**
     * Runtime performance-oriented utilities
     */
    get runtime(): {
        /**
         * Gets the percentage of processor usage, and also rounds it to the number of decimal places of your choice.
         * @param decimals Number of decimals, by default 2
         * @returns string
         */
        cpu(decimals?: number): string;
        /**
         * Gets the ram memory usage in: Bytes (B), KiloBytes (KB), MegaBytes (MB), or GigaBytes (GB); this is rounded to the decimal places you want.
         * @param decimals Number of decimals, by default 2
         * @param format Format to display RAM consumption, by default KiloBytes (KB)
         * @returns string
         */
        ram(decimals?: number, format?: "B" | "KB" | "MB" | "GB"): string;
        /**
         * Get run time in milliseconds
         * @returns number
         */
        uptime: () => number;
    };
    /**
     * Utilities oriented to obtain random values
     */
    get random(): {
        /**
         * Get a random number between two of your choice
         * @param min Minimum value
         * @param max Maximum value
         * @param decimals Number of decimals
         * @returns number
         */
        number(min: number, max: number, decimals?: boolean): number;
        /**
         * Get a random string of your choice
         * @param length Length of the string
         * @param config RandomString
         * @returns string
         */
        string(length: number, config: RandomString): string;
        /**
         * From an array, returns random values in a new array.
         * @param array Array to use
         * @param length Length of the new array
         * @returns string[]
         */
        onArray<T>(array: T[], length?: number): T[];
    };
    /**
     * Utilities oriented to falsify data
     */
    get fake(): {
        /**
         * Generate a fake IPv4
         * @returns Fake id, like: 123.234.243.223
         */
        ipv4: () => string;
        /**
         * Generate a fake IPv6
         * @returns Fake id, like: 2001:8a2d:6c3c:6391:18f1:e073:73dd:a025
         */
        ipv6: () => string;
    };
    /**
     * Utilities oriented to check whether a data is what is needed
     */
    get check(): {
        /**
         * Checks if the provided string is a hex
         * @param hex String to analize
         * @returns boolean
         */
        hex(hex: string): boolean;
    };
    /**
     * Utilities oriented to fetch certain apis
     */
    get fetch(): {
        /**
         * Obtains information from a minecraft server based on its ip.
         * API: [MineTools - API](https://api.minetools.eu/)
         * @param ip IP to fetch
         * @returns Promise<MCServer>
         */
        mcserver(ip: string): Promise<MCServer>;
        /**
         * Exactly the same as the JavaScript *fetch* function, see [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/fetch)
         * @param input URL to fetch
         * @param init See [Request Options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
         * @returns Promise<Response>
         */
        fetch: (input: string, init?: RequestInit) => Promise<Response>;
        /**
         * Gets a random post with tags to choose from the Rule34 api.\
         * [WARNING] This function returns and contains mostly explicit content, the use of this function is under your own responsibility.
         * @param tags Tags to search. Example: ["video"]
         * @returns Promise<Rule34>
         */
        rule34(tags?: string[]): Promise<Rule34>;
    };
    get media(): {
        /**
         * Get random meme in English or Spanish from any subreddit
         * Sub Reddit's: [Spanish](https://www.reddit.com/r/SpanishMeme) [English](https://www.reddit.com/r/memes/)
         * @param idiom [ES](https://www.reddit.com/r/SpanishMeme) or [EN](https://www.reddit.com/r/memes/)
         * @returns Promise<RedditMeme>
         */
        meme(idiom: "ES" | "EN"): Promise<RedditMeme>;
        /**
         * Gets a random image of Rei Plush
         */
        rei: () => string;
        /**
         * Gets a random meme of Shot-On-iPhone
         */
        soi: () => string;
    };
}

export { EvalRespose, ExecRespose, MCServer, RandomString, RedditMeme, Rule34, Util };
