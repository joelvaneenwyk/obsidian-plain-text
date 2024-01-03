/**
 * Extensions obsidian supports natively.
 * Taken from the help page: https://help.obsidian.md/Advanced+topics/Accepted+file+formats
 *
 * @author dbarenholz
 * @version 0.3.0
 *
 * @since 2023/06/01
 */
export const OBSIDIAN_EXTENSIONS = new Set([
    'md',
    'png',
    'webp',
    'jpg',
    'jpeg',
    'gif',
    'bmp',
    'svg',
    'mp3',
    'webm',
    'wav',
    'm4a',
    'ogg',
    '3gp',
    'flac',
    'mp4',
    'webm',
    'ogv',
    'mov',
    'mkv',
    'pdf'
]);
/**
 * Maps pluginIds to extensions that they use.
 * These extensions will be filtered out by default.
 *
 * @author dbarenholz
 * @version 0.3.0
 *
 * @since 2022/08/13
 */
export const PROBLEMATIC_PLUGINS = new Map([
    // https://github.com/deathau/cooklang-obsidian
    ['cooklang-obsidian', 'cook'],
    // https://github.com/deathau/csv-obsidian
    ['csv-obsidian', 'csv'],
    // https://github.com/caronchen/obsidian-chartsview-plugin
    ['obsidian-chartsview-plugin', 'csv'],
    // https://github.com/Darakah/obsidian-fountain
    ['obsidian-fountain', 'fountain'],
    // https://github.com/deathau/ini-obsidian
    ['ini-obsidian', 'ini'],
    // https://github.com/deathau/txt-as-md-obsidian
    ['txt-as-md-obsidian', 'txt'],
    // https://github.com/mkozhukharenko/mdx-as-md-obsidian
    ['mdx-as-md-obsidian', 'mdx'],
    // https://github.com/ryanpcmcquen/obsidian-org-mode
    ['obsidian-org-mode', 'org'],
    // https://github.com/tgrosinger/ledger-obsidian
    ['ledger-obsidian', 'ledger'],
    // https://github.com/zsviczian/obsidian-excalidraw-plugin
    ['obsidian-excalidraw-plugin', 'excalidraw']
]);
export const removeObsidianExtensions = (exts) => {
    return exts.filter((ext) => !OBSIDIAN_EXTENSIONS.has(ext));
};
/**
 * Remove extensions registered by other plugins
 *
 * @param exts current list of extensions (unfiltered)
 * @param enabledPlugins set of enabled plugins (app.plugins.enabledPlugins)
 * @returns list of extensions without those used by any other enabled plugin
 */
