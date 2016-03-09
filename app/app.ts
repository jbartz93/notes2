import {App, Platform, Events, IonicApp} from 'ionic-framework/ionic';
import {HomePage} from './pages/home/home';
import {NotesService} from './common/notes.service';
import {Note} from './common/note';
import {ImportNotes} from './pages/import/import';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';


@App({
	templateUrl: "build/app.html",
	config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
	providers: [NotesService]
})
export class MyApp {
	rootPage: Type = HomePage;
	notes: Note[];

	constructor(platform: Platform, private _notesService : NotesService, private _events: Events, private _app: IonicApp) {
		platform.ready().then(() => {
			this.notes = this._notesService.notes;
		// The platform is now ready. Note: if this callback fails to fire, follow
		// the Troubleshooting guide for a number of possible solutions:
		//
		// Okay, so the platform is ready and our plugins are available.
		// Here you can do any higher level native things you might need.
		//
		// First, let's hide the keyboard accessory bar (only works natively) since
		// that's a better default:
		//
		// Keyboard.setAccessoryBarVisible(false);
		//
		// For example, we might change the StatusBar color. This one below is
		// good for dark backgrounds and light text:
		// StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
		});
	}
	openNote(i : number) {
		this._events.publish("note_clicked", i);
	}
	getTitle(n : Note) {
		return this._notesService.getTitle(n);
	}
	importAll() {
   		let nav = this._app.getComponent('nav');
		nav.push(ImportNotes);
	}
	shareAll() {
		window.plugins.socialsharing.share(JSON.stringify(this.notes));
	}
}
