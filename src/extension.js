/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
'use strict';

const { GObject, St, Gio, Clutter, Meta, Shell } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const Widgets = Me.imports.widgets;

const DashBoardModal = GObject.registerClass(
class DashBoardModal extends imports.ui.modalDialog.ModalDialog{
    _init(settings){
        super._init({
            destroyOnClose: false
        });
        this.settings = settings;
        
        let closeBtn = this.addButton({
            action: () => this.close(),
            label: 'x',
            key: Clutter.KEY_Escape,
        });
        closeBtn.hide();
        let monitor = Main.layoutManager.primaryMonitor;
        this.dialogLayout.height = monitor.height;
        this.dialogLayout.width = monitor.width;
        this.dialogLayout.connect('button-press-event', () => this.close() );

        this.contentLayout.add_style_class_name('db-dashboard-content');
        this.dialogLayout._dialog.add_style_class_name('db-dashboard');

        this._buildUI();
    }
    open(){
        super.open();
        this.appBox.reload();
        this.levelsBox.startTimeout();
    }
    close(){
        super.close();
        this.levelsBox.stopTimeout();
    }
    _buildUI(){
        this.mainBox = new St.BoxLayout({ style_class: 'db-container' });
        this.contentLayout.add_child(this.mainBox);

        let layout = this.settings.get_int('dash-layout');
        switch (layout) {
            case 1:
                this._layout1(); break;
            case 2:
                this._layout2(); break;
            case 3:
                this._layout3(); break;
            default:
                this._layout1(); break;
        }
    }
    _layout1(){
        this.userBox = new Widgets.UserBox(true);
        this.levelsBox = new Widgets.LevelsBox(false);
        this.mediaBox = new Widgets.MediaBox(false, 150);
        this.linksBox = new Widgets.LinksBox(false, this.settings);
        this.clockBox = new Widgets.ClockBox(false);
        this.appBox = new Widgets.AppBox(3,3);
        this.sysBox = new Widgets.SysBox(false, 32);
        this.sysActionsBox = new Widgets.SysActionsBox(0, 32);

        this.mainBox.vertical = true;

        this.userBox.x_expand = false;
        this.linksBox.y_expand = false;
        this.clockBox.width = 280;

        let row1 = new St.BoxLayout({ style_class: 'db-container' });
        let row2 = new St.BoxLayout({ style_class: 'db-container' });
        let row3 = new St.BoxLayout({ style_class: 'db-container' });
        let vbox = new St.BoxLayout({ style_class: 'db-container', vertical: true });

        row1.add_child(this.clockBox);
        row1.add_child(this.sysBox);
        row1.add_child(this.sysActionsBox);

        vbox.add_child(this.mediaBox);
        vbox.add_child(this.linksBox);
        row2.add_child(vbox);
        row2.add_child(this.appBox);

        row3.add_child(this.userBox);
        row3.add_child(this.levelsBox);

        this.mainBox.add_child(row1);
        this.mainBox.add_child(row2);
        this.mainBox.add_child(row3);
    }
    _layout2(){
        this.userBox = new Widgets.UserBox(false, 80);
        this.levelsBox = new Widgets.LevelsBox(true);
        this.mediaBox = new Widgets.MediaBox(false, 200);
        this.linksBox = new Widgets.LinksBox(false, this.settings);
        this.clockBox = new Widgets.ClockBox(false);
        this.appBox = new Widgets.AppBox(2,3);
        this.sysBox = new Widgets.SysBox(false, 34);
        this.sysActionsBox = new Widgets.SysActionsBox(2, 50);

        this.userBox.y_expand = false;
        this.linksBox.y_expand = false;
        this.clockBox.width = 250;

        let col1 = new St.BoxLayout({ style_class: 'db-container', vertical: true });
        let col2 = new St.BoxLayout({ style_class: 'db-container', vertical: true });
        let col3 = new St.BoxLayout({ style_class: 'db-container', vertical: true });
        let hbox1 = new St.BoxLayout({ style_class: 'db-container' });

        col1.add_child(this.userBox);
        col1.add_child(this.levelsBox);

        hbox1.add_child(this.clockBox);
        hbox1.add_child(this.sysBox);
        col2.add_child(hbox1);
        col2.add_child(this.mediaBox);
        col2.add_child(this.linksBox);

        col3.add_child(this.sysActionsBox);
        col3.add_child(this.appBox);

        this.mainBox.add_child(col1);
        this.mainBox.add_child(col2);
        this.mainBox.add_child(col3);
    }
    _layout3(){
        this.userBox = new Widgets.UserBox(false, 80);
        this.levelsBox = new Widgets.LevelsBox(true);
        this.mediaBox = new Widgets.MediaBox(true, 160);
        this.linksBox = new Widgets.LinksBox(false, this.settings);
        this.clockBox = new Widgets.ClockBox(false);
        this.appBox = new Widgets.AppBox(3,3);
        this.sysBox = new Widgets.SysBox(true, 40);
        this.sysActionsBox = new Widgets.SysActionsBox(1, 58);

        this.mediaBox.width = 300;
        this.clockBox.clock.y_expand = false;
        this.clockBox.date.y_expand = false;
        this.clockBox.day.y_expand = false;

        let col1 = new St.BoxLayout({ style_class: 'db-container', vertical: true });
        let col2 = new St.BoxLayout({ style_class: 'db-container', vertical: true });
        let hbox1 = new St.BoxLayout({ style_class: 'db-container' });
        let hbox2 = new St.BoxLayout({ style_class: 'db-container' });
        let vbox1 = new St.BoxLayout({ style_class: 'db-container', vertical: true });

        col1.add_child(this.clockBox);
        col1.add_child(this.mediaBox);

        hbox1.add_child(this.appBox);
        hbox1.add_child(this.sysBox);

        vbox1.add_child(this.userBox);
        vbox1.add_child(hbox1);

        hbox2.add_child(vbox1);
        hbox2.add_child(this.levelsBox);
        hbox2.add_child(this.sysActionsBox);

        col2.add_child(hbox2);
        col2.add_child(this.linksBox);

        this.mainBox.add_child(col1);
        this.mainBox.add_child(col2);
    }
});

