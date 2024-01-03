import { Modal, Setting } from 'obsidian';
/**
 * Modal to create a new PlainText file.
 *
 * Code from here: https://github.com/GamerGirlandCo/obsidian-fountain-revived/blob/main/src/createModal.ts
 * Changes made according to https://marcus.se.net/obsidian-plugin-docs/examples/insert-link
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export class CreateNewPlainTextFileModal extends Modal {
    constructor(app, defaultFilename, onSubmit) {
        super(app);
        this.filename = defaultFilename;
        this.onSubmit = onSubmit;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: 'New PlainText File' });
        new Setting(contentEl).setName('File Name (include extension!)').addText((text) => text.setValue(this.filename).onChange((value) => {
            this.filename = value;
        }));
        new Setting(contentEl).addButton((btn) => btn
            .setButtonText('Create')
            .setCta()
            .onClick(() => this.createFile(this.filename)));
        contentEl.createEl('span', {
            text: 'If you used the file browser, then the file will be created in the selected folder. If you used the command, it will be created in the main vault folder.'
        });
        // Listen to keyboard events
        contentEl.onkeydown = (e) => {
            if (e.key === 'Enter')
                this.createFile(this.filename);
            if (e.key === 'Escape')
                this.close();
        };
    }
    createFile(filename) {
        this.onSubmit(filename);
        this.close();
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb2RhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQU8sS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUvQzs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sT0FBTywyQkFBNEIsU0FBUSxLQUFLO0lBSXBELFlBQVksR0FBUSxFQUFFLGVBQXVCLEVBQUUsUUFBMkM7UUFDeEYsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzNCLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUN6RCxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUNoRixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUM5QyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FDSCxDQUFDO1FBQ0YsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FDdkMsR0FBRzthQUNBLGFBQWEsQ0FBQyxRQUFRLENBQUM7YUFDdkIsTUFBTSxFQUFFO2FBQ1IsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQ2pELENBQUM7UUFDRixTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUN6QixJQUFJLEVBQUUsMkpBQTJKO1NBQ2xLLENBQUMsQ0FBQztRQUVILDRCQUE0QjtRQUM1QixTQUFTLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBZ0IsRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxPQUFPO2dCQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxRQUFRO2dCQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsVUFBVSxDQUFDLFFBQWdCO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELE9BQU87UUFDTCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzNCLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNwQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIE1vZGFsLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG4vKipcbiAqIE1vZGFsIHRvIGNyZWF0ZSBhIG5ldyBQbGFpblRleHQgZmlsZS5cbiAqXG4gKiBDb2RlIGZyb20gaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL0dhbWVyR2lybGFuZENvL29ic2lkaWFuLWZvdW50YWluLXJldml2ZWQvYmxvYi9tYWluL3NyYy9jcmVhdGVNb2RhbC50c1xuICogQ2hhbmdlcyBtYWRlIGFjY29yZGluZyB0byBodHRwczovL21hcmN1cy5zZS5uZXQvb2JzaWRpYW4tcGx1Z2luLWRvY3MvZXhhbXBsZXMvaW5zZXJ0LWxpbmtcbiAqXG4gKiBAdmVyc2lvbiAwLjMuMFxuICogQGF1dGhvciBkYmFyZW5ob2x6XG4gKi9cbmV4cG9ydCBjbGFzcyBDcmVhdGVOZXdQbGFpblRleHRGaWxlTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIG9uU3VibWl0OiAoZmlsZW5hbWU6IHN0cmluZykgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgZGVmYXVsdEZpbGVuYW1lOiBzdHJpbmcsIG9uU3VibWl0OiAocmVzdWx0OiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgICBzdXBlcihhcHApO1xuICAgIHRoaXMuZmlsZW5hbWUgPSBkZWZhdWx0RmlsZW5hbWU7XG4gICAgdGhpcy5vblN1Ym1pdCA9IG9uU3VibWl0O1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdOZXcgUGxhaW5UZXh0IEZpbGUnIH0pO1xuICAgIG5ldyBTZXR0aW5nKGNvbnRlbnRFbCkuc2V0TmFtZSgnRmlsZSBOYW1lIChpbmNsdWRlIGV4dGVuc2lvbiEpJykuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgIHRleHQuc2V0VmFsdWUodGhpcy5maWxlbmFtZSkub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZmlsZW5hbWUgPSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICBuZXcgU2V0dGluZyhjb250ZW50RWwpLmFkZEJ1dHRvbigoYnRuKSA9PlxuICAgICAgYnRuXG4gICAgICAgIC5zZXRCdXR0b25UZXh0KCdDcmVhdGUnKVxuICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdGhpcy5jcmVhdGVGaWxlKHRoaXMuZmlsZW5hbWUpKVxuICAgICk7XG4gICAgY29udGVudEVsLmNyZWF0ZUVsKCdzcGFuJywge1xuICAgICAgdGV4dDogJ0lmIHlvdSB1c2VkIHRoZSBmaWxlIGJyb3dzZXIsIHRoZW4gdGhlIGZpbGUgd2lsbCBiZSBjcmVhdGVkIGluIHRoZSBzZWxlY3RlZCBmb2xkZXIuIElmIHlvdSB1c2VkIHRoZSBjb21tYW5kLCBpdCB3aWxsIGJlIGNyZWF0ZWQgaW4gdGhlIG1haW4gdmF1bHQgZm9sZGVyLidcbiAgICB9KTtcblxuICAgIC8vIExpc3RlbiB0byBrZXlib2FyZCBldmVudHNcbiAgICBjb250ZW50RWwub25rZXlkb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgdGhpcy5jcmVhdGVGaWxlKHRoaXMuZmlsZW5hbWUpO1xuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgdGhpcy5jbG9zZSgpO1xuICAgIH07XG4gIH1cblxuICBjcmVhdGVGaWxlKGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLm9uU3VibWl0KGZpbGVuYW1lKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBvbkNsb3NlKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuICB9XG59XG4iXX0=