export type City = {
  id: string;
  name: string;
  isActive: boolean;
  imageUrl: string;
};

export type CityPart = {
  id: string;
  name: string;
  cityId: string;
  pointsRequired: number;
  isActive: boolean;
  unlockCost: number;
};