export const removeOtherExtensions = (exts, enabledPlugins) => {
    for (const enabledPlugin of enabledPlugins) {
        // Grab the extension to remove if it exists
        const extToRemove = PROBLEMATIC_PLUGINS.has(enabledPlugin) ? PROBLEMATIC_PLUGINS.get(enabledPlugin) : null;
        // Remove if it exists
        if (extToRemove) {
            exts = exts.filter((ext) => ext !== extToRemove);
        }
    }
    return exts;
};
export const craftLogMessage = (plugin, message) => {
    const VERSION = plugin.manifest.version;
    return `[PlainText v${VERSION}]:  ${message}`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQWdCLElBQUksR0FBRyxDQUFDO0lBQ3RELElBQUk7SUFFSixLQUFLO0lBQ0wsTUFBTTtJQUNOLEtBQUs7SUFDTCxNQUFNO0lBQ04sS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBRUwsS0FBSztJQUNMLE1BQU07SUFDTixLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsTUFBTTtJQUVOLEtBQUs7SUFDTCxNQUFNO0lBQ04sS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBRUwsS0FBSztDQUNOLENBQUMsQ0FBQztBQUVIOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQXdCLElBQUksR0FBRyxDQUFDO0lBQzlELCtDQUErQztJQUMvQyxDQUFDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQztJQUM3QiwwQ0FBMEM7SUFDMUMsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDO0lBQ3ZCLDBEQUEwRDtJQUMxRCxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQztJQUNyQywrQ0FBK0M7SUFDL0MsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLENBQUM7SUFDakMsMENBQTBDO0lBQzFDLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQztJQUN2QixnREFBZ0Q7SUFDaEQsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUM7SUFDN0IsdURBQXVEO0lBQ3ZELENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDO0lBQzdCLG9EQUFvRDtJQUNwRCxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQztJQUM1QixnREFBZ0Q7SUFDaEQsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUM7SUFDN0IsMERBQTBEO0lBQzFELENBQUMsNEJBQTRCLEVBQUUsWUFBWSxDQUFDO0NBQzdDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLENBQUMsSUFBYyxFQUFZLEVBQUU7SUFDbkUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUMsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLENBQUMsSUFBYyxFQUFFLGNBQTJCLEVBQVksRUFBRTtJQUM3RixLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQzNDLDRDQUE0QztRQUM1QyxNQUFNLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzNHLHNCQUFzQjtRQUN0QixJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2hCLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUssV0FBVyxDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxDQUFDLE1BQXVCLEVBQUUsT0FBa0MsRUFBVSxFQUFFO0lBQ3JHLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQ3hDLE9BQU8sZUFBZSxPQUFPLE9BQU8sT0FBTyxFQUFFLENBQUM7QUFDaEQsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBsYWluVGV4dFBsdWdpbiBmcm9tICcuL21haW4nO1xuXG4vKipcbiAqIEV4dGVuc2lvbnMgb2JzaWRpYW4gc3VwcG9ydHMgbmF0aXZlbHkuXG4gKiBUYWtlbiBmcm9tIHRoZSBoZWxwIHBhZ2U6IGh0dHBzOi8vaGVscC5vYnNpZGlhbi5tZC9BZHZhbmNlZCt0b3BpY3MvQWNjZXB0ZWQrZmlsZStmb3JtYXRzXG4gKlxuICogQGF1dGhvciBkYmFyZW5ob2x6XG4gKiBAdmVyc2lvbiAwLjMuMFxuICpcbiAqIEBzaW5jZSAyMDIzLzA2LzAxXG4gKi9cbmV4cG9ydCBjb25zdCBPQlNJRElBTl9FWFRFTlNJT05TOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoW1xuICAnbWQnLFxuXG4gICdwbmcnLFxuICAnd2VicCcsXG4gICdqcGcnLFxuICAnanBlZycsXG4gICdnaWYnLFxuICAnYm1wJyxcbiAgJ3N2ZycsXG5cbiAgJ21wMycsXG4gICd3ZWJtJyxcbiAgJ3dhdicsXG4gICdtNGEnLFxuICAnb2dnJyxcbiAgJzNncCcsXG4gICdmbGFjJyxcblxuICAnbXA0JyxcbiAgJ3dlYm0nLFxuICAnb2d2JyxcbiAgJ21vdicsXG4gICdta3YnLFxuXG4gICdwZGYnXG5dKTtcblxuLyoqXG4gKiBNYXBzIHBsdWdpbklkcyB0byBleHRlbnNpb25zIHRoYXQgdGhleSB1c2UuXG4gKiBUaGVzZSBleHRlbnNpb25zIHdpbGwgYmUgZmlsdGVyZWQgb3V0IGJ5IGRlZmF1bHQuXG4gKlxuICogQGF1dGhvciBkYmFyZW5ob2x6XG4gKiBAdmVyc2lvbiAwLjMuMFxuICpcbiAqIEBzaW5jZSAyMDIyLzA4LzEzXG4gKi9cbmV4cG9ydCBjb25zdCBQUk9CTEVNQVRJQ19QTFVHSU5TOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcChbXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWF0aGF1L2Nvb2tsYW5nLW9ic2lkaWFuXG4gIFsnY29va2xhbmctb2JzaWRpYW4nLCAnY29vayddLFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZGVhdGhhdS9jc3Ytb2JzaWRpYW5cbiAgWydjc3Ytb2JzaWRpYW4nLCAnY3N2J10sXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9jYXJvbmNoZW4vb2JzaWRpYW4tY2hhcnRzdmlldy1wbHVnaW5cbiAgWydvYnNpZGlhbi1jaGFydHN2aWV3LXBsdWdpbicsICdjc3YnXSxcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhcmFrYWgvb2JzaWRpYW4tZm91bnRhaW5cbiAgWydvYnNpZGlhbi1mb3VudGFpbicsICdmb3VudGFpbiddLFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZGVhdGhhdS9pbmktb2JzaWRpYW5cbiAgWydpbmktb2JzaWRpYW4nLCAnaW5pJ10sXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWF0aGF1L3R4dC1hcy1tZC1vYnNpZGlhblxuICBbJ3R4dC1hcy1tZC1vYnNpZGlhbicsICd0eHQnXSxcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21rb3podWtoYXJlbmtvL21keC1hcy1tZC1vYnNpZGlhblxuICBbJ21keC1hcy1tZC1vYnNpZGlhbicsICdtZHgnXSxcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3J5YW5wY21jcXVlbi9vYnNpZGlhbi1vcmctbW9kZVxuICBbJ29ic2lkaWFuLW9yZy1tb2RlJywgJ29yZyddLFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGdyb3Npbmdlci9sZWRnZXItb2JzaWRpYW5cbiAgWydsZWRnZXItb2JzaWRpYW4nLCAnbGVkZ2VyJ10sXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96c3ZpY3ppYW4vb2JzaWRpYW4tZXhjYWxpZHJhdy1wbHVnaW5cbiAgWydvYnNpZGlhbi1leGNhbGlkcmF3LXBsdWdpbicsICdleGNhbGlkcmF3J11cbl0pO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlT2JzaWRpYW5FeHRlbnNpb25zID0gKGV4dHM6IHN0cmluZ1tdKTogc3RyaW5nW10gPT4ge1xuICByZXR1cm4gZXh0cy5maWx0ZXIoKGV4dCkgPT4gIU9CU0lESUFOX0VYVEVOU0lPTlMuaGFzKGV4dCkpO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgZXh0ZW5zaW9ucyByZWdpc3RlcmVkIGJ5IG90aGVyIHBsdWdpbnNcbiAqXG4gKiBAcGFyYW0gZXh0cyBjdXJyZW50IGxpc3Qgb2YgZXh0ZW5zaW9ucyAodW5maWx0ZXJlZClcbiAqIEBwYXJhbSBlbmFibGVkUGx1Z2lucyBzZXQgb2YgZW5hYmxlZCBwbHVnaW5zIChhcHAucGx1Z2lucy5lbmFibGVkUGx1Z2lucylcbiAqIEByZXR1cm5zIGxpc3Qgb2YgZXh0ZW5zaW9ucyB3aXRob3V0IHRob3NlIHVzZWQgYnkgYW55IG90aGVyIGVuYWJsZWQgcGx1Z2luXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVPdGhlckV4dGVuc2lvbnMgPSAoZXh0czogc3RyaW5nW10sIGVuYWJsZWRQbHVnaW5zOiBTZXQ8c3RyaW5nPik6IHN0cmluZ1tdID0+IHtcbiAgZm9yIChjb25zdCBlbmFibGVkUGx1Z2luIG9mIGVuYWJsZWRQbHVnaW5zKSB7XG4gICAgLy8gR3JhYiB0aGUgZXh0ZW5zaW9uIHRvIHJlbW92ZSBpZiBpdCBleGlzdHNcbiAgICBjb25zdCBleHRUb1JlbW92ZSA9IFBST0JMRU1BVElDX1BMVUdJTlMuaGFzKGVuYWJsZWRQbHVnaW4pID8gUFJPQkxFTUFUSUNfUExVR0lOUy5nZXQoZW5hYmxlZFBsdWdpbikgOiBudWxsO1xuICAgIC8vIFJlbW92ZSBpZiBpdCBleGlzdHNcbiAgICBpZiAoZXh0VG9SZW1vdmUpIHtcbiAgICAgIGV4dHMgPSBleHRzLmZpbHRlcigoZXh0KSA9PiBleHQgIT09IGV4dFRvUmVtb3ZlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZXh0cztcbn07XG5cbmV4cG9ydCBjb25zdCBjcmFmdExvZ01lc3NhZ2UgPSAocGx1Z2luOiBQbGFpblRleHRQbHVnaW4sIG1lc3NhZ2U6IHN0cmluZyB8IERvY3VtZW50RnJhZ21lbnQpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBWRVJTSU9OID0gcGx1Z2luLm1hbmlmZXN0LnZlcnNpb247XG4gIHJldHVybiBgW1BsYWluVGV4dCB2JHtWRVJTSU9OfV06ICAke21lc3NhZ2V9YDtcbn07XG5cbi8qKlxuICogQWRkIHR5cGluZ3MgZm9yIGEgYmV0dGVyIGRldmVsb3BlciBleHBlcmllbmNlLlxuICovXG5kZWNsYXJlIG1vZHVsZSAnb2JzaWRpYW4nIHtcbiAgaW50ZXJmYWNlIEFwcCB7XG4gICAgLy8gVGhhbmsgeW91ICdqYXZhbGVudCMzNDUyJyBmb3Igc3VnZ2VzdGlvbnMgb24gYmV0dGVyIHR5cGluZ1xuICAgIHZpZXdSZWdpc3RyeToge1xuICAgICAgdW5yZWdpc3RlclZpZXc6IChlOiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgICB1bnJlZ2lzdGVyRXh0ZW5zaW9uczogKGU6IHN0cmluZ1tdKSA9PiB2b2lkO1xuICAgIH07XG4gICAgcGx1Z2luczoge1xuICAgICAgbWFuaWZlc3RzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgZW5hYmxlZFBsdWdpbnM6IFNldDxzdHJpbmc+O1xuICAgIH07XG4gIH1cblxuICBpbnRlcmZhY2UgVmlldyB7XG4gICAgZmlsZToge1xuICAgICAgYmFzZW5hbWU6IHN0cmluZztcbiAgICAgIGV4dGVuc2lvbjogc3RyaW5nO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==