const DashBoardPanelButton = GObject.registerClass(
class DashBoardPanelButton extends St.Button{
    _init(settings){
        super._init({ style_class: 'panel-button' });
        let box = new St.BoxLayout()
        this.set_child(box);

        this.settings = settings;

        this.visible = !this.settings.get_boolean('hide-panel-button');
        this.settings.connect('changed::hide-panel-button', 
            () => this.visible = !this.settings.get_boolean('hide-panel-button'));
        
        //ICON
        this.buttonIcon = new St.Icon({
            gicon: Gio.icon_new_for_string(
                this.settings.get_string('panel-button-icon-path')
            ),
            style_class: 'system-status-icon',
        });
        this.settings.connect('changed::panel-button-icon-path',
            () => this.buttonIcon.set_gicon(
                Gio.icon_new_for_string(
                    this.settings.get_string('panel-button-icon-path')
                )
            )
        );
        this.buttonIcon.visible = !this.settings.get_boolean('panel-button-icon-hide')
        this.settings.connect('changed::panel-button-icon-hide', 
            () => this.buttonIcon.visible = !this.settings.get_boolean('panel-button-icon-hide'));
        
        //LABEL
        this.buttonLabel = new St.Label({
            y_align: Clutter.ActorAlign.CENTER,
            text: this.settings.get_string('panel-button-label'),
        });
        this.settings.bind(
            'panel-button-label',
            this.buttonLabel,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );
        box.add_child(this.buttonIcon);
        box.add_child(this.buttonLabel);

        //SHORTCUT
        this.connect('clicked', () => this.openDash());
        Main.wm.addKeybinding('dash-board-shortcut', this.settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.ALL,
            () => this.toggleDash());

        this.connect('destroy', () => Main.wm.removeKeybinding('dash-board-shortcut'));

        // DASH
        this.dash = new DashBoardModal(this.settings);
        this.dash.connect('closed', () => this.remove_style_pseudo_class('active'));

        this.settings.connect('changed::dash-layout',
            () => {
                this.dash.destroy();
                this.dash = new DashBoardModal(this.settings);
                this.dash.connect('closed', () => this.remove_style_pseudo_class('active'));
            }
        );
    }
    openDash(){
        this.opened = true;
        this.dash.open();
        this.add_style_pseudo_class('active');
    }
    closeDash(){
        this.opened = false;
        this.dash.close();
        this.remove_style_pseudo_class('active');
    }
    toggleDash(){
        if(this.opened)
            this.closeDash();
        else
            this.openDash();
    }
});

class Extension {
    constructor() {
        this.activities = Main.panel.statusArea.activities;
        this.activitiesBin = this.activities.get_parent();
    }

    enable() {
        this.settings = ExtensionUtils.getSettings();

        this.settings.connect('changed::panel-button-position', () => this.addButtonToPanel());
        this.settings.connect('changed::panel-button-position-offset', () => this.addButtonToPanel());
        this.settings.connect('changed::replace-activities-button', () => this.addButtonToPanel());

        this.addButtonToPanel();
    }

    disable() {
        this._panelButton.destroy();
        this._panelButton = null;
    }

    addButtonToPanel(){
        if(this._panelButton){
            this._panelButton.destroy();
            this._panelButton = null;
        }
        this._panelButton = new DashBoardPanelButton(this.settings);

        if(this.settings.get_boolean('replace-activities-button')){
            this.activitiesBin.set_child(this._panelButton);
        }else{
            this.activitiesBin.set_child(this.activities);
            let pos = this.settings.get_int('panel-button-position');
            let offset = this.settings.get_int('panel-button-position-offset');
            switch (pos) {
                case 0:
                    Main.panel._leftBox.insert_child_at_index(this._panelButton, offset);
                    break;
                case 1:
                    Main.panel._centerBox.insert_child_at_index(this._panelButton, offset);
                    break;
                case 2:
                    Main.panel._rightBox.insert_child_at_index(this._panelButton, offset);
                default:
                    break;
            }
        }

    
    }
}

function init() {
    return new Extension();
}