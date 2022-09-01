export interface Diary {
  diaryId: string;
  dateCreated: string;
  content: string;
  images: Array<any>;
  postDate: string;
  userId: string;
  deleteSwitch: boolean;
}
