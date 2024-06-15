export * from "./Logger";
import { Logger } from "./Logger";
import { execSync, spawn } from "child_process";
import { transpile } from "typescript";
import {
	EvalRespose,
	ExecRespose,
	MCServer,
	RandomString,
	RedditMeme,
	Rule34,
} from "./types";
import { Client, Guild, Message, WebhookClient } from "discord.js";
import os from "os";
import images from "./images/";
import { get } from "lodash";

const logger = new Logger();

export class Util {
	private _custom: [string, Function][];
	constructor() {
		this._custom = [];
	}

	public get version(): string {
		return require("../package.json").version ?? "0.0.0";
	}

	/**
	 * Updates the package
	 * @param manager Manager to use, default: npm install
	 */
	public update(manager: string = "npm install"): void | false {
		try {
			execSync(`${manager} @kingbecats/utils.js`, { encoding: "utf-8" });
			logger.info(`UPDATE`, `Manager: ${manager}`);
			spawn(process.argv.shift()!, process.argv, {
				cwd: process.cwd(),
				detached: true,
				stdio: "inherit",
			});
			process.exit();
		} catch (e) {
			logger.error("UPDATE", String(e));
			return false;
		}
	}

	/**
	 * Evals a code in TypeScript (Compatible with JavaScript)
	 * Note: At the end of the code you should put a "return" to mark what will be returned.
	 * @param code Code to eval
	 * @returns Promise<EvalRespose>
	 */
	public async eval(code: string): Promise<EvalRespose> {
		const t = Date.now();
		const result = await eval(transpile(`(async () => {${code}})()`));
		return {
			code,
			result,
			type: typeof result,
			latency: Date.now() - t + "ms",
		};
	}

	/**
	 * Execute a console command
	 * @param command Command to execute
	 * @returns Promise<ExecRespose>
	 */
	public async exec(command: string): Promise<ExecRespose> {
		const t = Date.now();
		const result = (await execSync(command)).toString();
		return {
			command,
			result,
			latency: Date.now() - t + "ms",
		};
	}

	/**
	 * This is where your custom functions are stored
	 */
	public get custom() {
		return Object.fromEntries(this._custom);
	}

	/**
	 * With this you create a custom function
	 * @param name Name of the function
	 * @param f Function to save
	 * @returns boolean
	 */
	create(name: string, f: Function) {
		this._custom.push([name, f]);
		return true;
	}

	/**
	 * With this you deletes a custom function
	 * @param name Name of the function
	 * @returns boolean
	 */
	delete(name: string) {
		const index = this._custom.findIndex((f) => f[0] == name);
		if (index !== -1) {
			this._custom.splice(index, 1); // Eliminar 1 elemento a partir del índice indexToDelete
		}

		return true;
	}

	/**
	 * Restart the runtime process
	 */
	public reboot(): void {
		spawn(process.argv.shift()!, process.argv, {
			cwd: process.cwd(),
			detached: true,
			stdio: "inherit",
		});
		process.exit();
	}

	/**
	 * Get the code of any function of the package or any function that you want to use.
	 * @param method Path of the function in class or a function.
	 * @returns string
	 */
	public source(method: string | Function): string {
		if (typeof method == "string") return get(Util.prototype, method).toString();
		else return method.toString();
	}

