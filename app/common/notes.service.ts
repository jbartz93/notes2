import {Storage, SqlStorage} from 'ionic-framework/ionic';
import {Note} from './note';

export class NotesService {
	private _storage: Storage;
	private _active: number;
	private _formatted: Note[];
	public notes: Note[] = [];
	constructor() {
		this._storage = new Storage(SqlStorage);
		this._storage.get("notes").then((r) => {
			if(r !== null) {
				let n : Note[] = JSON.parse(r);
				this.notes.push.apply(this.notes, n);
				this._formatted.push.apply(this._formatted, n.map(this.getFormattedNote));
			}
		});
		let a = window.localStorage.getItem("activeNoteIndex");
		this._active = a ? parseInt(a) : 0;
	}
	save() : void {
		this._storage.set("notes", JSON.stringify(this.notes));
	}
	getFormattedNotes() : Note[] {
		this._formatted = [];
		for(var i = 0; i < this.notes.length; i++) {
			let copy = this.getFormattedNote(this.notes[i]);
			this._formatted.push(copy);
		}
		return this._formatted;
	}
	getFormattedNote(note : Note) : Note {
		let content = note.content;
		content = content.replace(/</g, "&lt;");
		content = content.replace(/>/g, "&gt;");
		//The * symbol itself seems to count as the beginning of the word, or something
		content = content.replace(/\B\*\S.*?\*/g, function(x) {
			return "<strong>" + x.slice(1, -1) + "</strong>";
		});
		content = content.replace(/\b_\S.*?_/g, function(x) {
			return "<em>" + x.slice(1, -1) + "</em>";
		});
		let copy = Object.assign({}, note);
		copy.formatted = content.split("\n");
		if(!copy.title) {
			copy.title = copy.formatted[0] || "";
		}
		return copy;
	}
	getTitle(note: Note) : string {
		if(note.title) {
			return note.title;
		}
		if(note.formatted) {
			return note.formatted[0] || "";
		}
		let text = note.content;
		let i = text.search(/(\n|\r)/);
		let len = 20;
		if (i == -1)
		{
			i = text.length;
		}
		if (i <= len + 3)
		{
			return text.slice(0, i);
		}
		else
		{
			var j = text.lastIndexOf(" ", len);
			if (j < 0)
			{
				return text.slice(0, len) + "...";
			}
			return text.slice(0, j) + "...";
		}
	}
	getActiveIndex() {
		return this._active;
	}
	setActiveIndex(i : number) {
		this._active = i;
		window.localStorage.setItem("activeNoteIndex", ""+i);
	}
	importNotes(text : string) {
		try {
			var n = JSON.parse(text);
			this.notes.push.apply(this.notes, n);
		} catch(e) {
			return false;
		}
		return true;

	}
}