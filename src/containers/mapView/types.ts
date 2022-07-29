export type MapViewProps = {
  map: any,
  device: Device,
  navigation: any,
  openMap: (data: any) => any,
  closeMap: () => any,
  getLayers: (index:number, cb:()=> Promise<void>) => any,
  setCurrentLayer: () => any,
}