	/**
	 * Utilities oriented to a Discord Client
	 */
	public get discord() {
		return {
			/**
			 * Get the entire list of users of a bot
			 * @param client Discord Client, see: [Discord.js Client](https://discord.js.org/docs/packages/discord.js/main/Client:class)
			 * @returns number
			 */
			allMembersCount(client: Client): number {
				if (!client && typeof client !== "object") {
					logger.error("DISCORD.ALL_MEMBERS_COUNT", "Client was not given");
					return 0;
				}
				return client.guilds.cache
					.map((g) => g.memberCount || 0)
					.reduce((x, y) => x + y, 0);
			},

			/**
			 * Generate an array with strings based on a string, in turn you can give a prefix to be deleted from the first word
			 * @param prefix This is the prefix to be removed, it is optional
			 * @returns string[]
			 */
			argsIfy(message: string, prefix?: string): string[] {
				let args: string[] = [];
				if (!message || typeof message !== "string") {
					logger.error(
						"DISCORD.ARGSIFY",
						"Message was not given or is not a string"
					);
				}
				if (Boolean(prefix)) {
					if (typeof prefix !== "string") {
						logger.error("DISCORD.ARGSIFY", "Prefix was not a string");
						args = message.trim().split(/ +/);
					} else {
						args = message.slice(prefix?.length).trim().split(/ +/);
					}
				} else {
					args = message.trim().split(/ +/);
				}

				return args;
			},

			/**
			 * Checks if the provided id was banned from the given [Guild](https://discord.js.org/docs/packages/discord.js/main/Guild:class)
			 * @param user User ID
			 * @param guild [Guild](https://discord.js.org/docs/packages/discord.js/main/Guild:class)
			 * @returns boolean
			 */
			isBanned(user: string, guild: Guild) {
				if (!user || typeof user !== "string") return false;
				if (!guild || !(guild instanceof Guild)) return false;
				return Boolean(guild.bans.cache.get(user));
			},

			/**
			 * Gets a member from a server, otherwise will return to the author if desired or null
			 * @param message [Message](https://discord.js.org/docs/packages/discord.js/main/Message:class)
			 * @param id string
			 * @param returnAuthor boolean
			 * @returns Promise<GuildMember | null>
			 */
			async getMember(message: Message, id: string, returnAuthor = false) {
				if (!message) return null;
				let user = id?.replace(/[^0-9]/g, "")?.replace(/ /g, "");
				if (!user && !returnAuthor) return null;
				if (!user && returnAuthor) return message.member;
				let m;
				m = message.guild!.members.cache.get(user);
				if (!m) m = await message.guild!.members.fetch(user).catch(() => null);
				if (!m && returnAuthor) return message.member;
				return m;
			},

			/**
			 * Gets a user, otherwise will return to the author if desired or null
			 * @param message [Message](https://discord.js.org/docs/packages/discord.js/main/Message:class)
			 * @param id string
			 * @param returnAuthor boolean
			 * @returns Promise<User | null>
			 */
			async getUser(message: Message, id: string, returnAuthor = false) {
				if (!message) return null;
				const { client, author } = message;
				let user = id?.replace(/[^0-9]/g, "")?.replace(/ /g, "");
				if (!user && !returnAuthor) return null;
				if (!user && returnAuthor) return author;
				let m;
				m = client.users.cache.get(user);
				if (!m) m = await client.users.fetch(user).catch(() => null);
				if (!m && returnAuthor) return author;
				return m;
			},

			/**
			 * Creates a webhook client to interact with and use a webhook
			 * @param url Webhook URL
			 * @returns WebhookClient
			 */
			webhook(url: string) {
				return new WebhookClient({
					url: url,
				});
			},
			/**
			 * Check if the given user has voted for a bot on the [top.gg](https://top.gg/) page.
			 * @param bot Your discord bot's id
			 * @param id ID of the user
			 * @param token Your top.gg token, to get it see [authentication](https://docs.top.gg/docs/API/@reference#authentication)
			 * @returns Promise<boolean>
			 */
			async voted(bot: string, id: string, token: string) {
				let json = await (
					await fetch(`https://top.gg/api/bots/${bot}/check?userId=${id}`, {
						headers: {
							Authorization: token,
						},
					})
				).json();
				return Boolean(json.voted);
			},
		};
	}

