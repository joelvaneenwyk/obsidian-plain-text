import { __awaiter } from "tslib";
import { Plugin, TFolder, normalizePath } from 'obsidian';
import { craftLogMessage, removeObsidianExtensions, removeOtherExtensions } from './helper';
import { CreateNewPlainTextFileModal } from './modal';
import { DEFAULT_SETTINGS, PlainTextSettingTab } from './settings';
import { PlainTextView } from './view';
/**
 * PlainText plugin.
 *
 * Allows you to edit files with specified extensions as if they are plaintext files.
 * There are a few checks to see whether or not you should actually do so:
 * 1. Default obsidian extensions are automatically filtered out.
 * 2. By default, extensions that other plugins use (e.g. csv or fountain) are filtered out.
 *    There's an option to "override" the views that those other plugins make
 *    in case you prefer to use the PlainTextView.
 *
 * There are NO checks to see if the file you wish to edit is actually a plaintext file.
 * Use common sense, and don't edit obviously non-plaintext files.
 *
 * @author dbarenholz
 * @version 0.3.0
 */
export default class PlainTextPlugin extends Plugin {
    constructor() {
        super(...arguments);
        this.removeConflictingExtensions = (exts) => {
            // Remove default Obsidian extensions from list
            exts = removeObsidianExtensions(exts);
            // If we are not destroying other plugins
            if (!this.settings.overrideViewsFromOtherPlugins) {
                // Then also remove those extensions
                exts = removeOtherExtensions(exts, app.plugins.enabledPlugins);
            }
            return exts;
        };
        this.viewCreator = (leaf) => new PlainTextView(leaf);
        this.registerViewsForExtensions = (exts) => {
            exts = this.removeConflictingExtensions(exts);
            exts.forEach((ext) => {
                // Try to register view
                try {
                    this.registerView(`${ext}-view`, this.viewCreator);
                }
                catch (_a) {
                    console.log(craftLogMessage(this, `Extension '${ext}' already has a view registered, ignoring...`));
                }
                // Try to register extension
                try {
                    this.registerExtensions([ext], `${ext}-view`);
                }
                catch (_b) {
                    console.log(craftLogMessage(this, `Extension '${ext}' is already registered`));
                    if (this.settings.overrideViewsFromOtherPlugins) {
                        console.log(craftLogMessage(this, `Attempting to override '${ext}'.`));
                        try {
                            // deregister the thing
                            this.app.viewRegistry.unregisterExtensions(exts);
                            // then register for myself
                            this.registerExtensions([ext], `${ext}-view`);
                        }
                        catch (_c) {
                            console.log(craftLogMessage(this, `Could not override '${ext}'; did not register!`));
                        }
                    }
                }
                // DEBUG
                console.log(craftLogMessage(this, `added=${ext}`));
            });
        };
        this.deregisterViewsForExtensions = (exts) => {
            // Only do work if there is work
            if (exts.length == 0) {
                return;
            }
            exts = this.removeConflictingExtensions(exts);
            exts.forEach((ext) => {
                // cspell:ignore Licat
                // Before unregistering the view: close active leaf if of type ext
                // Thank you Licat#1607: activeLeaf could be null here causing a crash => Replaced with getActiveViewOfType
                const view = this.app.workspace.getActiveViewOfType(PlainTextView);
                if (view) {
                    view.leaf.detach();
                }
                try {
                    this.app.viewRegistry.unregisterView(`${ext}-view`);
                }
                catch (_a) {
                    console.log(craftLogMessage(this, `View for extension '${ext}' cannot be deregistered...`));
                }
            });
            // Try to deregister the extensions
            try {
                this.app.viewRegistry.unregisterExtensions(exts);
            }
            catch (_a) {
                console.log(craftLogMessage(this, 'Cannot deregister extensions...'));
            }
            // DEBUG
            console.log(craftLogMessage(this, `removed=${exts}`));
        };
        this.createNewFile = (file) => __awaiter(this, void 0, void 0, function* () {
            console.log(craftLogMessage(this, 'Create new plaintext file'));
            new CreateNewPlainTextFileModal(this.app, 'plaintext file.txt', (res) => __awaiter(this, void 0, void 0, function* () {
                // Retrieve filename from user input
                const filename = normalizePath(`${file.path}/${res}`);
                // Create TFile from it
                let newFile = null;
                try {
                    newFile = yield this.app.vault.create(filename, '');
                }
                catch (_a) {
                    console.log(craftLogMessage(this, 'File already exists'));
                    return;
                }
                // Create a new leaf
                const newLeaf = this.app.workspace.getLeaf(true);
                // Set the type
                yield newLeaf.setViewState({ type: 'text/plain' });
                // Focus it
                yield newLeaf.openFile(newFile);
            })).open();
        });
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(craftLogMessage(this, 'loaded plugin'));
            // 1. Load Settings
            yield this.loadSettings();
            this.addSettingTab(new PlainTextSettingTab(this.app, this));
            // 2. Add commands; automatically cleaned up
            this.addCommand({
                id: 'new-plaintext-file',
                name: 'Create new plaintext file',
                callback: () => {
                    this.createNewFile(app.vault.getRoot());
                }
            });
            // 3. Add events; automatically cleaned up
            this.registerEvent(this.app.workspace.on('file-menu', (menu, file) => {
                // But not if clicked on folder
                if (!(file instanceof TFolder)) {
                    return;
                }
                menu.addItem((item) => {
                    item
                        .setTitle('New plaintext file')
                        .setIcon('file-plus')
                        .onClick(() => __awaiter(this, void 0, void 0, function* () { return this.createNewFile(file); }));
                });
            }));
            // 4. Other initialization
            this.registerViewsForExtensions(this.settings.extensions);
        });
    }
    onunload() {
        this.deregisterViewsForExtensions(this.settings.extensions);
        console.log(craftLogMessage(this, 'unloaded plugin'));
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQWlCLE9BQU8sRUFBaUIsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxlQUFlLEVBQUUsd0JBQXdCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDNUYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBcUIsTUFBTSxZQUFZLENBQUM7QUFDdEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUV2Qzs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFNLENBQUMsT0FBTyxPQUFPLGVBQWdCLFNBQVEsTUFBTTtJQUFuRDs7UUFvREUsZ0NBQTJCLEdBQUcsQ0FBQyxJQUFjLEVBQVksRUFBRTtZQUN6RCwrQ0FBK0M7WUFDL0MsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXRDLHlDQUF5QztZQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO2dCQUNqRCxvQ0FBb0M7Z0JBQ3BDLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNqRSxDQUFDO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7UUFFRixnQkFBVyxHQUFHLENBQUMsSUFBbUIsRUFBRSxFQUFFLENBQUMsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0QsK0JBQTBCLEdBQUcsQ0FBQyxJQUFjLEVBQVEsRUFBRTtZQUNwRCxJQUFJLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTlDLElBQUks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LGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQSxHQUFBLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FDSCxDQUFDO1lBRUYsMEJBQTBCO1lBQzFCLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVELENBQUM7S0FBQTtJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFSyxZQUFZOztZQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDN0UsQ0FBQztLQUFBO0lBRUssWUFBWTs7WUFDaEIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxDQUFDO0tBQUE7Q0FnSEYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbHVnaW4sIFRBYnN0cmFjdEZpbGUsIFRGb2xkZXIsIFdvcmtzcGFjZUxlYWYsIG5vcm1hbGl6ZVBhdGggfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IGNyYWZ0TG9nTWVzc2FnZSwgcmVtb3ZlT2JzaWRpYW5FeHRlbnNpb25zLCByZW1vdmVPdGhlckV4dGVuc2lvbnMgfSBmcm9tICcuL2hlbHBlcic7XHJcbmltcG9ydCB7IENyZWF0ZU5ld1BsYWluVGV4dEZpbGVNb2RhbCB9IGZyb20gJy4vbW9kYWwnO1xyXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBQbGFpblRleHRTZXR0aW5nVGFiLCBQbGFpblRleHRTZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnO1xyXG5pbXBvcnQgeyBQbGFpblRleHRWaWV3IH0gZnJvbSAnLi92aWV3JztcclxuXHJcbi8qKlxyXG4gKiBQbGFpblRleHQgcGx1Z2luLlxyXG4gKlxyXG4gKiBBbGxvd3MgeW91IHRvIGVkaXQgZmlsZXMgd2l0aCBzcGVjaWZpZWQgZXh0ZW5zaW9ucyBhcyBpZiB0aGV5IGFyZSBwbGFpbnRleHQgZmlsZXMuXHJcbiAqIFRoZXJlIGFyZSBhIGZldyBjaGVja3MgdG8gc2VlIHdoZXRoZXIgb3Igbm90IHlvdSBzaG91bGQgYWN0dWFsbHkgZG8gc286XHJcbiAqIDEuIERlZmF1bHQgb2JzaWRpYW4gZXh0ZW5zaW9ucyBhcmUgYXV0b21hdGljYWxseSBmaWx0ZXJlZCBvdXQuXHJcbiAqIDIuIEJ5IGRlZmF1bHQsIGV4dGVuc2lvbnMgdGhhdCBvdGhlciBwbHVnaW5zIHVzZSAoZS5nLiBjc3Ygb3IgZm91bnRhaW4pIGFyZSBmaWx0ZXJlZCBvdXQuXHJcbiAqICAgIFRoZXJlJ3MgYW4gb3B0aW9uIHRvIFwib3ZlcnJpZGVcIiB0aGUgdmlld3MgdGhhdCB0aG9zZSBvdGhlciBwbHVnaW5zIG1ha2VcclxuICogICAgaW4gY2FzZSB5b3UgcHJlZmVyIHRvIHVzZSB0aGUgUGxhaW5UZXh0Vmlldy5cclxuICpcclxuICogVGhlcmUgYXJlIE5PIGNoZWNrcyB0byBzZWUgaWYgdGhlIGZpbGUgeW91IHdpc2ggdG8gZWRpdCBpcyBhY3R1YWxseSBhIHBsYWludGV4dCBmaWxlLlxyXG4gKiBVc2UgY29tbW9uIHNlbnNlLCBhbmQgZG9uJ3QgZWRpdCBvYnZpb3VzbHkgbm9uLXBsYWludGV4dCBmaWxlcy5cclxuICpcclxuICogQGF1dGhvciBkYmFyZW5ob2x6XHJcbiAqIEB2ZXJzaW9uIDAuMy4wXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGFpblRleHRQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG4gIHB1YmxpYyBzZXR0aW5nczogUGxhaW5UZXh0U2V0dGluZ3M7XHJcblxyXG4gIGFzeW5jIG9ubG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnNvbGUubG9nKGNyYWZ0TG9nTWVzc2FnZSh0aGlzLCAnbG9hZGVkIHBsdWdpbicpKTtcclxuXHJcbiAgICAvLyAxLiBMb2FkIFNldHRpbmdzXHJcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBQbGFpblRleHRTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblxyXG4gICAgLy8gMi4gQWRkIGNvbW1hbmRzOyBhdXRvbWF0aWNhbGx5IGNsZWFuZWQgdXBcclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiAnbmV3LXBsYWludGV4dC1maWxlJyxcclxuICAgICAgbmFtZTogJ0NyZWF0ZSBuZXcgcGxhaW50ZXh0IGZpbGUnLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlTmV3RmlsZShhcHAudmF1bHQuZ2V0Um9vdCgpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gMy4gQWRkIGV2ZW50czsgYXV0b21hdGljYWxseSBjbGVhbmVkIHVwXHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXHJcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbignZmlsZS1tZW51JywgKG1lbnUsIGZpbGUpID0+IHtcclxuICAgICAgICAvLyBCdXQgbm90IGlmIGNsaWNrZWQgb24gZm9sZGVyXHJcbiAgICAgICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaXRlbVxyXG4gICAgICAgICAgICAuc2V0VGl0bGUoJ05ldyBwbGFpbnRleHQgZmlsZScpXHJcbiAgICAgICAgICAgIC5zZXRJY29uKCdmaWxlLXBsdXMnKVxyXG4gICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB0aGlzLmNyZWF0ZU5ld0ZpbGUoZmlsZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyA0LiBPdGhlciBpbml0aWFsaXphdGlvblxyXG4gICAgdGhpcy5yZWdpc3RlclZpZXdzRm9yRXh0ZW5zaW9ucyh0aGlzLnNldHRpbmdzLmV4dGVuc2lvbnMpO1xyXG4gIH1cclxuXHJcbiAgb251bmxvYWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmRlcmVnaXN0ZXJWaWV3c0ZvckV4dGVuc2lvbnModGhpcy5zZXR0aW5ncy5leHRlbnNpb25zKTtcclxuICAgIGNvbnNvbGUubG9nKGNyYWZ0TG9nTWVzc2FnZSh0aGlzLCAndW5sb2FkZWQgcGx1Z2luJykpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzYXZlU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlQ29uZmxpY3RpbmdFeHRlbnNpb25zID0gKGV4dHM6IHN0cmluZ1tdKTogc3RyaW5nW10gPT4ge1xyXG4gICAgLy8gUmVtb3ZlIGRlZmF1bHQgT2JzaWRpYW4gZXh0ZW5zaW9ucyBmcm9tIGxpc3RcclxuICAgIGV4dHMgPSByZW1vdmVPYnNpZGlhbkV4dGVuc2lvbnMoZXh0cyk7XHJcblxyXG4gICAgLy8gSWYgd2UgYXJlIG5vdCBkZXN0cm95aW5nIG90aGVyIHBsdWdpbnNcclxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5vdmVycmlkZVZpZXdzRnJvbU90aGVyUGx1Z2lucykge1xyXG4gICAgICAvLyBUaGVuIGFsc28gcmVtb3ZlIHRob3NlIGV4dGVuc2lvbnNcclxuICAgICAgZXh0cyA9IHJlbW92ZU90aGVyRXh0ZW5zaW9ucyhleHRzLCBhcHAucGx1Z2lucy5lbmFibGVkUGx1Z2lucyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXh0cztcclxuICB9O1xyXG5cclxuICB2aWV3Q3JlYXRvciA9IChsZWFmOiBXb3Jrc3BhY2VMZWFmKSA9PiBuZXcgUGxhaW5UZXh0VmlldyhsZWFmKTtcclxuXHJcbiAgcmVnaXN0ZXJWaWV3c0ZvckV4dGVuc2lvbnMgPSAoZXh0czogc3RyaW5nW10pOiB2b2lkID0+IHtcclxuICAgIGV4dHMgPSB0aGlzLnJlbW92ZUNvbmZsaWN0aW5nRXh0ZW5zaW9ucyhleHRzKTtcclxuXHJcbiAgICBleHRzLmZvckVhY2goKGV4dCkgPT4ge1xyXG4gICAgICAvLyBUcnkgdG8gcmVnaXN0ZXIgdmlld1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJWaWV3KGAke2V4dH0tdmlld2AsIHRoaXMudmlld0NyZWF0b3IpO1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhjcmFmdExvZ01lc3NhZ2UodGhpcywgYEV4dGVuc2lvbiAnJHtleHR9JyBhbHJlYWR5IGhhcyBhIHZpZXcgcmVnaXN0ZXJlZCwgaWdub3JpbmcuLi5gKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRyeSB0byByZWdpc3RlciBleHRlbnNpb25cclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXh0ZW5zaW9ucyhbZXh0XSwgYCR7ZXh0fS12aWV3YCk7XHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNyYWZ0TG9nTWVzc2FnZSh0aGlzLCBgRXh0ZW5zaW9uICcke2V4dH0nIGlzIGFscmVhZHkgcmVnaXN0ZXJlZGApKTtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5vdmVycmlkZVZpZXdzRnJvbU90aGVyUGx1Z2lucykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coY3JhZnRMb2dNZXNzYWdlKHRoaXMsIGBBdHRlbXB0aW5nIHRvIG92ZXJyaWRlICcke2V4dH0nLmApKTtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIGRlcmVnaXN0ZXIgdGhlIHRoaW5nXHJcbiAgICAgICAgICAgIHRoaXMuYXBwLnZpZXdSZWdpc3RyeS51bnJlZ2lzdGVyRXh0ZW5zaW9ucyhleHRzKTtcclxuICAgICAgICAgICAgLy8gdGhlbiByZWdpc3RlciBmb3IgbXlzZWxmXHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFeHRlbnNpb25zKFtleHRdLCBgJHtleHR9LXZpZXdgKTtcclxuICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjcmFmdExvZ01lc3NhZ2UodGhpcywgYENvdWxkIG5vdCBvdmVycmlkZSAnJHtleHR9JzsgZGlkIG5vdCByZWdpc3RlciFgKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBERUJVR1xyXG4gICAgICBjb25zb2xlLmxvZyhjcmFmdExvZ01lc3NhZ2UodGhpcywgYGFkZGVkPSR7ZXh0fWApKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGRlcmVnaXN0ZXJWaWV3c0ZvckV4dGVuc2lvbnMgPSAoZXh0czogc3RyaW5nW10pOiB2b2lkID0+IHtcclxuICAgIC8vIE9ubHkgZG8gd29yayBpZiB0aGVyZSBpcyB3b3JrXHJcbiAgICBpZiAoZXh0cy5sZW5ndGggPT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZXh0cyA9IHRoaXMucmVtb3ZlQ29uZmxpY3RpbmdFeHRlbnNpb25zKGV4dHMpO1xyXG5cclxuICAgIGV4dHMuZm9yRWFjaCgoZXh0KSA9PiB7XHJcbiAgICAgIC8vIGNzcGVsbDppZ25vcmUgTGljYXRcclxuICAgICAgLy8gQmVmb3JlIHVucmVnaXN0ZXJpbmcgdGhlIHZpZXc6IGNsb3NlIGFjdGl2ZSBsZWFmIGlmIG9mIHR5cGUgZXh0XHJcbiAgICAgIC8vIFRoYW5rIHlvdSBMaWNhdCMxNjA3OiBhY3RpdmVMZWFmIGNvdWxkIGJlIG51bGwgaGVyZSBjYXVzaW5nIGEgY3Jhc2ggPT4gUmVwbGFjZWQgd2l0aCBnZXRBY3RpdmVWaWV3T2ZUeXBlXHJcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShQbGFpblRleHRWaWV3KTtcclxuICAgICAgaWYgKHZpZXcpIHtcclxuICAgICAgICB2aWV3LmxlYWYuZGV0YWNoKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5hcHAudmlld1JlZ2lzdHJ5LnVucmVnaXN0ZXJWaWV3KGAke2V4dH0tdmlld2ApO1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhjcmFmdExvZ01lc3NhZ2UodGhpcywgYFZpZXcgZm9yIGV4dGVuc2lvbiAnJHtleHR9JyBjYW5ub3QgYmUgZGVyZWdpc3RlcmVkLi4uYCkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBUcnkgdG8gZGVyZWdpc3RlciB0aGUgZXh0ZW5zaW9uc1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5hcHAudmlld1JlZ2lzdHJ5LnVucmVnaXN0ZXJFeHRlbnNpb25zKGV4dHMpO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGNyYWZ0TG9nTWVzc2FnZSh0aGlzLCAnQ2Fubm90IGRlcmVnaXN0ZXIgZXh0ZW5zaW9ucy4uLicpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBERUJVR1xyXG4gICAgY29uc29sZS5sb2coY3JhZnRMb2dNZXNzYWdlKHRoaXMsIGByZW1vdmVkPSR7ZXh0c31gKSk7XHJcbiAgfTtcclxuXHJcbiAgY3JlYXRlTmV3RmlsZSA9IGFzeW5jIChmaWxlOiBUQWJzdHJhY3RGaWxlKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhjcmFmdExvZ01lc3NhZ2UodGhpcywgJ0NyZWF0ZSBuZXcgcGxhaW50ZXh0IGZpbGUnKSk7XHJcblxyXG4gICAgbmV3IENyZWF0ZU5ld1BsYWluVGV4dEZpbGVNb2RhbCh0aGlzLmFwcCwgJ3BsYWludGV4dCBmaWxlLnR4dCcsIGFzeW5jIChyZXMpID0+IHtcclxuICAgICAgLy8gUmV0cmlldmUgZmlsZW5hbWUgZnJvbSB1c2VyIGlucHV0XHJcbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gbm9ybWFsaXplUGF0aChgJHtmaWxlLnBhdGh9LyR7cmVzfWApO1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIFRGaWxlIGZyb20gaXRcclxuICAgICAgbGV0IG5ld0ZpbGUgPSBudWxsO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBuZXdGaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKGZpbGVuYW1lLCAnJyk7XHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNyYWZ0TG9nTWVzc2FnZSh0aGlzLCAnRmlsZSBhbHJlYWR5IGV4aXN0cycpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBsZWFmXHJcbiAgICAgIGNvbnN0IG5ld0xlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcclxuXHJcbiAgICAgIC8vIFNldCB0aGUgdHlwZVxyXG4gICAgICBhd2FpdCBuZXdMZWFmLnNldFZpZXdTdGF0ZSh7IHR5cGU6ICd0ZXh0L3BsYWluJyB9KTtcclxuXHJcbiAgICAgIC8vIEZvY3VzIGl0XHJcbiAgICAgIGF3YWl0IG5ld0xlYWYub3BlbkZpbGUobmV3RmlsZSk7XHJcbiAgICB9KS5vcGVuKCk7XHJcbiAgfTtcclxufVxyXG4iXX0=