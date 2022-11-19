import { IId } from './id';

export interface ICluster {
  _id: IId;
  cluster_name: string;
  cluster_radius: number;
  cluster_longitude: string;
  cluster_latitude: string;
}
