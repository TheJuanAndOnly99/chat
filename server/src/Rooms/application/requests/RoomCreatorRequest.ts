// Define a Request type alias 
export type RoomCreatorRequest = {
  Uid: string,
  users?: string[],
  messages?: string[],
};