	/**
	 * Runtime performance-oriented utilities
	 */
	public get runtime() {
		return {
			/**
			 * Gets the percentage of processor usage, and also rounds it to the number of decimal places of your choice.
			 * @param decimals Number of decimals, by default 2
			 * @returns string
			 */
			cpu(decimals: number = 2) {
				if (typeof decimals !== "number") {
					logger.error("RUNTIME.CPU", "No valid number was given, it was set as 2.");
					decimals = 2;
				}
				const cpus = os.cpus();
				const avgs = cpus.map((cpu) => {
					const total = Object.values(cpu.times).reduce((a, b) => a + b);
					const nonIdle = total - cpu.times.idle;
					return nonIdle / total;
				});
				return (avgs.reduce((a, b) => a + b) / cpus.length).toFixed(decimals);
			},
			/**
			 * Gets the ram memory usage in: Bytes (B), KiloBytes (KB), MegaBytes (MB), or GigaBytes (GB); this is rounded to the decimal places you want.
			 * @param decimals Number of decimals, by default 2
			 * @param format Format to display RAM consumption, by default KiloBytes (KB)
			 * @returns string
			 */
			ram(decimals: number = 2, format: "B" | "KB" | "MB" | "GB" = "KB") {
				if (!["B", "KB", "MB", "GB"].includes(format)) format = "KB";
				if (typeof decimals !== "number" || decimals < 0) decimals = 2;
				if (decimals > 100) decimals = 100;
				let usage: string = String(process.memoryUsage().rss);
				switch (format) {
					case "B":
						break;
					case "KB":
						usage = (+usage / 1024).toFixed(decimals);
						break;
					case "MB":
						usage = (+usage / 1024 / 1024).toFixed(decimals);
						break;
					case "GB":
						usage = (+usage / 1024 / 1024 / 1024).toFixed(decimals);
						break;
					default:
						usage = (+usage / 1024).toFixed(decimals);
				}

				return usage + format || "KB";
			},
			/**
			 * Get run time in milliseconds
			 * @returns number
			 */
			uptime: () => Number((process.uptime() * 1000).toFixed()),
		};
	}

	/**
	 * Utilities oriented to obtain random values
	 */
	public get random() {
		return {
			/**
			 * Get a random number between two of your choice
			 * @param min Minimum value
			 * @param max Maximum value
			 * @param decimals Number of decimals
			 * @returns number
			 */
			number(min: number, max: number, decimals: boolean = false) {
				if (min == max) return min;
				if (typeof min !== "number" || typeof max !== "number") return 0;
				const random = Math.random() * (max - min) + min;
				if (Boolean(decimals)) return random;
				return +random.toFixed();
			},
			/**
			 * Get a random string of your choice
			 * @param length Length of the string
			 * @param config RandomString
			 * @returns string
			 */
			string(length: number, config: RandomString) {
				if (typeof length !== "number") {
					logger.error("RANDOM.STRING", "Length must be a number");
					return "";
				}
				let char = "";
				if (Boolean(config.caps ?? true)) char += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
				if (Boolean(config.lowercase ?? true)) char += "abcdefghijklmnopqrstuvwxyz";
				if (Boolean(config.numbers)) char += "0123456789";
				if (Boolean(config.dots)) char += ".";
				let result = "";
				const charLength = char.length;
				for (let i = 0; i < length; i++) {
					result += char.charAt(Math.floor(Math.random() * charLength));
				}
				return result;
			},
			/**
			 * From an array, returns random values in a new array.
			 * @param array Array to use
			 * @param length Length of the new array
			 * @returns string[]
			 */
			onArray<T>(array: T[], length: number = 1): T[] {
				if (!Array.isArray(array)) return [];
				if (typeof length !== "number") length = 2;
				let arr: T[] = [];
				if (array.length < length) return array;
				let j = 0;
				do {
					const random = Math.floor(Math.random() * array.length);
					if (arr.includes(array[random]) === true) continue;
					arr.push(array[random]);
					j++;
				} while (j < length);
				return arr;
			},
		};
	}
	/**
	 * Utilities oriented to falsify data
	 */
	public get fake() {
		return {
			/**
			 * Generate a fake IPv4
			 * @returns Fake id, like: 123.234.243.223
			 */
			ipv4: () =>
				`${this.random.number(0, 255)}.${this.random.number(
					0,
					255
				)}.${this.random.number(0, 255)}.${this.random.number(0, 255)}`,
			/**
			 * Generate a fake IPv6
			 * @returns Fake id, like: 2001:8a2d:6c3c:6391:18f1:e073:73dd:a025
			 */
			ipv6: () => {
				const segments = ["2001"];
				for (let i = 0; i < 7; i++) {
					segments.push(
						Math.floor(Math.random() * 0x10000)
							.toString(16)
							.padStart(4, "0")
					);
				}
				return segments.join(":");
			},
		};
	}

