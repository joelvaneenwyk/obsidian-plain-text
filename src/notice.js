import { Notice } from 'obsidian';
import { craftLogMessage } from './helper';
const DEFAULT_NOTICE_TIMEOUT_SECONDS = 5;
/**
 * A very simple notice.
 * Uses a helper function to craft a message, so that
 * the messages in the console and notices are consistent.
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export class PlainTextNotice extends Notice {
    constructor(plugin, message, timeout = DEFAULT_NOTICE_TIMEOUT_SECONDS) {
        super(message, timeout * 1000);
        const msg = craftLogMessage(plugin, message);
        console.log(msg);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm90aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUczQyxNQUFNLDhCQUE4QixHQUFHLENBQUMsQ0FBQztBQUV6Qzs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxPQUFPLGVBQWdCLFNBQVEsTUFBTTtJQUN6QyxZQUFZLE1BQXVCLEVBQUUsT0FBa0MsRUFBRSxPQUFPLEdBQUcsOEJBQThCO1FBQy9HLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9CLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOb3RpY2UgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBjcmFmdExvZ01lc3NhZ2UgfSBmcm9tICcuL2hlbHBlcic7XG5pbXBvcnQgUGxhaW5UZXh0UGx1Z2luIGZyb20gJy4vbWFpbic7XG5cbmNvbnN0IERFRkFVTFRfTk9USUNFX1RJTUVPVVRfU0VDT05EUyA9IDU7XG5cbi8qKlxuICogQSB2ZXJ5IHNpbXBsZSBub3RpY2UuXG4gKiBVc2VzIGEgaGVscGVyIGZ1bmN0aW9uIHRvIGNyYWZ0IGEgbWVzc2FnZSwgc28gdGhhdFxuICogdGhlIG1lc3NhZ2VzIGluIHRoZSBjb25zb2xlIGFuZCBub3RpY2VzIGFyZSBjb25zaXN0ZW50LlxuICpcbiAqIEB2ZXJzaW9uIDAuMy4wXG4gKiBAYXV0aG9yIGRiYXJlbmhvbHpcbiAqL1xuZXhwb3J0IGNsYXNzIFBsYWluVGV4dE5vdGljZSBleHRlbmRzIE5vdGljZSB7XG4gIGNvbnN0cnVjdG9yKHBsdWdpbjogUGxhaW5UZXh0UGx1Z2luLCBtZXNzYWdlOiBzdHJpbmcgfCBEb2N1bWVudEZyYWdtZW50LCB0aW1lb3V0ID0gREVGQVVMVF9OT1RJQ0VfVElNRU9VVF9TRUNPTkRTKSB7XG4gICAgc3VwZXIobWVzc2FnZSwgdGltZW91dCAqIDEwMDApO1xuICAgIGNvbnN0IG1zZyA9IGNyYWZ0TG9nTWVzc2FnZShwbHVnaW4sIG1lc3NhZ2UpO1xuICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gIH1cbn1cbiJdfQ==