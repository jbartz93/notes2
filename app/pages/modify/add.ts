import {Page, NavController, Alert} from 'ionic-framework/ionic';
import {NotesService} from '../../common/notes.service';
import {Note} from '../../common/note';

@Page({
	templateUrl: 'build/pages/modify/modify.html'
})
export class AddNote {
	public note : Note = {content: "", lastEdited: ""};
	idx: number = null;
	changed: boolean = false;
	constructor(private _notesService: NotesService, private _nav: NavController) {
	}
	finish() {
		this.save();
		this._nav.pop();
	}
	save() {
		this.note.lastEdited = new Date().toLocaleString();
		if(this.idx === null) {
			this.add();
		} else {
			this._notesService.notes[this.idx] = Object.assign({}, this.note);
			this._notesService.save();
		}
		this.changed = false;
	}
	add() {
		let copy = Object.assign({}, this.note);
		this.idx = this._notesService.notes.push(copy) - 1;
		this._notesService.save();
		this._notesService.setActiveIndex(this.idx);
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