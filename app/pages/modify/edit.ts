import {Page, NavController, NavParams, Alert} from 'ionic-framework/ionic';
import {NotesService} from '../../common/notes.service';
import {Note} from '../../common/note';

@Page({
	templateUrl: 'build/pages/modify/modify.html'
})
export class EditNote {
	public note : Note;
	public changed: boolean = false;
	public idx: number;
	constructor(private _notesService: NotesService, private _nav: NavController, params: NavParams) {
		this.idx = params.get("id");
		this.note = _notesService.notes[this.idx];
	}
	save() {
		this.note.lastEdited = new Date().toLocaleString();
		this._notesService.notes[this.idx] = Object.assign({}, this.note);
		this._notesService.save();
		this.changed = false;
	}
	finish() {
		this.save();
		this._nav.pop();
	}
	setTitle() {
		let prompt = Alert.create({
			title: "Set Title",
			inputs: [
				{name: "title"}
			],
			buttons: [
				{
					text: "Cancel"
				},
				{
					text: "Set",
					handler: data => {
						this.note.title = data.title;
						this.changed = true;
					}
				}
			]
		});
		this._nav.present(prompt);
	}
}