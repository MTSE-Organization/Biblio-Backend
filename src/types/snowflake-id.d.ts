declare module 'snowflake-id' {
  interface Options {
    mid?: number;
    offset?: number;
  }

  export default class SnowflakeID {
    constructor(options?: Options);
    generate(): bigint;
  }
}
