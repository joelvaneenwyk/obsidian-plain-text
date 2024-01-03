import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { TextFileView } from 'obsidian';
import { basicExtensions, languageExtension } from './codemirror';
/**
 * The plaintext view shows a plaintext file, hence it extends the text file view.
 * Rewritten to use CM6.
 *
 * Code from here: https://github.com/Zachatoo/obsidian-css-editor/blob/main/src/CssEditorView.ts
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export class PlainTextView extends TextFileView {
    constructor(leaf) {
        super(leaf);
        this.editorState = EditorState.create({
            extensions: [
                basicExtensions,
                // TODO: Figure out how to nicely set language modes.
                languageExtension,
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        this.save(false);
                    }
                })
            ]
        });
        this.editorView = new EditorView({
            state: this.editorState,
            parent: this.contentEl
        });
    }
    /**
     * Gets the type of this view.
     * We use `extension-view`, where extension is the file extension.
     * This is also used in main.ts, where the view types are registered and deregistered.
     *
     * @returns The view-type constructed from the file extension if it exists, otherwise "text/plain".
     */
    getViewType() {
        return this.file ? `${this.file.extension}-view` : 'text/plain';
    }
    /**
     * A string identifier of the Lucide icon that is shown in the tab of this view.
     * We use "file-code".
     *
     * @returns The string "file-code".
     */
    getIcon() {
        return 'file-code';
    }
    /**
     * Gets the text to display in the header of the tab.
     * This is the filename if it exists.
     *
     * @returns The filename if it exists, otherwise "(no file)".
     */
    getDisplayText() {
        return this.file ? this.file.basename : '(no file)';
    }
    /**
     * Grabs data from the editor.
     * This essentially implements the getViewData method.
     *
     * @returns Content in the editor.
     */
    getEditorData() {
        return this.editorView.state.doc.toString();
    }
    /**
     * Method that dispatches editor data.
     * This essentially implements the setViewData method.
     *
     * @param data Content to set in the view.
     */
    dispatchEditorData(data) {
        this.editorView.dispatch({
            changes: {
                from: 0,
                to: this.editorView.state.doc.length,
                insert: data
            }
        });
    }
    /**
     * Gets the data from the editor.
     * This will be called to save the editor contents to the file.
     *
     * @returns A string representing the content of the editor.
     */
    getViewData() {
        return this.getEditorData();
    }
    /**
     * Set the data to the editor.
     * This is used to load the file contents.
     *
     * If clear is set, then it means we're opening a completely different file.
     * In that case, you should call clear(), or implement a slightly more efficient
     * clearing mechanism given the new data to be set.
     *
     * @param data data to load
     * @param clear whether or not to clear the editor
     */
    setViewData(data, clear) {
        if (clear) {
            // Note: this.clear() destroys the editor completely - this is inaccurate
            // as we only want to change the editor data.
            this.dispatchEditorData('');
        }
        this.dispatchEditorData(data);
    }
    /**
     * Clear the editor.
     *
     * This is called when we're about to open a completely different file,
     * so it's best to clear any editor states like undo-redo history,
     * and any caches/indexes associated with the previous file contents.
     */
    clear() {
        this.editorView.destroy();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQVMsWUFBWSxFQUFpQixNQUFNLFVBQVUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRWxFOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxPQUFPLGFBQWMsU0FBUSxZQUFZO0lBSzdDLFlBQVksSUFBbUI7UUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRVosSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1lBQ3BDLFVBQVUsRUFBRTtnQkFDVixlQUFlO2dCQUNmLHFEQUFxRDtnQkFDckQsaUJBQWlCO2dCQUNqQixVQUFVLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUN0QyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkIsQ0FBQztnQkFDSCxDQUFDLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUM7WUFDL0IsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUztTQUN2QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDbEUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsT0FBTztRQUNMLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGtCQUFrQixDQUFDLElBQVk7UUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDdkIsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxDQUFDO2dCQUNQLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTTtnQkFDcEMsTUFBTSxFQUFFLElBQUk7YUFDYjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILFdBQVcsQ0FBQyxJQUFZLEVBQUUsS0FBYztRQUN0QyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1YseUVBQXlFO1lBQ3pFLDZDQUE2QztZQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsS0FBSztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDNUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdG9yU3RhdGUgfSBmcm9tICdAY29kZW1pcnJvci9zdGF0ZSc7XG5pbXBvcnQgeyBFZGl0b3JWaWV3IH0gZnJvbSAnQGNvZGVtaXJyb3Ivdmlldyc7XG5pbXBvcnQgeyBURmlsZSwgVGV4dEZpbGVWaWV3LCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgYmFzaWNFeHRlbnNpb25zLCBsYW5ndWFnZUV4dGVuc2lvbiB9IGZyb20gJy4vY29kZW1pcnJvcic7XG5cbi8qKlxuICogVGhlIHBsYWludGV4dCB2aWV3IHNob3dzIGEgcGxhaW50ZXh0IGZpbGUsIGhlbmNlIGl0IGV4dGVuZHMgdGhlIHRleHQgZmlsZSB2aWV3LlxuICogUmV3cml0dGVuIHRvIHVzZSBDTTYuXG4gKlxuICogQ29kZSBmcm9tIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9aYWNoYXRvby9vYnNpZGlhbi1jc3MtZWRpdG9yL2Jsb2IvbWFpbi9zcmMvQ3NzRWRpdG9yVmlldy50c1xuICpcbiAqIEB2ZXJzaW9uIDAuMy4wXG4gKiBAYXV0aG9yIGRiYXJlbmhvbHpcbiAqL1xuZXhwb3J0IGNsYXNzIFBsYWluVGV4dFZpZXcgZXh0ZW5kcyBUZXh0RmlsZVZpZXcge1xuICBwcml2YXRlIGVkaXRvclZpZXc6IEVkaXRvclZpZXc7XG4gIHByaXZhdGUgZWRpdG9yU3RhdGU6IEVkaXRvclN0YXRlO1xuICBmaWxlOiBURmlsZTtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmKSB7XG4gICAgc3VwZXIobGVhZik7XG5cbiAgICB0aGlzLmVkaXRvclN0YXRlID0gRWRpdG9yU3RhdGUuY3JlYXRlKHtcbiAgICAgIGV4dGVuc2lvbnM6IFtcbiAgICAgICAgYmFzaWNFeHRlbnNpb25zLFxuICAgICAgICAvLyBUT0RPOiBGaWd1cmUgb3V0IGhvdyB0byBuaWNlbHkgc2V0IGxhbmd1YWdlIG1vZGVzLlxuICAgICAgICBsYW5ndWFnZUV4dGVuc2lvbixcbiAgICAgICAgRWRpdG9yVmlldy51cGRhdGVMaXN0ZW5lci5vZigodXBkYXRlKSA9PiB7XG4gICAgICAgICAgaWYgKHVwZGF0ZS5kb2NDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmUoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHRoaXMuZWRpdG9yVmlldyA9IG5ldyBFZGl0b3JWaWV3KHtcbiAgICAgIHN0YXRlOiB0aGlzLmVkaXRvclN0YXRlLFxuICAgICAgcGFyZW50OiB0aGlzLmNvbnRlbnRFbFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHR5cGUgb2YgdGhpcyB2aWV3LlxuICAgKiBXZSB1c2UgYGV4dGVuc2lvbi12aWV3YCwgd2hlcmUgZXh0ZW5zaW9uIGlzIHRoZSBmaWxlIGV4dGVuc2lvbi5cbiAgICogVGhpcyBpcyBhbHNvIHVzZWQgaW4gbWFpbi50cywgd2hlcmUgdGhlIHZpZXcgdHlwZXMgYXJlIHJlZ2lzdGVyZWQgYW5kIGRlcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIHZpZXctdHlwZSBjb25zdHJ1Y3RlZCBmcm9tIHRoZSBmaWxlIGV4dGVuc2lvbiBpZiBpdCBleGlzdHMsIG90aGVyd2lzZSBcInRleHQvcGxhaW5cIi5cbiAgICovXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZSA/IGAke3RoaXMuZmlsZS5leHRlbnNpb259LXZpZXdgIDogJ3RleHQvcGxhaW4nO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIGlkZW50aWZpZXIgb2YgdGhlIEx1Y2lkZSBpY29uIHRoYXQgaXMgc2hvd24gaW4gdGhlIHRhYiBvZiB0aGlzIHZpZXcuXG4gICAqIFdlIHVzZSBcImZpbGUtY29kZVwiLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgc3RyaW5nIFwiZmlsZS1jb2RlXCIuXG4gICAqL1xuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdmaWxlLWNvZGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRleHQgdG8gZGlzcGxheSBpbiB0aGUgaGVhZGVyIG9mIHRoZSB0YWIuXG4gICAqIFRoaXMgaXMgdGhlIGZpbGVuYW1lIGlmIGl0IGV4aXN0cy5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGZpbGVuYW1lIGlmIGl0IGV4aXN0cywgb3RoZXJ3aXNlIFwiKG5vIGZpbGUpXCIuXG4gICAqL1xuICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmZpbGUgPyB0aGlzLmZpbGUuYmFzZW5hbWUgOiAnKG5vIGZpbGUpJztcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFicyBkYXRhIGZyb20gdGhlIGVkaXRvci5cbiAgICogVGhpcyBlc3NlbnRpYWxseSBpbXBsZW1lbnRzIHRoZSBnZXRWaWV3RGF0YSBtZXRob2QuXG4gICAqXG4gICAqIEByZXR1cm5zIENvbnRlbnQgaW4gdGhlIGVkaXRvci5cbiAgICovXG4gIGdldEVkaXRvckRhdGEoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JWaWV3LnN0YXRlLmRvYy50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB0aGF0IGRpc3BhdGNoZXMgZWRpdG9yIGRhdGEuXG4gICAqIFRoaXMgZXNzZW50aWFsbHkgaW1wbGVtZW50cyB0aGUgc2V0Vmlld0RhdGEgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSBDb250ZW50IHRvIHNldCBpbiB0aGUgdmlldy5cbiAgICovXG4gIGRpc3BhdGNoRWRpdG9yRGF0YShkYXRhOiBzdHJpbmcpIHtcbiAgICB0aGlzLmVkaXRvclZpZXcuZGlzcGF0Y2goe1xuICAgICAgY2hhbmdlczoge1xuICAgICAgICBmcm9tOiAwLFxuICAgICAgICB0bzogdGhpcy5lZGl0b3JWaWV3LnN0YXRlLmRvYy5sZW5ndGgsXG4gICAgICAgIGluc2VydDogZGF0YVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRhdGEgZnJvbSB0aGUgZWRpdG9yLlxuICAgKiBUaGlzIHdpbGwgYmUgY2FsbGVkIHRvIHNhdmUgdGhlIGVkaXRvciBjb250ZW50cyB0byB0aGUgZmlsZS5cbiAgICpcbiAgICogQHJldHVybnMgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IuXG4gICAqL1xuICBnZXRWaWV3RGF0YSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldEVkaXRvckRhdGEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGRhdGEgdG8gdGhlIGVkaXRvci5cbiAgICogVGhpcyBpcyB1c2VkIHRvIGxvYWQgdGhlIGZpbGUgY29udGVudHMuXG4gICAqXG4gICAqIElmIGNsZWFyIGlzIHNldCwgdGhlbiBpdCBtZWFucyB3ZSdyZSBvcGVuaW5nIGEgY29tcGxldGVseSBkaWZmZXJlbnQgZmlsZS5cbiAgICogSW4gdGhhdCBjYXNlLCB5b3Ugc2hvdWxkIGNhbGwgY2xlYXIoKSwgb3IgaW1wbGVtZW50IGEgc2xpZ2h0bHkgbW9yZSBlZmZpY2llbnRcbiAgICogY2xlYXJpbmcgbWVjaGFuaXNtIGdpdmVuIHRoZSBuZXcgZGF0YSB0byBiZSBzZXQuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIGRhdGEgdG8gbG9hZFxuICAgKiBAcGFyYW0gY2xlYXIgd2hldGhlciBvciBub3QgdG8gY2xlYXIgdGhlIGVkaXRvclxuICAgKi9cbiAgc2V0Vmlld0RhdGEoZGF0YTogc3RyaW5nLCBjbGVhcjogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChjbGVhcikge1xuICAgICAgLy8gTm90ZTogdGhpcy5jbGVhcigpIGRlc3Ryb3lzIHRoZSBlZGl0b3IgY29tcGxldGVseSAtIHRoaXMgaXMgaW5hY2N1cmF0ZVxuICAgICAgLy8gYXMgd2Ugb25seSB3YW50IHRvIGNoYW5nZSB0aGUgZWRpdG9yIGRhdGEuXG4gICAgICB0aGlzLmRpc3BhdGNoRWRpdG9yRGF0YSgnJyk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwYXRjaEVkaXRvckRhdGEoZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIGVkaXRvci5cbiAgICpcbiAgICogVGhpcyBpcyBjYWxsZWQgd2hlbiB3ZSdyZSBhYm91dCB0byBvcGVuIGEgY29tcGxldGVseSBkaWZmZXJlbnQgZmlsZSxcbiAgICogc28gaXQncyBiZXN0IHRvIGNsZWFyIGFueSBlZGl0b3Igc3RhdGVzIGxpa2UgdW5kby1yZWRvIGhpc3RvcnksXG4gICAqIGFuZCBhbnkgY2FjaGVzL2luZGV4ZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBwcmV2aW91cyBmaWxlIGNvbnRlbnRzLlxuICAgKi9cbiAgY2xlYXIoKTogdm9pZCB7XG4gICAgdGhpcy5lZGl0b3JWaWV3LmRlc3Ryb3koKTtcbiAgfVxufVxuIl19