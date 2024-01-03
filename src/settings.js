import { __awaiter } from "tslib";
import { PluginSettingTab, Setting } from 'obsidian';
import { removeObsidianExtensions, removeOtherExtensions } from './helper';
import { PlainTextNotice } from './notice';
/**
 * The defaults:
 * * don't destroy other plugins
 * * no extensions to consider for the plaintext plugin.
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export const DEFAULT_SETTINGS = {
    overrideViewsFromOtherPlugins: false,
    extensions: []
};
/**
 * Process the user-inputted extensions
 *
 * @param _this passes "this" because JS is stupid in anonymous functions.
 */
const processExts = (_this) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the currently enabled extensions from the plaintext plugin.
    let currentExtensionList = Array.from(_this.plugin.settings.extensions);
    currentExtensionList =
        currentExtensionList == null || currentExtensionList == undefined ? [] : Array.from(new Set(currentExtensionList));
    // Grab the set of new extensions
    let newExtensionList = _this.changes == null || _this.changes == undefined
        ? []
        : _this.changes
            .split(',') // split on comma
            .map((s) => s.toLowerCase().trim()) // convert to lowercase and remove spaces
            .filter((s) => s != ''); // remove empty elements
    // Remove obsidian extensions from it
    newExtensionList = removeObsidianExtensions(newExtensionList);
    // If set to NOT destroy, remove other extensions
    if (!_this.plugin.settings.overrideViewsFromOtherPlugins) {
        newExtensionList = removeOtherExtensions(newExtensionList, _this.app.plugins.enabledPlugins);
    }
    // Find which extensions to add.
    const extensionsToAdd = newExtensionList.filter((ext) => !currentExtensionList.includes(ext));
    // Actually add the extensions
    _this.plugin.registerViewsForExtensions(extensionsToAdd);
    // Find which extensions to remove.
    const extensionsToRemove = currentExtensionList.filter((ext) => !newExtensionList.includes(ext));
    // Actually remove the extensions
    _this.plugin.deregisterViewsForExtensions(extensionsToRemove);
    // Save settings
    const updated_exts = currentExtensionList.concat(extensionsToAdd).filter((ext) => !extensionsToRemove.includes(ext));
    _this.plugin.settings.extensions = updated_exts;
    yield _this.plugin.saveSettings();
    // Communicate that extensions have been updated.
    new PlainTextNotice(_this.plugin, `Extensions updated to: ${_this.plugin.settings.extensions}`);
});
/**
 * The settings tab itself.
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export class PlainTextSettingTab extends PluginSettingTab {
    // Constructor: Creates a setting tab for this plugin.
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.changes = '';
    }
    display() {
        // Retrieve the container element
        const { containerEl } = this;
        containerEl.empty();
        // Write the title of the settings page.
        containerEl.createEl('h2', { text: 'Mycoshiro PlainText' });
        // Add extension setting
        new Setting(containerEl)
            .setName('Extensions')
            .setDesc('List of extensions to interpret as plaintext, comma-separated.' +
            ' Will automatically convert to a set when reopening the Obsidian PlainText settings window.' +
            " Obsidian's default extensions and extensions other plugins use are filtered out by default!")
            .addText((text) => {
            text
                .setPlaceholder('Extensions')
                .setValue(Array.from(this.plugin.settings.extensions).toString())
                .onChange((value) => (this.changes = value.toLowerCase().trim()));
            // Need to use anonymous function calling separate function
            text.inputEl.onblur = () => __awaiter(this, void 0, void 0, function* () {
                yield processExts(this);
            });
        });
        // Add destroy setting
        new Setting(containerEl)
            .setName('Destroy Other Plugins')
            .setDesc('There may be other plugins that already have registered extensions.' +
            ' By turning this setting ON, you willingly disregard those plugins, and will highly likely break them.' +
            " **ONLY TURN THIS ON IF YOU KNOW WHAT YOU'RE DOING!**")
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.overrideViewsFromOtherPlugins);
            toggle.onChange((destroy) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.overrideViewsFromOtherPlugins = destroy;
                if (destroy) {
                    new PlainTextNotice(this.plugin, 'Happily overriding views made by other plugins.Are you really sure you want this?');
                }
                else {
                    new PlainTextNotice(this.plugin, 'Disallow overriding views made by other plugins. YOU NEED TO DISABLE AND RE-ENABLE PLUGINS!');
                }
                yield this.plugin.saveSettings();
            }));
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFPLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMxRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFM0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQW1CM0M7Ozs7Ozs7R0FPRztBQUNILE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFzQjtJQUNqRCw2QkFBNkIsRUFBRSxLQUFLO0lBQ3BDLFVBQVUsRUFBRSxFQUFFO0NBQ2YsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxNQUFNLFdBQVcsR0FBRyxDQUFPLEtBQTBCLEVBQUUsRUFBRTtJQUN2RCxrRUFBa0U7SUFDbEUsSUFBSSxvQkFBb0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hFLG9CQUFvQjtRQUNsQixvQkFBb0IsSUFBSSxJQUFJLElBQUksb0JBQW9CLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0lBRXJILGlDQUFpQztJQUNqQyxJQUFJLGdCQUFnQixHQUNsQixLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLFNBQVM7UUFDakQsQ0FBQyxDQUFDLEVBQUU7UUFDSixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU87YUFDVixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCO2FBQzVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxD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ZW50IjpbImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IHJlbW92ZU9ic2lkaWFuRXh0ZW5zaW9ucywgcmVtb3ZlT3RoZXJFeHRlbnNpb25zIH0gZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IFBsYWluVGV4dFBsdWdpbiBmcm9tICcuL21haW4nO1xuaW1wb3J0IHsgUGxhaW5UZXh0Tm90aWNlIH0gZnJvbSAnLi9ub3RpY2UnO1xuXG4vKipcbiAqIFBsYWluVGV4dCBwbHVnaW4gc2V0dGluZ3MuXG4gKlxuICogQ3VycmVudGx5LCB0aGVyZSBhcmUgb25seSBzZXR0aW5ncyBvbiB3aGV0aGVyIHRvIHByaW50IGRlYnVnIHByaW50cyB0byBjb25zb2xlLFxuICogYW5kIGEgbGlzdCBvZiBleHRlbnNpb25zIHRoYXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgcGxhaW50ZXh0LlxuICpcbiAqIEB2ZXJzaW9uIDAuMy4wXG4gKiBAYXV0aG9yIGRiYXJlbmhvbHpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQbGFpblRleHRTZXR0aW5ncyB7XG4gIC8vIFdoZXRoZXIgb3Igbm90IHlvdSB3YW50IHRvIGFjdGl2ZWx5IGRlc3Ryb3kgb3RoZXIgcGx1Z2lucyBieSBkZW1vbGlzaGluZyB0aGVpciB2aWV3cy5cbiAgb3ZlcnJpZGVWaWV3c0Zyb21PdGhlclBsdWdpbnM6IGJvb2xlYW47XG5cbiAgLy8gRXh0ZW5zaW9ucyB0byBiZSBzZWVuIGFzIHBsYWludGV4dCBkb2N1bWVudHMuXG4gIGV4dGVuc2lvbnM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0czpcbiAqICogZG9uJ3QgZGVzdHJveSBvdGhlciBwbHVnaW5zXG4gKiAqIG5vIGV4dGVuc2lvbnMgdG8gY29uc2lkZXIgZm9yIHRoZSBwbGFpbnRleHQgcGx1Z2luLlxuICpcbiAqIEB2ZXJzaW9uIDAuMy4wXG4gKiBAYXV0aG9yIGRiYXJlbmhvbHpcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFBsYWluVGV4dFNldHRpbmdzID0ge1xuICBvdmVycmlkZVZpZXdzRnJvbU90aGVyUGx1Z2luczogZmFsc2UsXG4gIGV4dGVuc2lvbnM6IFtdXG59O1xuXG4vKipcbiAqIFByb2Nlc3MgdGhlIHVzZXItaW5wdXR0ZWQgZXh0ZW5zaW9uc1xuICpcbiAqIEBwYXJhbSBfdGhpcyBwYXNzZXMgXCJ0aGlzXCIgYmVjYXVzZSBKUyBpcyBzdHVwaWQgaW4gYW5vbnltb3VzIGZ1bmN0aW9ucy5cbiAqL1xuY29uc3QgcHJvY2Vzc0V4dHMgPSBhc3luYyAoX3RoaXM6IFBsYWluVGV4dFNldHRpbmdUYWIpID0+IHtcbiAgLy8gR2V0IHRoZSBjdXJyZW50bHkgZW5hYmxlZCBleHRlbnNpb25zIGZyb20gdGhlIHBsYWludGV4dCBwbHVnaW4uXG4gIGxldCBjdXJyZW50RXh0ZW5zaW9uTGlzdCA9IEFycmF5LmZyb20oX3RoaXMucGx1Z2luLnNldHRpbmdzLmV4dGVuc2lvbnMpO1xuICBjdXJyZW50RXh0ZW5zaW9uTGlzdCA9XG4gICAgY3VycmVudEV4dGVuc2lvbkxpc3QgPT0gbnVsbCB8fCBjdXJyZW50RXh0ZW5zaW9uTGlzdCA9PSB1bmRlZmluZWQgPyBbXSA6IEFycmF5LmZyb20obmV3IFNldChjdXJyZW50RXh0ZW5zaW9uTGlzdCkpO1xuXG4gIC8vIEdyYWIgdGhlIHNldCBvZiBuZXcgZXh0ZW5zaW9uc1xuICBsZXQgbmV3RXh0ZW5zaW9uTGlzdCA9XG4gICAgX3RoaXMuY2hhbmdlcyA9PSBudWxsIHx8IF90aGlzLmNoYW5nZXMgPT0gdW5kZWZpbmVkXG4gICAgICA/IFtdXG4gICAgICA6IF90aGlzLmNoYW5nZXNcbiAgICAgICAgICAuc3BsaXQoJywnKSAvLyBzcGxpdCBvbiBjb21tYVxuICAgICAgICAgIC5tYXAoKHMpID0+IHMudG9Mb3dlckNhc2UoKS50cmltKCkpIC8vIGNvbnZlcnQgdG8gbG93ZXJjYXNlIGFuZCByZW1vdmUgc3BhY2VzXG4gICAgICAgICAgLmZpbHRlcigocykgPT4gcyAhPSAnJyk7IC8vIHJlbW92ZSBlbXB0eSBlbGVtZW50c1xuXG4gIC8vIFJlbW92ZSBvYnNpZGlhbiBleHRlbnNpb25zIGZyb20gaXRcbiAgbmV3RXh0ZW5zaW9uTGlzdCA9IHJlbW92ZU9ic2lkaWFuRXh0ZW5zaW9ucyhuZXdFeHRlbnNpb25MaXN0KTtcblxuICAvLyBJZiBzZXQgdG8gTk9UIGRlc3Ryb3ksIHJlbW92ZSBvdGhlciBleHRlbnNpb25zXG4gIGlmICghX3RoaXMucGx1Z2luLnNldHRpbmdzLm92ZXJyaWRlVmlld3NGcm9tT3RoZXJQbHVnaW5zKSB7XG4gICAgbmV3RXh0ZW5zaW9uTGlzdCA9IHJlbW92ZU90aGVyRXh0ZW5zaW9ucyhuZXdFeHRlbnNpb25MaXN0LCBfdGhpcy5hcHAucGx1Z2lucy5lbmFibGVkUGx1Z2lucyk7XG4gIH1cblxuICAvLyBGaW5kIHdoaWNoIGV4dGVuc2lvbnMgdG8gYWRkLlxuICBjb25zdCBleHRlbnNpb25zVG9BZGQgPSBuZXdFeHRlbnNpb25MaXN0LmZpbHRlcigoZXh0KSA9PiAhY3VycmVudEV4dGVuc2lvbkxpc3QuaW5jbHVkZXMoZXh0KSk7XG5cbiAgLy8gQWN0dWFsbHkgYWRkIHRoZSBleHRlbnNpb25zXG4gIF90aGlzLnBsdWdpbi5yZWdpc3RlclZpZXdzRm9yRXh0ZW5zaW9ucyhleHRlbnNpb25zVG9BZGQpO1xuXG4gIC8vIEZpbmQgd2hpY2ggZXh0ZW5zaW9ucyB0byByZW1vdmUuXG4gIGNvbnN0IGV4dGVuc2lvbnNUb1JlbW92ZSA9IGN1cnJlbnRFeHRlbnNpb25MaXN0LmZpbHRlcigoZXh0KSA9PiAhbmV3RXh0ZW5zaW9uTGlzdC5pbmNsdWRlcyhleHQpKTtcblxuICAvLyBBY3R1YWxseSByZW1vdmUgdGhlIGV4dGVuc2lvbnNcbiAgX3RoaXMucGx1Z2luLmRlcmVnaXN0ZXJWaWV3c0ZvckV4dGVuc2lvbnMoZXh0ZW5zaW9uc1RvUmVtb3ZlKTtcblxuICAvLyBTYXZlIHNldHRpbmdzXG4gIGNvbnN0IHVwZGF0ZWRfZXh0cyA9IGN1cnJlbnRFeHRlbnNpb25MaXN0LmNvbmNhdChleHRlbnNpb25zVG9BZGQpLmZpbHRlcigoZXh0KSA9PiAhZXh0ZW5zaW9uc1RvUmVtb3ZlLmluY2x1ZGVzKGV4dCkpO1xuXG4gIF90aGlzLnBsdWdpbi5zZXR0aW5ncy5leHRlbnNpb25zID0gdXBkYXRlZF9leHRzO1xuICBhd2FpdCBfdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cbiAgLy8gQ29tbXVuaWNhdGUgdGhhdCBleHRlbnNpb25zIGhhdmUgYmVlbiB1cGRhdGVkLlxuICBuZXcgUGxhaW5UZXh0Tm90aWNlKF90aGlzLnBsdWdpbiwgYEV4dGVuc2lvbnMgdXBkYXRlZCB0bzogJHtfdGhpcy5wbHVnaW4uc2V0dGluZ3MuZXh0ZW5zaW9uc31gKTtcbn07XG5cbi8qKlxuICogVGhlIHNldHRpbmdzIHRhYiBpdHNlbGYuXG4gKlxuICogQHZlcnNpb24gMC4zLjBcbiAqIEBhdXRob3IgZGJhcmVuaG9selxuICovXG5leHBvcnQgY2xhc3MgUGxhaW5UZXh0U2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAvLyBUaGUgcGx1Z2luIGl0c2VsZiAoY2Fubm90IGJlIHByaXZhdGUgZHVlIHRvIHByb2Nlc3NFeHRzIG1ldGhvZClcbiAgcGx1Z2luOiBQbGFpblRleHRQbHVnaW47XG5cbiAgLy8gQ2hhbmdlcyBtYWRlIHRvIHRoZSBleHRlbnNpb24gYXJyYXkgKGNhbm5vdCBiZSBwcml2YXRlIGR1ZSB0byBwcm9jZXNzRXh0cyBtZXRob2QpXG4gIGNoYW5nZXM6IHN0cmluZztcblxuICAvLyBDb25zdHJ1Y3RvcjogQ3JlYXRlcyBhIHNldHRpbmcgdGFiIGZvciB0aGlzIHBsdWdpbi5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUGxhaW5UZXh0UGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgIHRoaXMuY2hhbmdlcyA9ICcnO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAvLyBSZXRyaWV2ZSB0aGUgY29udGFpbmVyIGVsZW1lbnRcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICAvLyBXcml0ZSB0aGUgdGl0bGUgb2YgdGhlIHNldHRpbmdzIHBhZ2UuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnTXljb3NoaXJvIFBsYWluVGV4dCcgfSk7XG5cbiAgICAvLyBBZGQgZXh0ZW5zaW9uIHNldHRpbmdcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdFeHRlbnNpb25zJylcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnTGlzdCBvZiBleHRlbnNpb25zIHRvIGludGVycHJldCBhcyBwbGFpbnRleHQsIGNvbW1hLXNlcGFyYXRlZC4nICtcbiAgICAgICAgICAnIFdpbGwgYXV0b21hdGljYWxseSBjb252ZXJ0IHRvIGEgc2V0IHdoZW4gcmVvcGVuaW5nIHRoZSBPYnNpZGlhbiBQbGFpblRleHQgc2V0dGluZ3Mgd2luZG93LicgK1xuICAgICAgICAgIFwiIE9ic2lkaWFuJ3MgZGVmYXVsdCBleHRlbnNpb25zIGFuZCBleHRlbnNpb25zIG90aGVyIHBsdWdpbnMgdXNlIGFyZSBmaWx0ZXJlZCBvdXQgYnkgZGVmYXVsdCFcIlxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignRXh0ZW5zaW9ucycpXG4gICAgICAgICAgLnNldFZhbHVlKEFycmF5LmZyb20odGhpcy5wbHVnaW4uc2V0dGluZ3MuZXh0ZW5zaW9ucykudG9TdHJpbmcoKSlcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiAodGhpcy5jaGFuZ2VzID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCkpKTtcblxuICAgICAgICAvLyBOZWVkIHRvIHVzZSBhbm9ueW1vdXMgZnVuY3Rpb24gY2FsbGluZyBzZXBhcmF0ZSBmdW5jdGlvblxuICAgICAgICB0ZXh0LmlucHV0RWwub25ibHVyID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IHByb2Nlc3NFeHRzKHRoaXMpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAvLyBBZGQgZGVzdHJveSBzZXR0aW5nXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRGVzdHJveSBPdGhlciBQbHVnaW5zJylcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnVGhlcmUgbWF5IGJlIG90aGVyIHBsdWdpbnMgdGhhdCBhbHJlYWR5IGhhdmUgcmVnaXN0ZXJlZCBleHRlbnNpb25zLicgK1xuICAgICAgICAgICcgQnkgdHVybmluZyB0aGlzIHNldHRpbmcgT04sIHlvdSB3aWxsaW5nbHkgZGlzcmVnYXJkIHRob3NlIHBsdWdpbnMsIGFuZCB3aWxsIGhpZ2hseSBsaWtlbHkgYnJlYWsgdGhlbS4nICtcbiAgICAgICAgICBcIiAqKk9OTFkgVFVSTiBUSElTIE9OIElGIFlPVSBLTk9XIFdIQVQgWU9VJ1JFIERPSU5HISoqXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mub3ZlcnJpZGVWaWV3c0Zyb21PdGhlclBsdWdpbnMpO1xuICAgICAgICB0b2dnbGUub25DaGFuZ2UoYXN5bmMgKGRlc3Ryb3kpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vdmVycmlkZVZpZXdzRnJvbU90aGVyUGx1Z2lucyA9IGRlc3Ryb3k7XG4gICAgICAgICAgaWYgKGRlc3Ryb3kpIHtcbiAgICAgICAgICAgIG5ldyBQbGFpblRleHROb3RpY2UoXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLFxuICAgICAgICAgICAgICAnSGFwcGlseSBvdmVycmlkaW5nIHZpZXdzIG1hZGUgYnkgb3RoZXIgcGx1Z2lucy5BcmUgeW91IHJlYWxseSBzdXJlIHlvdSB3YW50IHRoaXM/J1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IFBsYWluVGV4dE5vdGljZShcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4sXG4gICAgICAgICAgICAgICdEaXNhbGxvdyBvdmVycmlkaW5nIHZpZXdzIG1hZGUgYnkgb3RoZXIgcGx1Z2lucy4gWU9VIE5FRUQgVE8gRElTQUJMRSBBTkQgUkUtRU5BQkxFIFBMVUdJTlMhJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==