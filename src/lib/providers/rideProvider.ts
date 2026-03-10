export interface RideProvider {
  createRide(data: any): Promise<any>;
}
