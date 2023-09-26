// Define a Request type alias 
export type RoomCreatorRequest = {
  Uid: string,
  name: string,
  users?: string[],
  messages?: string[],
};