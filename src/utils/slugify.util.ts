import slugify from 'slugify';

export class SlugifyUtil {
  static toSlugify(value: string): string {
    return slugify(value, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
