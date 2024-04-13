export class Note {
  id: number;
  title: string;
  content: string;
  userId: number;

  constructor(id: number, title: string, content: string, userId: number) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
  }

  static async findAll() {
    return MOCK_NOTES;
  }

  static async findOne({ id }: { id: number }) {
    return MOCK_NOTES.find(note => note.id === id);
  }

  static async create({ title, content, userId }: { title: string, content: string, userId: number }) {
    const id = MOCK_NOTES.length + 1;
    const note = new Note(id, title, content, userId);
    MOCK_NOTES.push(note);
    return { insertId: id };
  }

  static async update({ id, title, content }: { id: number, title: string, content: string }) {
    const note = MOCK_NOTES.find(note => note.id === id);
    if (!note) return null;
    note.title = title;
    note.content = content;
    return note;
  }

  static async delete({ id }: { id: number }) {
    const index = MOCK_NOTES.findIndex(note => note.id === id);
    if (index === -1) return { message: "Note not found" };
    MOCK_NOTES.splice(index, 1);
    return { message: "Note deleted successfully" };
  }
}

export const MOCK_NOTES: Note[] = [];