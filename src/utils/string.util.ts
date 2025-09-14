export class StringUtil {
  static isEmpty(str?: string | null): boolean {
    return str === null || str === undefined || str === '';
  }
}
