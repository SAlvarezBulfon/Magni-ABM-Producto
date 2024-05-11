import DataModel from "./DataModel";

export default interface IEmpresa extends DataModel<IEmpresa>{
    nombre: string;
    razonSocial: string;
    cuil: number;
}