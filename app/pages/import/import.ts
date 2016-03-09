import {Page, NavController, Alert} from 'ionic-framework/ionic';
import {NotesService} from '../../common/notes.service';
import {Note} from '../../common/note';

@Page({
	templateUrl: 'build/pages/import/import.html'
})
export class ImportNotes {
	content: string;
	constructor(private _notesService : NotesService, private _nav : NavController) {}
	finish() {
		if(!this._notesService.importNotes(this.content)) {
			let d = Alert.create({
				title: "Import failed",
				message : 'Could not parse the data. Make sure it was copied correctly.',
				buttons: ["Ok"]
			});
			this._nav.present(d);
		} else {
			this._nav.pop();
		}
	}
}