	/**
	 * Utilities oriented to check whether a data is what is needed
	 */
	public get check() {
		return {
			/**
			 * Checks if the provided string is a hex
			 * @param hex String to analize
			 * @returns boolean
			 */
			hex(hex: string) {
				if (typeof hex !== "string") return false;
				const code = hex.replace(/(#)/g, "");
				const regex = new RegExp("^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
				return regex.test(code);
			},
		};
	}

	/**
	 * Utilities oriented to fetch certain apis
	 */
	public get fetch() {
		return {
			/**
			 * Obtains information from a minecraft server based on its ip.
			 * API: [MineTools - API](https://api.minetools.eu/)
			 * @param ip IP to fetch
			 * @returns Promise<MCServer>
			 */
			async mcserver(ip: string): Promise<MCServer> {
				try {
					const server = await (
						await fetch(`https://api.minetools.eu/ping/${ip}`)
					).json();
					return {
						ip,
						online: true,
						description: server.description,
						favicon: Buffer.from(server.favicon.split(",")[1], "base64"),
						latency: server.latency,
						players: server.players,
						version: server.version,
					} as MCServer<true>;
				} catch (e) {
					return {
						ip,
						online: false,
						description: null,
						favicon: null,
						latency: 0,
						players: {
							max: 0,
							online: 0,
							sample: [],
						},
						version: {
							name: null,
							protocol: 0,
						},
					} as MCServer<false>;
				}
			},
			/**
			 * Exactly the same as the JavaScript *fetch* function, see [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/fetch)
			 * @param input URL to fetch
			 * @param init See [Request Options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
			 * @returns Promise<Response>
			 */
			fetch: (input: string, init?: RequestInit): Promise<Response> =>
				fetch(input, init),
			/**
			 * Gets a random post with tags to choose from the Rule34 api.\
			 * [WARNING] This function returns and contains mostly explicit content, the use of this function is under your own responsibility.
			 * @param tags Tags to search. Example: ["video"]
			 * @returns Promise<Rule34>
			 */
			async rule34(tags?: string[]): Promise<Rule34> {
				if (!Array.isArray(tags)) tags = [];
				const posts = await (
					await fetch(
						`https://api.rule34.xxx//index.php?page=dapi&s=post&q=index&limit=1000&tags=${tags.join(
							"+"
						)}&json=1`
					)
				).json();
				const post = posts[Math.floor(Math.random() * posts.length)];
				return {
					rating: post.rating,
					score: post.score,
					tags: post.tags.split(" "),
					id: post.id,
					post_url: `https://rule34.xxx/index.php?page=post&s=view&id=${post.id}`,
					file_url: post.file_url,
				};
			},
		};
	}

	public get media() {
		return {
			/**
			 * Get random meme in English or Spanish from any subreddit
			 * Sub Reddit's: [Spanish](https://www.reddit.com/r/SpanishMeme) [English](https://www.reddit.com/r/memes/)
			 * @param idiom [ES](https://www.reddit.com/r/SpanishMeme) or [EN](https://www.reddit.com/r/memes/)
			 * @returns Promise<RedditMeme>
			 */
			async meme(idiom: "ES" | "EN"): Promise<RedditMeme> {
				const subreddits = {
					ES: "https://www.reddit.com/r/SpanishMeme.json",
					EN: "https://www.reddit.com/r/memes.json",
				};

				if (!["ES", "EN"].includes(idiom))
					idiom = Util.prototype.random.onArray(["ES", "EN"])[0] as "ES" | "EN";

				const memes = (await (await fetch(subreddits[idiom])).json()).data.children;
				const meme = memes[Math.floor(Math.random() * memes.length)];
				return {
					subreddit: meme.data.subreddit_name_prefixed,
					url: meme.data.url,
				};
			},
			/**
			 * Gets a random image of Rei Plush
			 */
			rei: (): string => images.rei[Math.floor(Math.random() * images.rei.length)],
			/**
			 * Gets a random meme of Shot-On-iPhone
			 */
			soi: (): string => images.soi[Math.floor(Math.random() * images.soi.length)],
		};
	}
}

export * from "./types";
