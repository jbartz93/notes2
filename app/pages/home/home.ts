import {Page, Alert, NavController, Events, MenuController} from 'ionic-framework/ionic';
import {Note} from '../../common/note';
import {NotesService} from '../../common/notes.service';
import {AddNote} from '../modify/add'
import {EditNote} from '../modify/edit'

@Page({
  	templateUrl: 'build/pages/home/home.html',
})
export class HomePage {
	notes: Note[];
	activeNote: number;
	navTo: any;
	slider: any;
	options: any = {
		initialSlide: this._notesService.getActiveIndex(),
		onInit: s => {
			this.slider = s;
		}
	};
	constructor(private _notesService: NotesService, private _nav : NavController, events: Events, private _menu : MenuController) {
		this.navTo = {
			add: AddNote
		}
		events.subscribe("note_clicked", (i) => {
			this._notesService.setActiveIndex(i);
			this.slider.slideTo(i);
		});
	}
	onPageWillEnter() {
		this.notes = this._notesService.getFormattedNotes();
		this.activeNote = this._notesService.getActiveIndex();
		this._menu.enable(true);
	}
	onPageDidEnter() {
		if(this.slider) {
			this.slider.slideTo(this._notesService.getActiveIndex(), 0);
		}
	}
	onPageWillLeave() {
		this._menu.enable(false);
	}
	edit() {
		this._nav.push(EditNote, {id: this._notesService.getActiveIndex()});
	}
	remove() {
		let confirm = Alert.create({
			title: "Are you sure?",
			buttons: [
				"Cancel",
				{
					text:"Delete",
					cssClass: "danger",
					handler: () => {
						this._notesService.notes.splice(this._notesService.getActiveIndex(), 1);
						if(this._notesService.getActiveIndex() >= this._notesService.notes.length) {
							this._notesService.setActiveIndex(this._notesService.notes.length-1);
						}
						this._notesService.save();
					}
				}
			]
		});
		this._nav.present(confirm);
	}
	share() {
		window.plugins.socialsharing.share(JSON.stringify(this.notes));
	}
	slideChange(index : number) {
		this.activeNote = index;
		this._notesService.setActiveIndex(index);
	}
}
