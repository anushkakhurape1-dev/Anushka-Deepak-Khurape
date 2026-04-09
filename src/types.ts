export type UserRole = 'user' | 'collector' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  greenPoints: number;
  totalEWasteRecycled: number;
  totalCO2Saved: number;
  createdAt: any;
}

export type PickupStatus = 'pending' | 'accepted' | 'arrived' | 'picked_up' | 'completed' | 'cancelled';

export interface PickupRequest {
  id?: string;
  userId: string;
  category: string;
  condition: string;
  brand: string;
  model: string;
  year: number;
  weight: number;
  accessories: string[];
  photos: string[];
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  floor: string;
  hasLift: boolean;
  status: PickupStatus;
  estimatedPayout: number;
  actualPayout?: number;
  collectorId?: string;
  scheduledTime?: any;
  createdAt: any;
  updatedAt: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
