/**
 * Type definition for `util.eval`
 */
type EvalRespose = {
    code: string;
    result: string;
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "error" | "unknown";
    latency: string;
};
/**
 * Type definition for `util.exec`
 */
type ExecRespose = {
    command: string;
    result: string;
    latency: string;
};
/**
 * Type definition for `util.fetch.mcserver`
 */
type MCServer<success = boolean> = {
    ip: string;
    online: boolean;
    description: success extends true ? string : null;
    favicon: success extends true ? Buffer : null;
    latency: success extends true ? number : 0;
    players: {
        max: success extends true ? number : 0;
        online: success extends true ? number : 0;
        sample: any[];
    };
    version: {
        name: success extends true ? Buffer : null;
        protocol: success extends true ? number : 0;
    };
};
/**
 * Type definition for `util.media.meme`
 */
type RedditMeme = {
    subreddit: string;
    url: string;
};
/**
 * Type definition for `util.fetch.rule34`
 */
type Rule34 = {
    rating: string;
    score: number;
    tags: string[];
    id: string;
    post_url: string;
    file_url: string;
};
type RandomString = {
    caps: boolean;
    lowercase: boolean;
    numbers: boolean;
    dots: boolean;
};

export type { EvalRespose, ExecRespose, MCServer, RandomString, RedditMeme, Rule34 };
