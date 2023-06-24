export interface UserInterface {
  email: string;
  name: string;
  dateOfJoin: Date;
  currentFirmId: string;
  business: {
    [key: string]: {
      firmid: string;
      phoneNumber: string;
      name: string;
      address: string;
      gst: string;
      category: string;
      type: string;
      dateOfCreation: Date;
    };
  };
  uid: string;
}
