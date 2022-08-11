export interface Users {
  uid: string;
  dateCreated: string;
  exitSwitch: boolean;
  name: string;
  address: string;
  email: string;
  phone: string;
  loginType: string;
  chatEnterSwitch: boolean;
  connectSwitch: boolean;
  plantSwitch: boolean;
  profileImage: string;
  bluetooth: Array<any>;
  myPlant: Array<any>;
}
