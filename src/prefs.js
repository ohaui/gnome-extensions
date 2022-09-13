'use strict';

const { Adw, Gio, Gtk, GObject } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {}

const SpinButton = GObject.registerClass(
class SpinButton extends Adw.ActionRow{
    _init(title, settings, settingName, low, high){
        super._init({ title: title });
    
        const gspin = Gtk.SpinButton.new_with_range(low, high, 1);
        gspin.valign = Gtk.Align.CENTER;
        settings.bind(
            settingName,
            gspin,
            'value',
            Gio.SettingsBindFlags.DEFAULT
        );
        this.add_suffix(gspin);
        this.activatable_widget = gspin;
    }
});

const Entry = GObject.registerClass(
class Entry extends Adw.ActionRow{
    _init(title, settings, settingName){
        super._init({ title: title });
    
        const gentry = new Gtk.Entry({ valign: Gtk.Align.CENTER, });
        gentry.connect('activate',
            () => settings.set_string(settingName, gentry.buffer.text));
        settings.bind(
            settingName,
            gentry.buffer,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );
        this.add_suffix(gentry);
        this.activatable_widget = gentry;
    }
});

const DropDown = GObject.registerClass(
class DropDown extends Adw.ActionRow{
    _init(title, settings, settingName, list){
        super._init({ title: title });
    
        const glist = Gtk.DropDown.new_from_strings(list);
        glist.valign = Gtk.Align.CENTER;
        settings.bind(
            settingName,
            glist,
            'selected',
            Gio.SettingsBindFlags.DEFAULT
        );
        this.add_suffix(glist);
        this.activatable_widget = glist;
    }
});

const Switch = GObject.registerClass(
class Switch extends Adw.ActionRow{
    _init(title, settings, settingName){
        super._init({ title: title });

        const gswitch = new Gtk.Switch({
            active: settings.get_boolean(settingName),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            settingName,
            gswitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        this.add_suffix(gswitch);
        this.activatable_widget = gswitch;
    }
});

const MainPage = GObject.registerClass(
class MainPage extends Adw.PreferencesPage{
    _init(settings){
        super._init({
            title: "Aylur's Widgets",
            icon_name: 'org.gnome.Shell.Extensions-symbolic'
        });
        
        const group = new Adw.PreferencesGroup();
        this.add(group);

        group.add(new Switch('Battery Bar', settings, 'battery-bar'));
        group.add(new Switch('Dash Board', settings, 'dash-board'));
        group.add(new Switch('DateMenu Mod', settings, 'date-menu-mod'));
        group.add(new Switch('Media Player', settings, 'media-player'));
        group.add(new Switch('Power Menu', settings, 'power-menu'));
        group.add(new Switch('Workspace Indicator', settings, 'workspace-indicator'));
    }
});

const BatteryBarPage = GObject.registerClass(
class BatteryBarPage extends Adw.PreferencesPage{
    _init(settings){
        super._init({
            title: 'Battery Bar',
            icon_name: 'battery-symbolic'
        });

        const group = new Adw.PreferencesGroup();
        this.add(group);

        group.add(new DropDown('Position', settings, 'battery-bar-position', ["Left", "Center", "Right"]));
        group.add(new SpinButton('Offset', settings, 'battery-bar-offset', 0, 12));
        group.add(new Switch('Show Icon', settings, 'battery-bar-show-icon'));
        group.add(new Switch('Show Percentage', settings, 'battery-bar-show-percentage'));
        group.add(new SpinButton('Width', settings, 'battery-bar-width', 50, 800));

    }
});

const DashBoardPage = GObject.registerClass(
class DashBoardPage extends Adw.PreferencesPage{
    _init(settings){
        super._init({
            title: 'Dash Board',
            icon_name: 'org.gnome.Settings-applications-symbolic'
        });

        const buttonGroup = new Adw.PreferencesGroup({ title: 'Panel Button' });
        this.add(buttonGroup);

        buttonGroup.add(new Switch('Replace Activities Button', settings, 'dash-replace-activities-button'));
        buttonGroup.add(new Switch('Hide', settings, 'dash-button-hide'));
        buttonGroup.add(new Entry('Label', settings, 'dash-button-label'));
        buttonGroup.add(new Switch('Hide Icon', settings, 'dash-button-icon-hide'));
        buttonGroup.add(new Entry('Icon Path', settings, 'dash-button-icon-path'));
        buttonGroup.add(new DropDown('Position', settings, 'dash-button-position', ["Left", "Center", "Right"]));
        buttonGroup.add(new SpinButton('Offset', settings, 'dash-button-offset', 0, 12));

        const dashGroup = new Adw.PreferencesGroup({ title: 'Dash' });
        this.add(dashGroup);

        dashGroup.add(new SpinButton('Layout', settings, 'dash-layout', 1, 3));
    }
});

const DateMenuModPage = GObject.registerClass(
class DateMenuModPage extends Adw.PreferencesPage{
    _init(settings){
        super._init({
            title: 'DateMenu Mod',
            icon_name: 'org.gnome.clocks-symbolic'
        });

        const group = new Adw.PreferencesGroup();
        this.add(group);

        group.add(new Switch('Remove Padding', settings, 'date-menu-remove-padding'));
        group.add(new DropDown('Indicator Position', settings, 'date-menu-indicator-position', ["Left", "Right"]));
        group.add(new Entry('Date Format', settings, 'date-menu-date-format'));
        group.add(new Switch('Mirrored', settings, 'date-menu-mirror'));
    }
});

const MediaPlayerPage = GObject.registerClass(
class MediaPlayerPage extends Adw.PreferencesPage{
    _init(settings){
        super._init({
            title: 'Media Player',
            icon_name: 'applications-multimedia-symbolic'
        });

        const group = new Adw.PreferencesGroup();
        this.add(group);

        group.add(new DropDown('Position', settings, 'media-player-position', ["Left", "Center", "Right"]));
        group.add(new SpinButton('Offset', settings, 'media-player-offset', 0, 12));
        group.add(new Entry('Prefer', settings, 'media-player-prefer'));
        group.add(new DropDown('Layout', settings, 'media-player-layout', ["Normal", "Compact"]));
    }
});

const PowerMenuPage = GObject.registerClass(
class PowerMenuPage extends Adw.PreferencesPage{
    _init(settings){
        super._init({
            title: 'Power Menu',
            icon_name: 'system-shutdown-symbolic'
        });

        const group = new Adw.PreferencesGroup();
        this.add(group);

        group.add(new DropDown('Position', settings, 'power-menu-position', ["Right", "Left"]));
        group.add(new DropDown('Layout', settings, 'power-menu-layout', ["2x2", "1x4"]));
        group.add(new DropDown('Style', settings, 'power-menu-style', ["Round", "Rectangle"]));
    }
});

const WorkspaceIndicator = GObject.registerClass(
class WorkspaceIndicator extends Adw.PreferencesPage{
    _init(settings){
        super._init({
            title: 'Workspace Indicator',
            icon_name: 'multitasking-symbolic'
        });

        const group = new Adw.PreferencesGroup();
        this.add(group);

        group.add(new DropDown('Position', settings, 'workspace-indicator-position', ["Left", "Center", "Right"]));
        group.add(new SpinButton('Offset', settings, 'workspace-indicator-offset', 0, 12));
    }
});

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();
    window.add(new MainPage(settings));
    window.add(new BatteryBarPage(settings));
    window.add(new DashBoardPage(settings));
    window.add(new DateMenuModPage(settings));
    window.add(new MediaPlayerPage(settings));
    window.add(new PowerMenuPage(settings));
    window.add(new WorkspaceIndicator(settings));
}