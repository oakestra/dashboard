export interface Job {
  _id: Id;
  job_name: string;
  RR_ip: string;
  api_version: string;
  app_name: string;
  app_ns: string;
  cluster_location: string;
  image: string;
  image_runtime: string;
  node: string;
  port: number;
  requirements: Requirements;
  service_ip_list?: (ServiceIpListEntity)[] | null;
  service_name: string;
  service_ns: string;
  status: string;
}
export interface Id {
  $oid: string;
}
export interface Requirements {
  cpu: number;
  memory: number;
  node: string;
}
export interface ServiceIpListEntity {
  IpType: string;
  Address: string;
}
